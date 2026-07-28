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

  {/* AQUÍ VA LA TABLA */}

<div className="tabla-equipo">

  <div className="encabezado-tabla">

    <div className="col-documento">
      Documento
    </div>

    <div className="col-nombre">
      Nombre del experto
    </div>

    <div className="col-estado">
      Estado
    </div>

    <div className="col-disponibilidad">
      Disponibilidad
    </div>

    <div className="col-telefono">
  Teléfono
</div>

<div className="col-ciudad">
  Ciudad de domicilio
</div>

  </div>

  <div className="fila-equipo">

    <div className="col-documento">
      1022334455
    </div>

    <div className="col-nombre">
      Juan Pérez González
    </div>

    <div className="col-estado estado-aprobado">
      Aprobado
    </div>

    <div className="col-disponibilidad">
      Domingo a domingo
    </div>

    <div className="col-telefono">
  3104567890
</div>

<div className="col-ciudad">
  Bogotá
</div>

  </div>

  <div className="fila-equipo">

    <div className="col-documento">
      1033445566
    </div>

    <div className="col-nombre">
      Ana Torres
    </div>

    <div className="col-estado estado-pendiente">
      Pendiente
    </div>

    <div className="col-disponibilidad">
      Tiempo completo
    </div>

  </div>

</div>

</div>
<hr />

    </div>
  );
}

export default EquiposExpertos;