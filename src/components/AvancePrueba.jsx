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

      const res = await fetch(`${API_URL}/convocatorias`);

      const data = await res.json();

      const unicas = [
        ...new Set(
          data.map((c) => c.nombre_convocatoria)
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

      setAvance(data.indicadores || []);
      setResumen(data.resumen || []);

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

                  {/* ===========================
                        TABLA IZQUIERDA
                  =========================== */}

                  <div className="tabla-principal">

                      <table className="tabla-avance">

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

                                <td
                                  style={{
                                    textAlign: "center"
                                  }}
                                >
                                  {fila.total}
                                </td>

                                <td
                                  style={{
                                    textAlign: "center"
                                  }}
                                >
                                  {fila.aprobados}
                                </td>

                                <td
                                  style={{
                                    textAlign: "center"
                                  }}
                                >
                                  {fila.no_aprobados}
                                </td>

                                <td
                                  style={{
                                    textAlign: "center"
                                  }}
                                >
                                  {fila.pendientes}
                                </td>

                                <td
                                  style={{
                                    textAlign: "center"
                                  }}
                                >
                                  {fila.subsanados}
                                </td>

                              </tr>

                            ))

                          )

                        }

                      </tbody>

                    </table>

                  </div>

                  {/* ===========================
                        TABLA DERECHA
                  =========================== */}

                  <div className="tabla-resumen">

                      <table className="tabla-resumen-datos">

                      <thead>

                        <tr>

                          <th>Rol</th>
                          <th>Requerido.</th>
                          <th>Reclutado.</th>
                          <th> % de avance</th>

                        </tr>

                      </thead>

                      <tbody>

                        {

                          resumen.length === 0 ? (

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

                          ) : (

                            resumen.map((fila, resumenIndex) => (

                              <tr key={resumenIndex}>

                                <td>
                                  {fila.rol}
                                </td>

                                <td
                                  style={{
                                    textAlign: "center"
                                  }}
                                >
                                  {fila.requeridos}
                                </td>

                                <td
                                  style={{
                                    textAlign: "center"
                                  }}
                                >
                                  {fila.reclutados}
                                </td>

                                <td
                                  style={{
                                    textAlign: "center"
                                  }}
                                >
                                  {fila.porcentaje}%
                                </td>

                              </tr>

                            ))

                          )

                        }

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