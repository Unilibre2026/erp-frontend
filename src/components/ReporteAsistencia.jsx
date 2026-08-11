import React, { useEffect, useState } from "react";
import "./ReporteAsistencia.css";

const API_URL = process.env.REACT_APP_API_URL;

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

export default function ReporteAsistencia() {

  // =========================
  // FORMULARIO
  // =========================

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

  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // =========================
  // USUARIO ACTUAL
  // =========================

  const usuario = localStorage.getItem("usuario") || "";

  // =========================
  // CONSULTAR REPORTES
  // =========================

  const cargarReportes = async (doc = "") => {

    try {

      setCargando(true);
      setError("");

      let url = `${API_URL}/reporte-asistencia`;

      if (doc.trim()) {
        url += `?documento=${encodeURIComponent(doc.trim())}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("No fue posible consultar los reportes");
      }

      const data = await response.json();

      setReportes(data);

    } catch (err) {

      console.error(err);
      setError(err.message);

    } finally {

      setCargando(false);

    }
  };

  // =========================
  // CARGAR TODOS AL ENTRAR
  // =========================

  useEffect(() => {
    cargarReportes();
  }, []);

  // =========================
  // BUSCAR EXPERTO
  // =========================

  const buscarExperto = async (doc) => {

    if (!doc.trim()) {
      setNombre("");
      cargarReportes();
      return;
    }

    try {

      setError("");

      const response = await fetch(
        `${API_URL}/reporte-asistencia/buscar/${encodeURIComponent(
          doc.trim()
        )}`
      );

      if (response.status === 404) {

        setNombre("");
        setError("No se encontró un experto con ese documento");

        // Limpiar tabla si el documento no existe
        setReportes([]);

        return;
      }

      if (!response.ok) {
        throw new Error("Error al buscar el experto");
      }

      const data = await response.json();

      setNombre(data.nombre);

      // Buscar sus reportes
      cargarReportes(doc);

    } catch (err) {

      console.error(err);
      setNombre("");
      setError(err.message);

    }
  };

  // =========================
  // CAMBIO DOCUMENTO
  // =========================

  const handleDocumentoChange = (e) => {

    const valor = e.target.value;

    setDocumento(valor);

    // Si se borra el documento,
    // mostramos nuevamente todos
    if (!valor.trim()) {

      setNombre("");
      setError("");
      cargarReportes();

    }
  };

  // =========================
  // GUARDAR REPORTE
  // =========================

  const guardarReporte = async () => {

    setMensaje("");
    setError("");

    if (!fecha) {
      setError("Seleccione la fecha de la asistencia");
      return;
    }

    if (!documento.trim()) {
      setError("Digite el documento del experto");
      return;
    }

    if (!nombre) {
      setError("El documento no corresponde a un experto válido");
      return;
    }

    if (!ciudad) {
      setError("Seleccione la ciudad");
      return;
    }

    if (!rol) {
      setError("Seleccione el rol");
      return;
    }

    if (!jornada) {
      setError("Seleccione la jornada");
      return;
    }

    try {

      const response = await fetch(
        `${API_URL}/reporte-asistencia`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fecha,
            documento,
            ciudad,
            rol,
            jornada,
            observaciones,
            responsable_reporte: usuario,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "No fue posible guardar el reporte"
        );
      }

      setMensaje(data.mensaje);

      // Limpiar campos del registro
      setFecha("");
      setDocumento("");
      setNombre("");
      setCiudad("");
      setRol("");
      setJornada("");
      setObservaciones("");

      // Recargar tabla completa
      cargarReportes();

    } catch (err) {

      console.error(err);
      setError(err.message);

    }
  };

  return (
    <div className="reporte-asistencia">

      <h2>Reporte de asistencia</h2>

      {/* =========================
          FORMULARIO
      ========================= */}

      <div className="reporte-asistencia-formulario">

        {/* =========================
            FILA 1 - 4 CAMPOS
        ========================= */}

        <div className="reporte-asistencia-fila">

          {/* TIPO DE REPORTE */}
          <div className="reporte-asistencia-campo">

            <label>Tipo de reporte</label>

            <input
              type="text"
              value="REPORTE INICIAL"
              disabled
            />

          </div>


          {/* FECHA */}
          <div className="reporte-asistencia-campo">

            <label>Fecha</label>

            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />

          </div>


          {/* DOCUMENTO */}
          <div className="reporte-asistencia-campo">

            <label>Documento</label>

            <input
              type="text"
              value={documento}
              onChange={handleDocumentoChange}
              onBlur={() => buscarExperto(documento)}
              placeholder="Digite el documento"
            />

          </div>


          {/* NOMBRE */}
          <div className="reporte-asistencia-campo">

            <label>Nombre del experto</label>

            <input
              type="text"
              value={nombre}
              disabled
            />

          </div>

        </div>


        {/* =========================
            FILA 2 - 4 CAMPOS
        ========================= */}

        <div className="reporte-asistencia-fila">

          {/* CIUDAD */}
          <div className="reporte-asistencia-campo">

            <label>Ciudad</label>

            <select
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
            >

              <option value="">
                Seleccione...
              </option>

              {CIUDADES.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}

            </select>

          </div>


          {/* ROL */}
          <div className="reporte-asistencia-campo">

            <label>Rol</label>

            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
            >

              <option value="">
                Seleccione...
              </option>

              {ROLES.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}

            </select>

          </div>


          {/* JORNADA */}
          <div className="reporte-asistencia-campo">

            <label>Jornada</label>

            <select
              value={jornada}
              onChange={(e) => setJornada(e.target.value)}
            >

              <option value="">
                Seleccione...
              </option>

              {JORNADAS.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}

            </select>

          </div>


          {/* OBSERVACIONES */}
          <div className="reporte-asistencia-campo">

            <label>Observaciones</label>

            <textarea
              value={observaciones}
              onChange={(e) =>
                setObservaciones(e.target.value)
              }
              rows="3"
            />

          </div>

        </div>

      </div>


      <div className="reporte-asistencia-acciones">

    <button
        type="button"
        onClick={guardarReporte}
    >
        Guardar reporte
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
          TABLA
      ========================= */}

      <div className="reporte-asistencia-tabla-contenedor">

        <div className="reporte-asistencia-tabla-header">

          <h3>
            Reportes registrados
          </h3>

        </div>

        {cargando ? (

          <div className="reporte-asistencia-cargando">
            Cargando reportes...
          </div>

        ) : (

          <div className="reporte-asistencia-tabla-scroll">

            <table>

              <thead>

                <tr>
                  <th>Tipo de reporte</th>
                  <th>Fecha</th>
                  <th>Documento</th>
                  <th>Nombre</th>
                  <th>Ciudad</th>
                  <th>Rol</th>
                  <th>Jornada</th>
                  <th>Observaciones</th>
                  <th>Responsable</th>
                  <th>Fecha registro</th>
                </tr>

              </thead>

              <tbody>

                {reportes.length === 0 ? (

                  <tr>

                    <td colSpan="10">
                      No hay reportes registrados
                    </td>

                  </tr>

                ) : (

                  reportes.map((reporte) => (

                    <tr key={reporte.id}>

                      <td>
                        {reporte.tipo_reporte}
                      </td>

                      <td>
                        {reporte.fecha}
                      </td>

                      <td>
                        {reporte.documento}
                      </td>

                      <td>
                        {reporte.nombre}
                      </td>

                      <td>
                        {reporte.ciudad}
                      </td>

                      <td>
                        {reporte.rol}
                      </td>

                      <td>
                        {reporte.jornada}
                      </td>

                      <td>
                        {reporte.observaciones || ""}
                      </td>

                      <td>
                        {reporte.responsable_reporte}
                      </td>

                      <td>
                        {reporte.fecha_registro
                          ? new Date(
                              reporte.fecha_registro
                            ).toLocaleString("es-CO")
                          : ""}
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}