import React, { useCallback, useEffect, useState } from "react";
import "./ReporteAsistencia.css";
import { exportarReporteAsistencia } from "../utils/ExportadorReporteAsistencia";

const API_URL = "https://erp-unilibre-production.up.railway.app";

const CIUDADES = [
  "Barranquilla",
  "Bogotá",
  "Bucaramanga",
  "Cali",
  "Cúcuta",
  "Medellín",
  "Montería",
  "Neiva",
  "Pasto",
  "Pereira",
  "Tunja",
  "Villavicencio",
];

const ROLES = [
  "Coordinador de Test",
  "Evaluador de Test",
  "Técnico garante de trabajo en alturas",
];

const JORNADAS = [
  "Jornada completa",
  "Media jornada",
];

const TIPOS_REPORTE = [
  "REPORTE INICIAL",
  "AUDITORIA 1",
];

const FECHA_HOY = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Bogota",
}).format(new Date());

export default function ReporteAsistencia() {

  // =========================
  // FORMULARIO
  // =========================

  const [convocatoria, setConvocatoria] = useState("");
  const [convocatorias, setConvocatorias] = useState([]);

  const [tipoReporte, setTipoReporte] = useState("");
  const [fecha, setFecha] = useState("");
  const [documento, setDocumento] = useState("");
  const [nombre, setNombre] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [rol, setRol] = useState("");
  const [jornada, setJornada] = useState("");
  const [observaciones, setObservaciones] = useState("");

  // =========================
  // CONSULTA
  // =========================

  const [reportes, setReportes] = useState([]);

  // Documento confirmado para consulta.
  // Se actualiza cuando el usuario termina de digitar
  // el documento y sale del campo.
  const [documentoConsulta, setDocumentoConsulta] = useState("");

  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // =========================
  // MODAL EXPORTAR
  // =========================

  const [mostrarModalExportar, setMostrarModalExportar] =
    useState(false);

  // =========================
  // USUARIO ACTUAL
  // =========================

  const usuario = localStorage.getItem("usuario") || "";

  // =========================
  // CARGAR CONVOCATORIAS
  // =========================

  const cargarConvocatorias = useCallback(async () => {

    try {

      const response = await fetch(
        `${API_URL}/convocatorias`
      );

      if (!response.ok) {
        throw new Error(
          "No fue posible consultar las convocatorias"
        );
      }

      const data = await response.json();

      setConvocatorias(data);

    } catch (err) {

      console.error(err);

      setError(
        "No fue posible cargar las convocatorias"
      );

    }
  }, []);

  // =========================
  // CONSULTAR REPORTES
  // =========================

  const cargarReportes = useCallback(async (
    convocatoriaConsulta,
    tipoReporteConsulta,
    documentoConsultaValor
  ) => {

    // No consultar si no están completos
    // los tres parámetros obligatorios.
    if (
      !convocatoriaConsulta ||
      !tipoReporteConsulta ||
      !documentoConsultaValor ||
      !documentoConsultaValor.trim()
    ) {
      setReportes([]);
      return;
    }

    try {

      setCargando(true);
      setError("");

      const params = new URLSearchParams({
        convocatoria: convocatoriaConsulta,
        tipo_reporte: tipoReporteConsulta,
        documento: documentoConsultaValor.trim(),
      });

      const response = await fetch(
        `${API_URL}/reporte-asistencia?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(
          "No fue posible consultar los reportes"
        );
      }

      const data = await response.json();

      // Filtro de seguridad en frontend.
      // Aunque el backend ya debe filtrar por los tres parámetros,
      // aquí evitamos mostrar accidentalmente registros de otra
      // convocatoria, tipo de reporte o documento.
      const datosFiltrados = Array.isArray(data)
        ? data.filter((reporte) => {

            const mismaConvocatoria =
              reporte.convocatoria ===
              convocatoriaConsulta;

            const mismoTipoReporte =
              reporte.tipo_reporte ===
              tipoReporteConsulta;

            const mismoDocumento =
              String(reporte.documento ?? "").trim() ===
              String(documentoConsultaValor).trim();

            return (
              mismaConvocatoria &&
              mismoTipoReporte &&
              mismoDocumento
            );

          })
        : [];

      setReportes(datosFiltrados);

    } catch (err) {

      console.error(err);

      setReportes([]);
      setError(err.message);

    } finally {

      setCargando(false);

    }
  }, []);
  // =========================
  // CARGAR DATOS AL ENTRAR
  // =========================

  useEffect(() => {

    cargarConvocatorias();

  }, [cargarConvocatorias]);

  // =========================
  // CONSULTAR AUTOMÁTICAMENTE
  // CUANDO ESTÁN LOS 3 PARÁMETROS
  // =========================

  useEffect(() => {

    if (
      convocatoria &&
      tipoReporte &&
      documentoConsulta
    ) {

      cargarReportes(
        convocatoria,
        tipoReporte,
        documentoConsulta
      );

    } else {

      // Si falta cualquiera de los tres parámetros,
      // la tabla debe permanecer vacía.
      setReportes([]);

    }

  }, [
    convocatoria,
    tipoReporte,
    documentoConsulta,
    cargarReportes,
  ]);

  // =========================
  // BUSCAR EXPERTO
  // =========================

  const buscarExperto = async (doc) => {

    const documentoLimpio = doc.trim();

    if (!documentoLimpio) {

      setNombre("");
      setDocumentoConsulta("");
      setReportes([]);
      return;
    }

    try {

      setError("");

      const response = await fetch(
        `${API_URL}/reporte-asistencia/buscar/${encodeURIComponent(
          documentoLimpio
        )}`
      );

      if (response.status === 404) {

        setNombre("");
        setDocumentoConsulta("");
        setReportes([]);

        setError(
          "No se encontró un experto con ese documento"
        );

        return;
      }

      if (!response.ok) {
        throw new Error(
          "Error al buscar el experto"
        );
      }

      const data = await response.json();

      setNombre(data.nombre);

      // Confirmamos el documento para activar la consulta.
      setDocumentoConsulta(documentoLimpio);

    } catch (err) {

      console.error(err);

      setNombre("");
      setDocumentoConsulta("");
      setReportes([]);
      setError(err.message);

    }
  };

  // =========================
  // CAMBIO DOCUMENTO
  // =========================

  const handleDocumentoChange = (e) => {

    const valor = e.target.value;

    setDocumento(valor);

    // Mientras se está digitando un nuevo documento,
    // no mostramos los registros anteriores.
    setDocumentoConsulta("");
    setReportes([]);

    if (!valor.trim()) {

      setNombre("");
      setError("");

    }

  };

  // =========================
  // CAMBIO CONVOCATORIA
  // =========================

  const handleConvocatoriaChange = (e) => {

    const valor = e.target.value;

    setConvocatoria(valor);

    // Evita mostrar registros de una convocatoria anterior
    // mientras se realiza la nueva consulta.
    setReportes([]);

  };

  // =========================
  // CAMBIO TIPO DE REPORTE
  // =========================

  const handleTipoReporteChange = (e) => {

    const valor = e.target.value;

    setTipoReporte(valor);

    // Evita mezclar REPORTE INICIAL con AUDITORIA 1.
    setReportes([]);

  };

  // =========================
  // GUARDAR REPORTE
  // =========================

  const guardarReporte = async () => {

    // Evitar doble envío
    if (guardando) {
      return;
    }

    setMensaje("");
    setError("");

    // =========================
    // VALIDAR CONVOCATORIA
    // =========================

    if (!convocatoria) {

      setError(
        "Seleccione la convocatoria"
      );

      return;
    }

    // =========================
    // VALIDAR TIPO DE REPORTE
    // =========================

    if (!tipoReporte) {

      setError(
        "Seleccione el tipo de reporte"
      );

      return;
    }

    if (!fecha) {

      setError(
        "Seleccione la fecha de la asistencia"
      );

      return;
    }

    if (fecha > FECHA_HOY) {

      setError(
        "La fecha de asistencia no puede ser posterior a la fecha actual."
      );

      return;
    }

    if (!documento.trim()) {

      setError(
        "Digite el documento del experto"
      );

      return;
    }

    if (!nombre) {

      setError(
        "El documento no corresponde a un experto válido"
      );

      return;
    }

    if (!ciudad) {

      setError(
        "Seleccione la ciudad"
      );

      return;
    }

    if (!rol) {

      setError(
        "Seleccione el rol"
      );

      return;
    }

    if (!jornada) {

      setError(
        "Seleccione la jornada"
      );

      return;
    }

    if (!observaciones.trim()) {

      setError(
        "Digite las observaciones de la asistencia"
      );

      return;
    }

    try {

      setGuardando(true);

      const response = await fetch(
        `${API_URL}/reporte-asistencia`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            convocatoria,

            tipo_reporte: tipoReporte,

            fecha,

            documento,

            ciudad,

            rol,

            jornada,

            observaciones,

            responsable_reporte:
              usuario,

          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.detail ||
          "No fue posible guardar el reporte"
        );

      }

      setMensaje(
        data.mensaje
      );

      // =========================
      // LIMPIAR CAMPOS DEL REGISTRO
      // =========================
      //
      // Se conservan convocatoria, tipo de reporte
      // y documento porque esos tres campos determinan
      // la consulta de la tabla y permiten registrar
      // varias novedades consecutivas para el mismo experto.
      //

      setFecha("");
      setCiudad("");
      setRol("");
      setJornada("");
      setObservaciones("");

      // Mantener el experto seleccionado y refrescar
      // inmediatamente sus registros correspondientes
      // a la convocatoria y tipo de reporte actuales.
      setDocumentoConsulta(documento.trim());

      await cargarReportes(
        convocatoria,
        tipoReporte,
        documento.trim()
      );

    } catch (err) {

      console.error(err);

      setError(
        err.message
      );

    } finally {

      setGuardando(false);

    }
  };

  // =========================
  // EXPORTAR INFORME TOTAL
  // =========================

  const exportarInformeTotal = async () => {

    try {

      setError("");
      setCargando(true);

      const response = await fetch(
        `${API_URL}/reporte-asistencia`
      );

      if (!response.ok) {

        throw new Error(
          "No fue posible consultar el informe total de asistencias"
        );

      }

      const data =
        await response.json();

      if (
        !data ||
        data.length === 0
      ) {

        setError(
          "No hay reportes de asistencia para exportar"
        );

        return;
      }

      await exportarReporteAsistencia(
        data,
        "total",
        usuario
      );

      setMostrarModalExportar(false);

    } catch (err) {

      console.error(err);

      setError(
        err.message
      );

    } finally {

      setCargando(false);

    }
  };

  // =========================
  // EXPORTAR EXPERTO SELECCIONADO
  // =========================

  const exportarInformeExperto = async () => {

    // =========================================
    // VALIDAR QUE HAYA UN EXPERTO SELECCIONADO
    // =========================================

    if (!documento.trim()) {

      setError(
        "Digite el documento del experto que desea exportar"
      );

      setMostrarModalExportar(false);

      return;
    }

    // =========================================
    // VALIDAR QUE EXISTAN REPORTES DEL EXPERTO
    // =========================================

    if (
      !reportes ||
      reportes.length === 0
    ) {

      setError(
        "El experto seleccionado no tiene reportes de asistencia"
      );

      setMostrarModalExportar(false);

      return;
    }

    try {

      setError("");

      await exportarReporteAsistencia(
        reportes,
        "experto",
        usuario
      );

      setMostrarModalExportar(false);

    } catch (err) {

      console.error(err);

      setError(
        "No fue posible generar el informe del experto"
      );

    }
  };

  return (

    <div className="reporte-asistencia">

      <h2>
        Reporte de asistencia
      </h2>

      {/* =========================
          FORMULARIO
      ========================= */}

      <div className="reporte-asistencia-formulario">

        {/* =========================
            CONVOCATORIA
        ========================= */}

        <div className="reporte-asistencia-fila">

          <div className="reporte-asistencia-campo">

            <label>
              Convocatoria
            </label>

            <select
              value={convocatoria}
              onChange={
                handleConvocatoriaChange
              }
            >

              <option value="">
                Seleccione...
              </option>

              {convocatorias.map(
                (item) => (

                  <option
                    key={item.id}
                    value={
                      item.nombre_convocatoria
                    }
                  >
                    {
                      item.nombre_convocatoria
                    }
                  </option>

                )
              )}

            </select>

          </div>

        </div>

        {/* =========================
            FILA 1 - 4 CAMPOS
        ========================= */}

        <div className="reporte-asistencia-fila">

          {/* TIPO DE REPORTE */}

          <div className="reporte-asistencia-campo">

            <label>
              Tipo de reporte
            </label>

            <select
              value={tipoReporte}
              onChange={
                handleTipoReporteChange
              }
            >

              <option value="">
                Seleccione...
              </option>

              {TIPOS_REPORTE.map(
                (item) => (

                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>

                )
              )}

            </select>

          </div>

          {/* FECHA */}

          <div className="reporte-asistencia-campo">

            <label>
              Fecha
            </label>

            <input
              type="date"
              value={fecha}
              max={FECHA_HOY}
              onChange={(e) => {
                const nuevaFecha = e.target.value;

                if (nuevaFecha > FECHA_HOY) {
                  setError(
                    "La fecha de asistencia no puede ser posterior a la fecha actual."
                  );
                  return;
                }

                setError("");
                setFecha(nuevaFecha);
              }}
            />

          </div>

          {/* DOCUMENTO */}

          <div className="reporte-asistencia-campo">

            <label>
              Documento
            </label>

            <input
              type="text"
              value={documento}
              onChange={
                handleDocumentoChange
              }
              onBlur={() =>
                buscarExperto(
                  documento
                )
              }
              placeholder="Digite el documento"
            />

          </div>

          {/* NOMBRE */}

          <div className="reporte-asistencia-campo">

            <label>
              Nombre del experto
            </label>

            <input
              type="text"
              value={nombre}
              disabled
            />

          </div>

        </div>

        {/* =========================
            FILA 2
            CIUDAD - ROL - JORNADA
        ========================= */}

        <div className="reporte-asistencia-fila">

          {/* CIUDAD */}

          <div className="reporte-asistencia-campo">

            <label>
              Ciudad
            </label>

            <select
              value={ciudad}
              onChange={(e) =>
                setCiudad(
                  e.target.value
                )
              }
            >

              <option value="">
                Seleccione...
              </option>

              {CIUDADES.map(
                (item) => (

                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>

                )
              )}

            </select>

          </div>

          {/* ROL */}

          <div className="reporte-asistencia-campo">

            <label>
              Rol
            </label>

            <select
              value={rol}
              onChange={(e) =>
                setRol(
                  e.target.value
                )
              }
            >

              <option value="">
                Seleccione...
              </option>

              {ROLES.map(
                (item) => (

                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>

                )
              )}

            </select>

          </div>

          {/* JORNADA */}

          <div className="reporte-asistencia-campo">

            <label>
              Jornada
            </label>

            <select
              value={jornada}
              onChange={(e) =>
                setJornada(
                  e.target.value
                )
              }
            >

              <option value="">
                Seleccione...
              </option>

              {JORNADAS.map(
                (item) => (

                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>

                )
              )}

            </select>

          </div>

          {/* OBSERVACIONES */}

          <div className="reporte-asistencia-campo observaciones">

            <label>
              Observaciones
            </label>

            <textarea
              value={observaciones}
              onChange={(e) =>
                setObservaciones(
                  e.target.value
                )
              }
              rows="3"
            />

          </div>

        </div>

      </div>

      {
        
        /* =========================
          BOTÓN Y MENSAJES
      ========================= */}

      <div className="reporte-asistencia-acciones">

        <button
          type="button"
          className="btn-guardar-reporte"
          onClick={
            guardarReporte
          }
          disabled={guardando}
        >
          {guardando
            ? "Guardando..."
            : "Guardar reporte"}
        </button>

        {mensaje && (
          <div className="reporte-asistencia-mensaje">
            {mensaje}
          </div>
        )}

        {error && (
          <div className="reporte-asistencia-error">
            {error}
          </div>
        )}

      </div>

      {/* =========================
          TABLA DE REPORTES
      ========================= */}

      <div className="reporte-asistencia-tabla-contenedor">

        <div className="reporte-asistencia-tabla-header">

          <div className="reporte-asistencia-titulo-acciones">

            <h3>
              Reportes registrados
            </h3>

            <button
              type="button"
              className="btn-exportar-asistencia"
              onClick={() =>
                setMostrarModalExportar(
                  true
                )
              }
            >
              Exportar Excel
            </button>

          </div>

        </div>

        {cargando ? (

          <div className="reporte-asistencia-cargando">
            Cargando reportes...
          </div>

        ) : !convocatoria ||
          !tipoReporte ||
          !documentoConsulta ? (

          <div className="reporte-asistencia-fila-tabla">

            <span
              className="reporte-asistencia-sin-registros"
            >
              Seleccione la convocatoria, el tipo de reporte
              y digite un documento para consultar.
            </span>

          </div>

        ) : (

          <div className="reporte-asistencia-tabla-scroll">

            {/* =========================
                ENCABEZADO
            ========================= */}

            <div className="reporte-asistencia-encabezado-tabla">

              <span>
                Convocatoria
              </span>

              <span>
                Tipo de reporte
              </span>

              <span>
                Fecha de asistencia
              </span>

              <span>
                Documento
              </span>

              <span>
                Nombre
              </span>

              <span>
                Ciudad
              </span>

              <span>
                Rol
              </span>

              <span>
                Jornada
              </span>

              <span>
                Observaciones
              </span>

              <span>
                Responsable
              </span>

              <span>
                Fecha registro
              </span>

            </div>

            {/* =========================
                REGISTROS
            ========================= */}

            {reportes.length === 0 ? (

              <div className="reporte-asistencia-fila-tabla">

                <span
                  className="reporte-asistencia-sin-registros"
                >
                  No hay reportes registrados para
                  los parámetros seleccionados.
                </span>

              </div>

            ) : (

              reportes.map(
                (reporte) => (

                  <div
                    className="reporte-asistencia-fila-tabla"
                    key={reporte.id}
                  >

                    <span>
                      {
                        reporte.convocatoria ||
                        ""
                      }
                    </span>

                    <span>
                      {
                        reporte.tipo_reporte ||
                        ""
                      }
                    </span>

                    <span>
                      {
                        reporte.fecha ||
                        ""
                      }
                    </span>

                    <span>
                      {
                        reporte.documento ||
                        ""
                      }
                    </span>

                    <span>
                      {
                        reporte.nombre ||
                        ""
                      }
                    </span>

                    <span>
                      {
                        reporte.ciudad ||
                        ""
                      }
                    </span>

                    <span>
                      {
                        reporte.rol ||
                        ""
                      }
                    </span>

                    <span>
                      {
                        reporte.jornada ||
                        ""
                      }
                    </span>

                    <span>
                      {
                        reporte.observaciones ||
                        ""
                      }
                    </span>

                    <span>
                      {
                        reporte.responsable_reporte ||
                        ""
                      }
                    </span>

                    <span>
                      {
                        reporte.fecha_registro
                          ? new Date(
                              reporte.fecha_registro
                            ).toLocaleString(
                              "es-CO"
                            )
                          : ""
                      }
                    </span>

                  </div>

                )
              )

            )}

          </div>

        )}

      </div>

      {/* =========================
          MODAL DE EXPORTACIÓN
      ========================= */}

      {mostrarModalExportar && (

        <div
          className="modal-exportar-asistencia-overlay"
          onClick={() =>
            setMostrarModalExportar(
              false
            )
          }
        >

          <div
            className="modal-exportar-asistencia"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <h3>
              Exportar informe de asistencias
            </h3>

            <p>
              Seleccione el tipo de informe que desea
              descargar:
            </p>

            <div className="modal-exportar-asistencia-opciones">

              <button
                type="button"
                className="btn-exportar-opcion"
                onClick={
                  exportarInformeTotal
                }
              >
                Exportar informe total de asistencias
              </button>

              <button
                type="button"
                className="btn-exportar-opcion"
                onClick={
                  exportarInformeExperto
                }
                disabled={
                  !documento.trim() ||
                  reportes.length === 0
                }
              >
                Exportar informe de experto seleccionado
              </button>

            </div>

            <button
              type="button"
              className="btn-cerrar-exportar"
              onClick={() =>
                setMostrarModalExportar(
                  false
                )
              }
            >
              Cancelar
            </button>

          </div>

        </div>

      )}

    </div>
  );
}
