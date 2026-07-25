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

    <th style={{ minWidth: "90px" }}>N. Novedad</th>

    <th style={{ minWidth: "170px" }}>Validación</th>

    <th style={{ minWidth: "180px" }}>Justificación</th>

    <th style={{ minWidth: "150px" }}>Fecha novedad</th>

    <th style={{ minWidth: "220px" }}>Convocatoria</th>

    <th style={{ minWidth: "260px" }}>Eje / Indicador</th>

    <th style={{ minWidth: "100px" }}>Nivel</th>

    <th style={{ minWidth: "180px" }}>Rol</th>

    <th style={{ minWidth: "260px" }}>Nombres y apellidos experto</th>

    <th style={{ minWidth: "140px" }}>Documento</th>

    <th style={{ minWidth: "420px" }}>Perfil requerido</th>

    <th style={{ minWidth: "180px" }}>
      ¿Cuenta con experiencia en la entidad?
    </th>

  </tr>

</thead>
          <tbody>

<tr>

<td>185</td>

<td>
    <button className="btn-aprobar">Aprobado</button>
    <button className="btn-rechazar">No aprobado</button>
</td>

<td></td>

<td>22/07/2026 13:52</td>

<td>PRÁCTICAS ACUEDUCTO</td>

<td>TEC_GUA1_Guardabosques_TÉCNICO</td>

<td>TÉCNICO</td>

<td>Juez / Aplicador</td>

<td>JOSE GERMAN MENDEZ PARRA</td>

<td>80820433</td>

<td>
Ingeniero forestal con 2 años de experiencia en el eje evaluativo.
</td>

<td>NO APLICA</td>

</tr>

</tbody>

        </table>

      </div>

    </div>
  );
}

export default AprobacionVRM;