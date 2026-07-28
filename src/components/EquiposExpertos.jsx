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

      <div className="bloque-rol">

  <h3 className="titulo-rol">
    COORDINADOR DE TEST
  </h3>

  <div className="resumen-rol">

    <div className="dato-resumen">
      <span className="etiqueta">Requeridos</span>
      <span className="valor">15</span>
    </div>

    <div className="dato-resumen">
      <span className="etiqueta">Reclutados</span>
      <span className="valor">8</span>
    </div>

    <div className="dato-resumen">
      <span className="etiqueta">Aprobados</span>
      <span className="valor">6</span>
    </div>

  </div>

</div>

<hr />

    </div>
  );
}

export default EquiposExpertos;