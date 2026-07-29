import React, { useEffect, useState } from "react";
import "./EquiposExpertos.css";

const API_URL = "https://erp-unilibre-production.up.railway.app";

function EquiposExpertos() {

  const [convocatorias, setConvocatorias] = useState([]);
  const [convocatoria, setConvocatoria] = useState("");

  

  useEffect(() => {
    cargarConvocatorias();
  }, []);

  const cargarConvocatorias = async () => {

    try {

      const res = await fetch(
        `${API_URL}/equipos-expertos/convocatorias`
      );

      const data = await res.json();

      console.log("Convocatorias:", data);

      setConvocatorias(data);

    } catch (error) {

      console.error(error);

    }

  };


  return (
    <div className="equipos-expertos">

      <h2>Equipos de expertos</h2>

      <div className="filtros-equipos">


        <div className="grupo-filtro">
  <label>Convocatoria</label>

  <select
    value={convocatoria}
    onChange={(e) => setConvocatoria(e.target.value)}
  >

    <option value="">
      Seleccione...
    </option>

    {convocatorias.map((item) => (

      <option
        key={item.convocatoria}
        value={item.convocatoria}
      >
        {item.convocatoria}
      </option>

    ))}

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

  <span>Documento</span>
  <span>Nombre del experto</span>
  <span>Estado</span>
  <span>Disponibilidad</span>
  <span>Teléfono</span>
  <div>Ciudad de domicilio</div>

</div>
  <div className="fila-equipo">

  <span>1022334455</span>

  <span>Juan Pérez González</span>

  <span className="estado-aprobado">
    Aprobado
  </span>

  <span>Domingo a domingo</span>

  <span>3104567890</span>

  <div>Bogotá</div>

</div>
  <div className="fila-equipo">

  <span>1033445566</span>

  <span>Ana Torres</span>

  <span className="estado-pendiente">
    Pendiente
  </span>

  <span>Tiempo completo</span>

  <span>3104567890</span>

  <span>Bogotá</span>

</div>
</div>

</div>
<hr />

    </div>
  );
}

export default EquiposExpertos;