import React from "react";
import "./EquiposExpertos.css";

function EquiposExpertos() {
  return (
    <div className="equipos-expertos">

      <h2>Equipos de expertos</h2>

      <div className="filtros-equipos">

        <div className="grupo-filtro">
          <label>Convocatoria</label>
          <select>
            <option>Seleccione...</option>
          </select>
        </div>

        <div className="grupo-filtro">
          <label>Ciudad</label>
          <select>
            <option>Seleccione...</option>
          </select>
        </div>

      </div>

    </div>
  );
}

export default EquiposExpertos;