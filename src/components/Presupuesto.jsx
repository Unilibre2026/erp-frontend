
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import "./Presupuesto.css";

const API_URL = "https://erp-unilibre-production.up.railway.app";

export default function Presupuesto() {

  const [convocatorias, setConvocatorias] = useState([]);
  const [convocatoria, setConvocatoria] = useState("");
  const [ciudadFiltro, setCiudadFiltro] = useState("");

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
          throw new Error(
            "Error cargando convocatorias"
          );
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

        console.error(
          "Error consultando presupuesto:",
          error
        );

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
  // CIUDADES DISPONIBLES
  // =========================================================

  const ciudades = [
    ...new Set(
      datos
        .map((fila) => fila.ciudad)
        .filter(Boolean)
    )
  ].sort((a, b) =>
    String(a).localeCompare(
      String(b),
      "es",
      {
        sensitivity: "base"
      }
    )
  );


  // =========================================================
  // DATOS FILTRADOS POR CIUDAD
  // =========================================================

  const datosFiltrados = ciudadFiltro
    ? datos.filter(
        (fila) =>
          String(fila.ciudad || "").trim() ===
          String(ciudadFiltro).trim()
      )
    : datos;


  // =========================================================
  // TIPOS DE REPORTE DISPONIBLES
  //
  // Se obtienen directamente de la respuesta del backend.
  //
  // No se escriben tipos fijos aquí.
  // =========================================================

  const tiposReporte = [
    ...new Set(
      datosFiltrados
        .map((fila) =>
          String(
            fila.tipo_reporte || ""
          ).trim()
        )
        .filter(Boolean)
    )
  ];


  // =========================================================
  // ORDEN DE TIPOS DE REPORTE
  //
  // El backend ya entrega un orden adecuado.
  // Aquí solamente conservamos el orden en que aparecen.
  // =========================================================

  const tiposReporteOrdenados = tiposReporte;


  // =========================================================
  // CONSOLIDAR DETALLE
  //
  // CLAVE:
  //
  // Convocatoria
  // + Tipo de reporte
  // + Ciudad
  // + Rol
  // + Fecha
  //
  // Esto evita mezclar:
  //
  // REPORTE INICIAL
  // AUDITORIA 1
  // AUDITORIA 2
  // CIERRE
  // =========================================================

  const consolidarDetalle = (datosBase = datosFiltrados) => {

    const acumulado = {};

    datosBase.forEach((fila) => {

      const tipoReporte =
        String(
          fila.tipo_reporte || ""
        ).trim() || "SIN TIPO DE REPORTE";


      const clave =
        `${fila.convocatoria}|` +
        `${tipoReporte}|` +
        `${fila.ciudad}|` +
        `${fila.rol}|` +
        `${fila.fecha}`;


      if (!acumulado[clave]) {

        acumulado[clave] = {

          convocatoria:
            fila.convocatoria,

          tipo_reporte:
            tipoReporte,

          ciudad:
            fila.ciudad,

          rol:
            fila.rol,

          fecha:
            fila.fecha,

          requerido: 0,

          asistencia: 0,

          presupuestado: 0,

          ejecutado: 0,

          diferencia: 0

        };

      }


      acumulado[clave].requerido += Number(
        fila.requerido || 0
      );


      acumulado[clave].asistencia += Number(
        fila.asistencia || 0
      );


      acumulado[clave].presupuestado += Number(
        fila.presupuestado || 0
      );


      acumulado[clave].ejecutado += Number(
        fila.ejecutado || 0
      );


      acumulado[clave].diferencia += Number(
        fila.diferencia || 0
      );

    });


    return Object.values(acumulado).sort((a, b) => {

      // Primero: ciudad
      const ciudadComparacion =
        String(a.ciudad || "").localeCompare(
          String(b.ciudad || ""),
          "es",
          {
            sensitivity: "base"
          }
        );


      if (ciudadComparacion !== 0) {
        return ciudadComparacion;
      }


      // Segundo: fecha
      const fechaA =
        String(a.fecha || "");

      const fechaB =
        String(b.fecha || "");


      if (fechaA !== fechaB) {
        return fechaA.localeCompare(
          fechaB
        );
      }


      // Tercero: rol
      return String(
        a.rol || ""
      ).localeCompare(
        String(b.rol || ""),
        "es",
        {
          sensitivity: "base"
        }
      );

    });

  };


  // =========================================================
  // CONSOLIDAR POR ROL
  //
  // También se separa por tipo de reporte.
  // =========================================================

  const consolidarPorRol = (
    datosBase = datosFiltrados
  ) => {

    const detalle =
      consolidarDetalle(
        datosBase
      );


    const acumulado = {};


    detalle.forEach((fila) => {

      const tipoReporte =
        fila.tipo_reporte ||
        "SIN TIPO DE REPORTE";


      const rol =
        fila.rol ||
        "SIN ROL";


      const clave =
        `${tipoReporte}|${rol}`;


      if (!acumulado[clave]) {

        acumulado[clave] = {

          tipo_reporte:
            tipoReporte,

          rol,

          requerido: 0,

          asistencia: 0,

          presupuestado: 0,

          ejecutado: 0,

          diferencia: 0

        };

      }


      acumulado[clave].requerido += Number(
        fila.requerido || 0
      );


      acumulado[clave].asistencia += Number(
        fila.asistencia || 0
      );


      acumulado[clave].presupuestado += Number(
        fila.presupuestado || 0
      );


      acumulado[clave].ejecutado += Number(
        fila.ejecutado || 0
      );


      acumulado[clave].diferencia += Number(
        fila.diferencia || 0
      );

    });


    return Object.values(
      acumulado
    );

  };


  // =========================================================
  // CONSOLIDAR POR CIUDAD
  //
  // También se separa por tipo de reporte.
  // =========================================================

  const consolidarPorCiudad = (
    datosBase = datosFiltrados
  ) => {

    const detalle =
      consolidarDetalle(
        datosBase
      );


    const acumulado = {};


    detalle.forEach((fila) => {

      const tipoReporte =
        fila.tipo_reporte ||
        "SIN TIPO DE REPORTE";


      const ciudad =
        fila.ciudad ||
        "SIN CIUDAD";


      const clave =
        `${tipoReporte}|${ciudad}`;


      if (!acumulado[clave]) {

        acumulado[clave] = {

          tipo_reporte:
            tipoReporte,

          ciudad,

          requerido: 0,

          asistencia: 0,

          presupuestado: 0,

          ejecutado: 0,

          diferencia: 0

        };

      }


      acumulado[clave].requerido += Number(
        fila.requerido || 0
      );


      acumulado[clave].asistencia += Number(
        fila.asistencia || 0
      );


      acumulado[clave].presupuestado += Number(
        fila.presupuestado || 0
      );


      acumulado[clave].ejecutado += Number(
        fila.ejecutado || 0
      );


      acumulado[clave].diferencia += Number(
        fila.diferencia || 0
      );

    });


    return Object.values(
      acumulado
    );

  };


  // =========================================================
  // OBTENER DATOS SEGÚN LA VISTA
  // =========================================================

  const obtenerDatosVista = (
    datosBase
  ) => {

    if (vista === "detallado") {

      return consolidarDetalle(
        datosBase
      );

    }


    if (vista === "rol") {

      return consolidarPorRol(
        datosBase
      );

    }


    if (vista === "ciudad") {

      return consolidarPorCiudad(
        datosBase
      );

    }


    return [];

  };


  // =========================================================
  // EXPORTAR EXCEL
  //
  // Incluye Tipo de reporte para mantener la separación.
  // =========================================================

  const exportarExcel = () => {

    if (!datosFiltrados.length) {

      alert(
        "No hay información para exportar."
      );

      return;

    }


    const datosExportacion =
      obtenerDatosVista(
        datosFiltrados
      );


    if (!datosExportacion.length) {

      alert(
        "No hay información para exportar."
      );

      return;

    }


    let filas = [];


    // =======================================================
    // DETALLADO
    // =======================================================

    if (vista === "detallado") {

      filas =
        datosExportacion.map(
          (fila) => ({

            Convocatoria:
              fila.convocatoria,

            "Tipo de reporte":
              fila.tipo_reporte,

            Ciudad:
              fila.ciudad,

            Rol:
              fila.rol,

            Requerido:
              fila.requerido,

            Asistencia:
              fila.asistencia,

            Fecha:
              formatoFecha(
                fila.fecha
              ),

            Presupuestado:
              fila.presupuestado,

            Ejecutado:
              fila.ejecutado,

            Diferencia:
              fila.diferencia

          })
        );

    }


    // =======================================================
    // CONSOLIDADO POR ROL
    // =======================================================

    else if (vista === "rol") {

      filas =
        datosExportacion.map(
          (fila) => ({

            "Tipo de reporte":
              fila.tipo_reporte,

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

          })
        );

    }


    // =======================================================
    // CONSOLIDADO POR CIUDAD
    // =======================================================

    else {

      filas =
        datosExportacion.map(
          (fila) => ({

            "Tipo de reporte":
              fila.tipo_reporte,

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

          })
        );

    }


    const hoja =
      XLSX.utils.json_to_sheet(
        filas
      );


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

      <h2>
        Presupuesto
      </h2>


      <p className="presupuesto-subtitulo">
        Comparación del presupuesto frente a la asistencia registrada.
      </p>


      {/* =====================================================
          FILTROS
          ===================================================== */}

      <div className="presupuesto-filtros">

        <div className="presupuesto-campo">

          <label>
            Convocatoria
          </label>


          <select
            value={convocatoria}
            onChange={(e) => {

              setConvocatoria(
                e.target.value
              );

              setCiudadFiltro("");

            }}
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


        <div className="presupuesto-campo">

          <label>
            Ciudad
          </label>


          <select
            value={ciudadFiltro}
            onChange={(e) =>
              setCiudadFiltro(
                e.target.value
              )
            }
            disabled={!datos.length}
          >

            <option value="">
              Todas
            </option>


            {ciudades.map(
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
                setVista(
                  "detallado"
                )
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
                setVista(
                  "rol"
                )
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
                setVista(
                  "ciudad"
                )
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
              onClick={
                exportarExcel
              }
              disabled={
                !datosFiltrados.length
              }
            >
              Exportar Excel
            </button>

          </div>


          {/* =================================================
              CONTENIDO DE TABLAS
              ================================================= */}

          <div className="presupuesto-tabla-contenedor">

            {cargando ? (

              <div className="presupuesto-cargando">
                Cargando información...
              </div>

            ) : datosFiltrados.length === 0 ? (

              <div className="presupuesto-sin-registros">
                No existen registros para la convocatoria seleccionada.
              </div>

            ) : tiposReporteOrdenados.length === 0 ? (

              <div className="presupuesto-sin-registros">
                No existen tipos de reporte registrados para la información seleccionada.
              </div>

            ) : (

              <div className="presupuesto-tabla-scroll">

                {/* =================================================
                    GENERAR UN BLOQUE POR CADA TIPO DE REPORTE
                    ================================================= */}

                {tiposReporteOrdenados.map(
                  (tipoReporte) => {

                    const datosTipoReporte =
                      datosFiltrados.filter(
                        (fila) =>
                          String(
                            fila.tipo_reporte || ""
                          ).trim() ===
                          String(
                            tipoReporte
                          ).trim()
                      );


                    const datosVista =
                      obtenerDatosVista(
                        datosTipoReporte
                      );


                    if (
                      !datosVista.length
                    ) {
                      return null;
                    }


                    // =============================================
                    // TOTALES DEL TIPO DE REPORTE
                    // =============================================

                    const totalPresupuestado =
                      datosVista.reduce(
                        (total, fila) =>
                          total +
                          Number(
                            fila.presupuestado ||
                            0
                          ),
                        0
                      );


                    const totalEjecutado =
                      datosVista.reduce(
                        (total, fila) =>
                          total +
                          Number(
                            fila.ejecutado ||
                            0
                          ),
                        0
                      );


                    const totalDiferencia =
                      datosVista.reduce(
                        (total, fila) =>
                          total +
                          Number(
                            fila.diferencia ||
                            0
                          ),
                        0
                      );


                    return (

                      <div
                        className="presupuesto-bloque-reporte"
                        key={
                          tipoReporte
                        }
                      >

                        {/* =========================================
                            TITULO DEL TIPO DE REPORTE
                            ========================================= */}

                        <div
                          className="presupuesto-titulo-reporte"
                        >

                          <span>
                            {tipoReporte}
                          </span>

                        </div>


                        {/* =========================================
                            TOTALES
                            ========================================= */}

                        <div className="presupuesto-totales">

                          <div className="presupuesto-total">

                            <span className="presupuesto-total-titulo">
                              Presupuestado
                            </span>

                            <span className="presupuesto-total-valor">
                              {formatoMoneda(
                                totalPresupuestado
                              )}
                            </span>

                          </div>


                          <div className="presupuesto-total">

                            <span className="presupuesto-total-titulo">
                              Ejecutado
                            </span>

                            <span className="presupuesto-total-valor">
                              {formatoMoneda(
                                totalEjecutado
                              )}
                            </span>

                          </div>


                          <div className="presupuesto-total">

                            <span className="presupuesto-total-titulo">
                              Diferencia
                            </span>

                            <span
                              className={
                                totalDiferencia > 0
                                  ? "presupuesto-total-valor presupuesto-positivo"
                                  : totalDiferencia < 0
                                  ? "presupuesto-total-valor presupuesto-negativo"
                                  : "presupuesto-total-valor"
                              }
                            >
                              {formatoMoneda(
                                totalDiferencia
                              )}
                            </span>

                          </div>

                        </div>


                        {/* =========================================
                            VISTA DETALLADA
                            ========================================= */}

                        {vista === "detallado" && (

                          <>

                            <div className="presupuesto-fila presupuesto-encabezado">

                              <span>
                                Ciudad
                              </span>

                              <span>
                                Rol
                              </span>

                              <span>
                                Requerido
                              </span>

                              <span>
                                Asistencia
                              </span>

                              <span>
                                Fecha
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
                              (fila, index) => {

                                const siguiente =
                                  datosVista[
                                    index + 1
                                  ];


                                const cambiaFecha =
                                  siguiente &&
                                  String(
                                    siguiente.fecha ||
                                    ""
                                  ) !==
                                  String(
                                    fila.fecha ||
                                    ""
                                  );


                                return (

                                  <div
                                    className="presupuesto-fila"
                                    key={index}
                                    style={{
                                      borderBottom:
                                        cambiaFecha
                                          ? "3px solid #777"
                                          : undefined
                                    }}
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

                                );

                              }
                            )}

                          </>

                        )}


                        {/* =========================================
                            VISTAS CONSOLIDADAS
                            ========================================= */}

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

                    );

                  }
                )}

              </div>

            )}

          </div>

        </>

      )}

    </div>

  );

}
