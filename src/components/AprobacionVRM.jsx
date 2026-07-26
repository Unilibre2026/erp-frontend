import React, { useEffect, useState } from "react";
import "./AprobacionVRM.css";

function AprobacionVRM() {
  const [convocatoria, setConvocatoria] = useState("");
  const [documento, setDocumento] = useState("");
  const [nombre, setNombre] = useState("");
  const [indicador, setIndicador] = useState("");

  const API_URL = "https://erp-unilibre-production.up.railway.app";

const [datos, setDatos] = useState([]);

useEffect(() => {
  cargarDatos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

const cargarDatos = async () => {
  try {
    console.log("API_URL:", API_URL);
    const res = await fetch(`${API_URL}/aprobacion-vrm`);
    const data = await res.json();

    setDatos(data);
  } catch (error) {
    console.error(error);
  }
};

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

  console.log({
    numero_novedad: numeroNovedad,
    aprobacion,
    justificacion,
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
          <option value="">Todas las convocatorias</option>
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

    <th style={{ minWidth: "90px" }}>N. Novedad</th>

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

    <td>{item.fecha_creacion}</td>

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