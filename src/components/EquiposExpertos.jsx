import React, { useEffect, useState } from "react";
import "./EquiposExpertos.css";

const API_URL = "https://erp-unilibre-production.up.railway.app";

function EquiposExpertos() {

  const [convocatorias, setConvocatorias] = useState([]);
  const [convocatoria, setConvocatoria] = useState("");

  const [ciudades, setCiudades] = useState([]);
  const [ciudad, setCiudad] = useState("");
  const [reporte, setReporte] = useState([]);

  useEffect(() => {
    cargarConvocatorias();
  }, []);

  const cargarConvocatorias = async () => {

    try {

      const res = await fetch(
        `${API_URL}/equipos-expertos/convocatorias`
      );

      const data = await res.json();

      setConvocatorias(data);

    } catch (error) {

      console.error(error);

    }

  };

  const cargarCiudades = async (conv) => {

    try {

      const res = await fetch(
        `${API_URL}/equipos-expertos/ejes/${encodeURIComponent(conv)}`
      );

      const data = await res.json();

      setCiudades(data);

    } catch (error) {

      console.error(error);

    }

  };

 const cargarReporte = async (convocatoria, eje) => {

  try {

    const res = await fetch(
      `${API_URL}/equipos-expertos/reporte/${encodeURIComponent(convocatoria)}/${encodeURIComponent(eje)}`
    );

    const data = await res.json();

    console.log("Reporte:", data);

    setReporte(data);

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
            onChange={(e) => {

              const valor = e.target.value;

              setConvocatoria(valor);

              setCiudad("");
              setCiudades([]);
              setReporte([]);

              if (valor) {
                cargarCiudades(valor);
              }

            }}
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

        <div className="grupo-filtro">

          <label>Ciudad</label>

          <select
            value={ciudad}
            onChange={(e) => {

              const valor = e.target.value;

              setCiudad(valor);

              if (valor) {
                cargarReporte(convocatoria, valor);
              }

            }}
          >

            <option value="">
              Seleccione...
            </option>

            {ciudades.map((item) => (

              <option
                key={item.eje}
                value={item.eje}
              >
                {item.eje}
              </option>

            ))}

          </select>

        </div>

      </div>

      <div className="encabezado-informe">

        <div className="datos-informe">

          <p>
            <strong>Convocatoria:</strong> {convocatoria || "-"}
          </p>

          <p>
            <strong>Ciudad:</strong> {ciudad || "-"}
          </p>

        </div>

      </div>

      <hr />

      {reporte.map((item) => (

        <div
          className="bloque-rol"
          key={item.rol}
        >

          <h3 className="titulo-rol">
            {item.rol}
          </h3>

          <div className="resumen-rol">

            <div className="dato-resumen">
              <span className="etiqueta">Requeridos</span>
              <span className="valor">
               {item.requeridos}
              </span>
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

          <div className="tabla-equipo">

            <div className="encabezado-tabla">

              <span>Documento</span>
              <span>Nombre del experto</span>
              <span>Estado</span>
              <span>Disponibilidad</span>
              <span>Teléfono</span>
              <span>Ciudad de domicilio</span>

            </div>

            {item.expertos.map((experto) => (

  <div
    className="fila-equipo"
    key={experto.documento_experto}
  >

    <span>
      {experto.documento_experto}
    </span>

    <span>
      {experto.nombre}
    </span>

    <span>
      -
    </span>

    <span>
      -
    </span>

    <span>
      -
    </span>

    <span>
      -
    </span>

  </div>

))}
            
          </div>

          <hr />

        </div>

      ))}

    </div>

  );

}

export default EquiposExpertos;