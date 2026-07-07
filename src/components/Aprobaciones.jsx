import { useEffect, useState } from "react";
import "./AvancePrueba.css";

const API_URL = "https://erp-unilibre-production.up.railway.app";

function AvancePrueba() {

  const [convocatorias, setConvocatorias] = useState([]);
  const [convocatoria, setConvocatoria] = useState("");
  const [avance, setAvance] = useState([]);
  const [resumen, setResumen] = useState([]);


  useEffect(() => {

    cargarConvocatorias();

  }, []);



  const cargarConvocatorias = async () => {

    try {

      const res = await fetch(
        `${API_URL}/convocatorias`
      );

      const data = await res.json();

      const unicas = [
        ...new Set(
          data.map(
            (c) => c.nombre_convocatoria
          )
        )
      ];

      setConvocatorias(unicas);


    } catch (error) {

      console.error(
        "Error cargando convocatorias:",
        error
      );

    }

  };



  const cargarAvance = async (convocatoriaSeleccionada) => {


    if (!convocatoriaSeleccionada) {

      setAvance([]);
      setResumen([]);

      return;

    }



    try {


      const res = await fetch(
        `${API_URL}/avance-prueba/${encodeURIComponent(convocatoriaSeleccionada)}`
      );


      if (!res.ok) {

        throw new Error(
          "Error consultando avance"
        );

      }



      const data = await res.json();


      setAvance(
        data.indicadores || []
      );


      setResumen(
        data.resumen || []
      );



    } catch (error) {


      console.error(
        "Error cargando avance:",
        error
      );


      setAvance([]);
      setResumen([]);


    }


  };



  return (

    <div className="avance-prueba">


      <h2>
        Avance por prueba
      </h2>



      <div className="filtro-convocatoria">


        <label>
          Convocatoria
        </label>



        <select

          value={convocatoria}

          onChange={(e)=>{

            const valor = e.target.value;

            setConvocatoria(valor);

            cargarAvance(valor);

          }}

        >


          <option value="">
            Seleccione convocatoria
          </option>



          {

            convocatorias.map(
              (c,index)=>(

                <option
                  key={index}
                  value={c}
                >

                  {c}

                </option>

              )

            )

          }



        </select>



      </div>



      <hr />



      <div className="contenedor-indicadores">


        {


          avance.length === 0 ? (


            <p
              style={{
                textAlign:"center"
              }}
            >

              No hay información

            </p>



          ) : (



            avance.map(
              (item,index)=>(



              <div

                key={index}

                className="card-indicador"

              >



                <h3>
                  {item.indicador}
                </h3>




                <div className="contenedor-tablas">



                  {/* ===========================
                        TABLA RESUMEN
                  =========================== */}



                  <div className="tabla-resumen">


                    <h4 className="titulo-tabla">
                      Resumen
                    </h4>



                    <table className="tabla-resumen-datos">


                      <thead>

                        <tr>

                          <th>
                            Rol
                          </th>

                          <th>
                            Req.
                          </th>

                          <th>
                            Recl.
                          </th>

                          <th>
                            %
                          </th>


                        </tr>


                      </thead>



                      <tbody>



                        {


                          resumen.length === 0 ? (


                            <tr>

                              <td
                                colSpan="4"
                                style={{
                                  textAlign:"center"
                                }}
                              >

                                Sin información

                              </td>


                            </tr>



                          ) : (



                            resumen.map(

                              (fila,resumenIndex)=>(


                                <tr key={resumenIndex}>


                                  <td>
                                    {fila.rol}
                                  </td>



                                  <td>
                                    {fila.requeridos}
                                  </td>



                                  <td>
                                    {fila.reclutados}
                                  </td>



                                  <td>
                                    {fila.porcentaje}%
                                  </td>



                                </tr>


                              )

                            )


                          )


                        }



                      </tbody>



                    </table>



                  </div>






                  {/* ===========================
                        TABLA AVANCE
                  =========================== */}



                  <div className="tabla-principal">


                    <h4 className="titulo-tabla">
                      Avance
                    </h4>



                    <table className="tabla-avance">



                      <thead>


                        <tr>

                          <th>
                            Rol
                          </th>

                          <th>
                            Horario
                          </th>

                          <th>
                            Total
                          </th>

                          <th>
                            Aprobados
                          </th>

                          <th>
                            No aprobados
                          </th>

                          <th>
                            Pendientes
                          </th>

                          <th>
                            Subsanados
                          </th>


                        </tr>


                      </thead>




                      <tbody>



                        {


                          item.filas.length === 0 ? (



                            <tr>


                              <td
                                colSpan="7"
                                style={{
                                  textAlign:"center"
                                }}
                              >

                                Sin información

                              </td>


                            </tr>




                          ) : (



                            item.filas.map(

                              (fila,filaIndex)=>(


                                <tr key={filaIndex}>


                                  <td>
                                    {fila.rol}
                                  </td>



                                  <td>
                                    {fila.horario || "-"}
                                  </td>



                                  <td>
                                    {fila.total}
                                  </td>



                                  <td>
                                    {fila.aprobados}
                                  </td>



                                  <td>
                                    {fila.no_aprobados}
                                  </td>



                                  <td>
                                    {fila.pendientes}
                                  </td>



                                  <td>
                                    {fila.subsanados}
                                  </td>



                                </tr>


                              )

                            )


                          )


                        }



                      </tbody>



                    </table>



                  </div>




                </div>



              </div>



              )

            )



          )


        }



      </div>



    </div>


  );

}



export default AvancePrueba;