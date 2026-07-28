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

    <div className="encabezado-informe">

    <div className="logo-informe">
        <img src={appLogo} alt="Universidad Libre" />
    </div>

    <div className="datos-informe">

        <p>
            <strong>Convocatoria:</strong> CNSC Territorial 11
        </p>

        <p>
            <strong>Ciudad:</strong> Bogotá
        </p>

    </div>

</div>

<hr />

</div>
  );
}

export default EquiposExpertos;