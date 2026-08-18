import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import "./Presupuesto.css";

const API_URL = "https://erp-unilibre-production.up.railway.app";

export default function Presupuesto() {

  const [convocatorias, setConvocatorias] = useState([]);
  const [convocatoria, setConvocatoria] = useState("");

  const [datos, setDatos] = useState([]);

  const [vista, setVista] = useState("detallado");

  const [cargando, setCargando] = useState(false);


  // =========================================================
  // CARGAR CONVOCATORIAS
  // =========================================================

  useEffect(() => {

    const cargarConvocatorias = async () => {

      try {

        const res = await fetch(
          `${API_URL}/presupuesto/convocatorias`
        );

        if (!res.ok) {
          throw new Error("Error cargando convocatorias");
        }

        const data = await res.json();

        setConvocatorias(
          Array.isArray(data) ? data : []
        );

      } catch (error) {

        console.error(
          "Error cargando convocatorias:",
          error
        );

      }

    };

    cargarConvocatorias();

  }, []);


  // =========================================================
  // CONSULTAR PRESUPUESTO
  // =========================================================

  useEffect(() => {

    const consultar = async () => {

      if (!convocatoria) {

        setDatos([]);

        return;
      }

      setCargando(true);

      try {

        const res = await fetch(
          `${API_URL}/presupuesto/consulta?convocatoria=${encodeURIComponent(
            convocatoria
          )}`
        );

        if (!res.ok) {
          throw new Error(
            "Error consultando presupuesto"
          );
        }

        const data = await res.json();

        setDatos(
          Array.isArray(data) ? data : []
        );

      } catch (error) {

        console.error(error);

        alert(
          "No fue posible consultar el presupuesto."
        );

        setDatos([]);

      } finally {

        setCargando(false);

      }

    };

    consultar();

  }, [convocatoria]);


  // =========================================================
  // FORMATO MONEDA
  // =========================================================

  const formatoMoneda = (valor) => {

    return Number(valor || 0).toLocaleString(
      "es-CO",
      {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
      }
    );

  };


  // =========================================================
  // FORMATO FECHA
  // =========================================================

  const formatoFecha = (fecha) => {

    if (!fecha) {
      return "";
    }

    const partes = String(fecha).split("-");

    if (partes.length === 3) {

      return `${partes[2]}/${partes[1]}/${partes[0]}`;

    }

    return fecha;

  };


  // =========================================================
  // CONSOLIDAR POR ROL
  // =========================================================

  const consolidarPorRol = () => {

    const acumulado = {};

    datos.forEach((fila) => {

      const rol = fila.rol || "SIN ROL";

      if (!acumulado[rol]) {

        acumulado[rol] = {
          rol,
          requerido: 0,
          asistencia: 0,
          presupuestado: 0,
          ejecutado: 0,
          diferencia: 0
        };

      }

      acumulado[rol].requerido += Number(
        fila.requerido || 0
      );

      acumulado[rol].asistencia += Number(
        fila.asistencia || 0
      );

      acumulado[rol].presupuestado += Number(
        fila.presupuestado || 0
      );

      acumulado[rol].ejecutado += Number(
        fila.ejecutado || 0
      );

      acumulado[rol].diferencia += Number(
        fila.diferencia || 0
      );

    });

    return Object.values(acumulado);

  };


  // =========================================================
  // CONSOLIDAR POR CIUDAD
  // =========================================================

  const consolidarPorCiudad = () => {

    const acumulado = {};

    datos.forEach((fila) => {

      const ciudad =
        fila.ciudad || "SIN CIUDAD";

      if (!acumulado[ciudad]) {

        acumulado[ciudad] = {
          ciudad,
          requerido: 0,
          asistencia: 0,
          presupuestado: 0,
          ejecutado: 0,
          diferencia: 0
        };

      }

      acumulado[ciudad].requerido += Number(
        fila.requerido || 0
      );

      acumulado[ciudad].asistencia += Number(
        fila.asistencia || 0
      );

      acumulado[ciudad].presupuestado += Number(
        fila.presupuestado || 0
      );

      acumulado[ciudad].ejecutado += Number(
        fila.ejecutado || 0
      );

      acumulado[ciudad].diferencia += Number(
        fila.diferencia || 0
      );

    });

    return Object.values(acumulado);

  };


  // =========================================================
  // DATOS DE LA VISTA
  // =========================================================

  const obtenerDatosVista = () => {

    if (vista === "rol") {
      return consolidarPorRol();
    }

    if (vista === "ciudad") {
      return consolidarPorCiudad();
    }

    return datos;

  };

  const datosVista = obtenerDatosVista();


  // =========================================================
  // EXPORTAR EXCEL
  // =========================================================

  const exportarExcel = () => {

    if (!datosVista.length) {

      alert(
        "No hay información para exportar."
      );

      return;
    }

    let filas = [];

    if (vista === "detallado") {

      filas = datosVista.map((fila) => ({

        Convocatoria:
          fila.convocatoria,

        Ciudad:
          fila.ciudad,

        Rol:
          fila.rol,

        Requerido:
          fila.requerido,

        Asistencia:
          fila.asistencia,

        Fecha:
          formatoFecha(fila.fecha),

        "Valor rol":
          fila.valor_rol,

        Presupuestado:
          fila.presupuestado,

        Ejecutado:
          fila.ejecutado,

        Diferencia:
          fila.diferencia

      }));

    } else if (vista === "rol") {

      filas = datosVista.map((fila) => ({

        Rol:
          fila.rol,

        Requerido:
          fila.requerido,

        Asistencia:
          fila.asistencia,

        Presupuestado:
          fila.presupuestado,

        Ejecutado:
          fila.ejecutado,

        Diferencia:
          fila.diferencia

      }));

    } else {

      filas = datosVista.map((fila) => ({

        Ciudad:
          fila.ciudad,

        Requerido:
          fila.requerido,

        Asistencia:
          fila.asistencia,

        Presupuestado:
          fila.presupuestado,

        Ejecutado:
          fila.ejecutado,

        Diferencia:
          fila.diferencia

      }));

    }


    const hoja =
      XLSX.utils.json_to_sheet(filas);

    const libro =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      libro,
      hoja,
      "Presupuesto"
    );

    XLSX.writeFile(
      libro,
      "Reporte_Presupuesto.xlsx"
    );

  };


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <div className="presupuesto">

      <h2>Presupuesto</h2>

      <p className="presupuesto-subtitulo">
        Comparación del presupuesto frente a la asistencia registrada.
      </p>


      {/* =====================================================
          FILTRO CONVOCATORIA
          ===================================================== */}

      <div className="presupuesto-filtros">

        <div className="presupuesto-campo">

          <label>
            Convocatoria
          </label>

          <select
            value={convocatoria}
            onChange={(e) =>
              setConvocatoria(e.target.value)
            }
          >

            <option value="">
              Seleccione convocatoria
            </option>

            {convocatorias.map(
              (item, index) => (

                <option
                  key={index}
                  value={item}
                >
                  {item}
                </option>

              )
            )}

          </select>

        </div>

      </div>


      {/* =====================================================
          CONTENIDO
          ===================================================== */}

      {convocatoria && (

        <>

          {/* =================================================
              BOTONES DE VISTA
              ================================================= */}

          <div className="presupuesto-vistas">

            <button
              className={
                vista === "detallado"
                  ? "activo"
                  : ""
              }
              onClick={() =>
                setVista("detallado")
              }
            >
              Detallado
            </button>


            <button
              className={
                vista === "rol"
                  ? "activo"
                  : ""
              }
              onClick={() =>
                setVista("rol")
              }
            >
              Consolidado por rol
            </button>


            <button
              className={
                vista === "ciudad"
                  ? "activo"
                  : ""
              }
              onClick={() =>
                setVista("ciudad")
              }
            >
              Consolidado por ciudad
            </button>

          </div>


          {/* =================================================
              EXPORTAR
              ================================================= */}

          <div className="presupuesto-acciones">

            <button
              className="btn-exportar-presupuesto"
              onClick={exportarExcel}
              disabled={!datosVista.length}
            >
              Exportar Excel
            </button>

          </div>


          {/* =================================================
              TABLA
              ================================================= */}

          <div className="presupuesto-tabla-contenedor">

            {cargando ? (

              <div className="presupuesto-cargando">
                Cargando información...
              </div>

            ) : datosVista.length === 0 ? (

              <div className="presupuesto-sin-registros">
                No existen registros para la convocatoria seleccionada.
              </div>

            ) : (

              <div className="presupuesto-tabla-scroll">


                {/* =================================================
                    DETALLADO
                    ================================================= */}

                {vista === "detallado" && (

                  <>

                    <div className="presupuesto-fila presupuesto-encabezado">

                      <span>Ciudad</span>
                      <span>Rol</span>
                      <span>Requerido</span>
                      <span>Asistencia</span>
                      <span>Fecha</span>
                      <span>Valor rol</span>
                      <span>Presupuestado</span>
                      <span>Ejecutado</span>
                      <span>Diferencia</span>

                    </div>


                    {datosVista.map(
                      (fila, index) => (

                        <div
                          className="presupuesto-fila"
                          key={index}
                        >

                          <span>
                            {fila.ciudad}
                          </span>

                          <span>
                            {fila.rol}
                          </span>

                          <span>
                            {fila.requerido}
                          </span>

                          <span>
                            {fila.asistencia}
                          </span>

                          <span>
                            {formatoFecha(
                              fila.fecha
                            )}
                          </span>

                          <span>
                            {formatoMoneda(
                              fila.valor_rol
                            )}
                          </span>

                          <span>
                            {formatoMoneda(
                              fila.presupuestado
                            )}
                          </span>

                          <span>
                            {formatoMoneda(
                              fila.ejecutado
                            )}
                          </span>

                          <span
                            className={
                              Number(
                                fila.diferencia
                              ) > 0
                                ? "presupuesto-positivo"
                                : Number(
                                    fila.diferencia
                                  ) < 0
                                ? "presupuesto-negativo"
                                : ""
                            }
                          >
                            {formatoMoneda(
                              fila.diferencia
                            )}
                          </span>

                        </div>

                      )
                    )}

                  </>

                )}


                {/* =================================================
                    CONSOLIDADO
                    ================================================= */}

                {vista !== "detallado" && (

                  <>

                    <div className="presupuesto-fila presupuesto-fila-consolidada presupuesto-encabezado">

                      <span>
                        {vista === "rol"
                          ? "Rol"
                          : "Ciudad"}
                      </span>

                      <span>
                        Requerido
                      </span>

                      <span>
                        Asistencia
                      </span>

                      <span>
                        Presupuestado
                      </span>

                      <span>
                        Ejecutado
                      </span>

                      <span>
                        Diferencia
                      </span>

                    </div>


                    {datosVista.map(
                      (fila, index) => (

                        <div
                          className="presupuesto-fila presupuesto-fila-consolidada"
                          key={index}
                        >

                          <span>
                            {vista === "rol"
                              ? fila.rol
                              : fila.ciudad}
                          </span>

                          <span>
                            {fila.requerido}
                          </span>

                          <span>
                            {fila.asistencia}
                          </span>

                          <span>
                            {formatoMoneda(
                              fila.presupuestado
                            )}
                          </span>

                          <span>
                            {formatoMoneda(
                              fila.ejecutado
                            )}
                          </span>

                          <span
                            className={
                              Number(
                                fila.diferencia
                              ) > 0
                                ? "presupuesto-positivo"
                                : Number(
                                    fila.diferencia
                                  ) < 0
                                ? "presupuesto-negativo"
                                : ""
                            }
                          >
                            {formatoMoneda(
                              fila.diferencia
                            )}
                          </span>

                        </div>

                      )
                    )}

                  </>

                )}

              </div>

            )}

          </div>

        </>

      )}

    </div>

  );

}