import React, { useState } from "react";
import "./AprobacionVRM.css";

function AprobacionVRM() {
  const [convocatoria, setConvocatoria] = useState("");
  const [documento, setDocumento] = useState("");
  const [nombre, setNombre] = useState("");
  const [indicador, setIndicador] = useState("");

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

              <th>N. Novedad</th>
              <th>Validación</th>
              <th>Justificación</th>
              <th>Fecha novedad</th>
              <th>Convocatoria</th>
              <th>Eje / Indicador</th>
              <th>Nivel</th>
              <th>Rol</th>
              <th>Nombres y apellidos experto</th>
              <th>Documento</th>
              <th>Perfil requerido</th>
              <th>¿Cuenta con experiencia?</th>

            </tr>

          </thead>

          <tbody>

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AprobacionVRM;