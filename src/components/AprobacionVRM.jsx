import React, { useEffect, useState, useCallback } from "react";
import "./AprobacionVRM.css";

function AprobacionVRM() {
  
  const [convocatoria, setConvocatoria] = useState("");
  const [documento, setDocumento] = useState("");
  const [nombre, setNombre] = useState("");
  const [indicador, setIndicador] = useState("");

  const API_URL = "https://erp-unilibre-production.up.railway.app";

const [convocatorias, setConvocatorias] = useState([]);
const [datos, setDatos] = useState([]);

// ==========================================
// CONSULTAR DATOS
// ==========================================

const cargarDatos = useCallback(async () => {

  try {

    console.log("API_URL:", API_URL);

    const params = new URLSearchParams();

    if (convocatoria) params.append("convocatoria", convocatoria);
    if (documento) params.append("documento", documento);
    if (nombre) params.append("nombre", nombre);
    if (indicador) params.append("indicador", indicador);

    const res = await fetch(
      `${API_URL}/aprobacion-vrm?${params.toString()}`
    );

    const data = await res.json();

    setDatos(data);

 } catch (error) {

  console.error(error);

}

}, [convocatoria, documento, nombre, indicador]);

// ==========================================
// CONSULTAR CONVOCATORIAS
// ==========================================

const cargarConvocatorias = async () => {

  try {

    const res = await fetch(`${API_URL}/convocatorias`);

    const data = await res.json();

    const lista = [

      ...new Set(
        data.map(c => c.nombre_convocatoria)
      )

    ].sort((a, b) => a.localeCompare(b, "es"));

    setConvocatorias(lista);

  } catch (error) {

    console.error(error);

  }

};

// ==========================================
// USE EFFECTS
// ==========================================

useEffect(() => {

  cargarConvocatorias();

}, []);

useEffect(() => {

  cargarDatos();

}, [cargarDatos]);

  const decidirVRM = async (numeroNovedad, aprobacion) => {
    let justificacion = null;

    // Confirmación antes de aprobar
    if (aprobacion === "APROBADO") {
      const confirmar = window.confirm(
        "¿Está seguro de aprobar esta novedad?\n\nEsta acción enviará la información a la base de datos y no podrá deshacerse."
      );

      if (!confirmar) return;
    }

    // Solicitar justificación cuando no se aprueba
    if (aprobacion === "NO APROBADO") {
      justificacion = prompt("Escriba la justificación del rechazo:");

      if (!justificacion) return;
    }

    try {
      const res = await fetch(`${API_URL}/aprobacion-vrm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numero_novedad: numeroNovedad,
          validacion: aprobacion,
          justificacion: justificacion,
          usuario_gestion: localStorage.getItem("usuario")
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.mensaje || "Ocurrió un error.");
        return;
      }

      alert(data.mensaje);

      // Recargar la información
      cargarDatos();

    } catch (error) {
      console.error(error);
      alert("Error de comunicación con el servidor.");
    }
  };

  

  console.log(datos);

  const formatearFecha = (fecha) => {
    if (!fecha) return "";

    const f = new Date(fecha);

    return f.toLocaleString("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  console.log(datos);

  return (
    <div className="aprobacion-vrm">

      <h2>Aprobación VRM</h2>

      <div className="filtros-vrm">

        <select
          value={convocatoria}
          onChange={(e) => setConvocatoria(e.target.value)}
>
  <option value="">
    Todas las convocatorias
  </option>

  {convocatorias.map((c) => (
    <option
      key={c}
      value={c}
    >
      {c}
    </option>
  ))}
</select>

        <input
          type="text"
          placeholder="Documento"
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
        />

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          type="text"
          placeholder="Indicador"
          value={indicador}
          onChange={(e) => setIndicador(e.target.value)}
        />

      </div>

      <div className="tabla-vrm">

        <table>

          <thead>

            <tr>

              <th style={{ minWidth: "70px" }}>N. Novedad</th>

              <th style={{ minWidth: "170px" }}>Validación</th>

              <th style={{ minWidth: "150px" }}>Fecha novedad</th>

              <th style={{ minWidth: "220px" }}>Convocatoria</th>

              <th style={{ minWidth: "320px" }}>Eje / Indicador</th>

              <th style={{ minWidth: "100px" }}>Nivel</th>

              <th style={{ minWidth: "180px" }}>Rol</th>

              <th style={{ minWidth: "300px" }}>Nombres y apellidos experto</th>

              <th style={{ minWidth: "140px" }}>Documento</th>

              <th style={{ minWidth: "520px" }}>Perfil requerido</th>

              <th style={{ minWidth: "180px" }}>
                ¿Cuenta con experiencia en la entidad?
              </th>

            </tr>

          </thead>

          <tbody>

            {datos.map((item) => (

              <tr key={item.id}>

                <td>{item.id}</td>

                <td style={{ textAlign: "center" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      className="btn-aprobar"
                      onClick={() => decidirVRM(item.id, "APROBADO")}
                    >
                      Aprobado
                    </button>

                    <button
                      className="btn-rechazar"
                      onClick={() => decidirVRM(item.id, "NO APROBADO")}
                    >
                      No aprobado
                    </button>
                  </div>
                </td>

                <td>{formatearFecha(item.fecha_creacion)}</td>

                <td>{item.convocatoria}</td>

                <td>{item.eje}</td>

                <td>{item.nivel}</td>

                <td>{item.rol}</td>

                <td>{item.nombre}</td>

                <td>{item.documento_experto}</td>

                <td>{item.perfil_requerido}</td>

                <td>{item.experiencia_entidad}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AprobacionVRM;