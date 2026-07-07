import { useEffect, useState } from "react";
import "./AvancePrueba.css";

const API_URL = "https://erp-unilibre-production.up.railway.app";

function AvancePrueba() {

  const [convocatorias, setConvocatorias] = useState([]);
  const [convocatoria, setConvocatoria] = useState("");
  const [avance, setAvance] = useState([]);

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

      setAvance(data);

    } catch (error) {

      console.error(
        "Error cargando avance:",
        error
      );

      setAvance([]);

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

          onChange={(e) => {

            const valor = e.target.value;

            setConvocatoria(valor);

            cargarAvance(valor);

          }}

        >

          <option value="">
            Seleccione convocatoria
          </option>

          {

            convocatorias.map((c, index) => (

              <option
                key={index}
                value={c}
              >

                {c}

              </option>

            ))

          }

        </select>

      </div>

      <hr />

      <div className="contenedor-indicadores">

        {

          avance.length === 0 ? (

            <p
              style={{
                textAlign: "center"
              }}
            >
              No hay información
            </p>

          ) : (

            avance.map((item, index) => (

              <div

                key={index}

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

                          item.filas.length === 0 ? (

                            <tr>

                              <td
                                colSpan="7"
                                style={{
                                  textAlign: "center"
                                }}
                              >

                                Sin información

                              </td>

                            </tr>

                          ) : (

                            item.filas.map((fila, filaIndex) => (

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

                            ))

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
                              textAlign: "center"
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

            ))

          )

        }

      </div>

    </div>

  );

}

export default AvancePrueba;