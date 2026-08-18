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
  //
  // Se obtienen de los datos de la convocatoria seleccionada.
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
      { sensitivity: "base" }
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
  // CONSOLIDAR DETALLE
  //
  // CLAVE:
  // Convocatoria + Ciudad + Rol + Fecha
  //
  // El valor del rol NO participa en la agrupación.
  // =========================================================

  const consolidarDetalle = () => {

    const acumulado = {};

    datosFiltrados.forEach((fila) => {

      const clave =
        `${fila.convocatoria}|${fila.ciudad}|${fila.rol}|${fila.fecha}`;

      if (!acumulado[clave]) {

        acumulado[clave] = {

          convocatoria:
            fila.convocatoria,

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
      { sensitivity: "base" }
    );

  if (ciudadComparacion !== 0) {
    return ciudadComparacion;
  }

  // Segundo: fecha
  const fechaA = String(a.fecha || "");
  const fechaB = String(b.fecha || "");

  if (fechaA !== fechaB) {
    return fechaA.localeCompare(fechaB);
  }

  // Tercero: rol
  return String(a.rol || "").localeCompare(
    String(b.rol || ""),
    "es",
    { sensitivity: "base" }
  );

});

  };


  // =========================================================
  // CONSOLIDAR POR ROL
  // =========================================================

  const consolidarPorRol = () => {

    const detalle = consolidarDetalle();

    const acumulado = {};

    detalle.forEach((fila) => {

      const rol =
        fila.rol || "SIN ROL";

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

    const detalle = consolidarDetalle();

    const acumulado = {};

    detalle.forEach((fila) => {

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

    if (vista === "detallado") {

      return consolidarDetalle();

    }

    if (vista === "rol") {

      return consolidarPorRol();

    }

    if (vista === "ciudad") {

      return consolidarPorCiudad();

    }

    return [];

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


    // =======================================================
    // DETALLADO
    // =======================================================

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

        Presupuestado:
          fila.presupuestado,

        Ejecutado:
          fila.ejecutado,

        Diferencia:
          fila.diferencia

      }));

    }


    // =======================================================
    // CONSOLIDADO POR ROL
    // =======================================================

    else if (vista === "rol") {

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

    }


    // =======================================================
    // CONSOLIDADO POR CIUDAD
    // =======================================================

    else {

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
            onChange={(e) => {
              setConvocatoria(e.target.value);
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
              setCiudadFiltro(e.target.value)
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
                    VISTA DETALLADA
                    ================================================= */}

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
                    VISTAS CONSOLIDADAS
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