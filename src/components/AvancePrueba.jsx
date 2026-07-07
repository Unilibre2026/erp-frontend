import { useEffect, useState } from "react";
import "./AvancePrueba.css";

const API_URL = "https://erp-unilibre-production.up.railway.app";

function AvancePrueba() {

  const [convocatorias, setConvocatorias] = useState([]);
  const [convocatoria, setConvocatoria] = useState("");
  const [indicadores, setIndicadores] = useState([]);
  const [roles, setRoles] = useState([]);
  const [novedades, setNovedades] = useState([]);


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



  const cargarIndicadores = async (convocatoriaSeleccionada) => {


    if (!convocatoriaSeleccionada) {

      setIndicadores([]);

      return;

    }


    try {


      const res = await fetch(
        `${API_URL}/indicadores/${encodeURIComponent(convocatoriaSeleccionada)}`
      );


      if (!res.ok) {

        throw new Error(
          "Error consultando indicadores"
        );

      }


      const data = await res.json();


      setIndicadores(data);



    } catch (error) {


      console.error(
        "Error cargando indicadores:",
        error
      );


      setIndicadores([]);


    }


  };





  const cargarRoles = async (convocatoriaSeleccionada) => {


    if (!convocatoriaSeleccionada) {

      setRoles([]);

      return;

    }


    try {


      const res = await fetch(
        `${API_URL}/roles/${encodeURIComponent(convocatoriaSeleccionada)}`
      );


      if (!res.ok) {

        throw new Error(
          "Error consultando roles"
        );

      }


      const data = await res.json();


      setRoles(data);



    } catch (error) {


      console.error(
        "Error cargando roles:",
        error
      );


      setRoles([]);



    }


  };





  const cargarNovedades = async (convocatoriaSeleccionada) => {


    if (!convocatoriaSeleccionada) {

      setNovedades([]);

      return;

    }



    try {


      const res = await fetch(
        `${API_URL}/novedades`
      );


      if (!res.ok) {

        throw new Error(
          "Error consultando novedades"
        );

      }


      const data = await res.json();



      const filtradas = data.filter(
        (item) =>
          item.convocatoria === convocatoriaSeleccionada
      );



      setNovedades(filtradas);



    } catch (error) {


      console.error(
        "Error cargando novedades:",
        error
      );


      setNovedades([]);



    }


  };





  const obtenerHorario = (rol) => {


    const novedad = novedades.find(
      (item) =>
        item.rol === rol.rol &&
        (
          !rol.eje ||
          item.eje === rol.eje
        )
    );


    return novedad?.validador || "-";


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

          onChange={(e) => {


            const valor = e.target.value;


            setConvocatoria(valor);


            cargarIndicadores(valor);

            cargarRoles(valor);

            cargarNovedades(valor);



          }}

        >


          <option value="">
            Seleccione convocatoria
          </option>



          {
            convocatorias.map(
              (c, index) => (

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
          indicadores.map(
            (item) => (


              <div

                key={item.id}

                className="card-indicador"

              >



                <h3>
                  {item.indicador}
                </h3>




                <div className="contenedor-tablas">



                  <div className="tabla-principal">



                    <table>


                      <thead>

                        <tr>

                          <th>Rol</th>
                          <th>Horario</th>
                          <th>Total</th>
                          <th>Aprobados</th>
                          <th>No aprobados</th>
                          <th>Pendientes</th>
                          <th>Subsanados</th>

                        </tr>


                      </thead>




                      <tbody>


                        {
                          roles.length === 0 ? (


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


                            roles.map(
                              (rol) => (


                                <tr key={rol.id}>


                                  <td>
                                    {rol.rol}
                                  </td>



                                  <td>

                                    {
                                      obtenerHorario(rol)
                                    }

                                  </td>




                                  <td>0</td>

                                  <td>0</td>

                                  <td>0</td>

                                  <td>0</td>

                                  <td>0</td>



                                </tr>


                              )
                            )


                          )
                        }



                      </tbody>



                    </table>



                  </div>





                  <div className="tabla-resumen">


                    <table>


                      <thead>

                        <tr>

                          <th>Rol</th>
                          <th>Req.</th>
                          <th>Recl.</th>
                          <th>%</th>

                        </tr>


                      </thead>



                      <tbody>


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


                      </tbody>



                    </table>



                  </div>




                </div>




              </div>



            )
          )
        }



      </div>




    </div>



  );

}


export default AvancePrueba;