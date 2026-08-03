import React, { useEffect, useRef, useState } from "react";
import "./JuecesAsignados.css";

const API_URL = "https://erp-unilibre-production.up.railway.app";

function JuecesAsignados() {

  const [convocatorias, setConvocatorias] = useState([]);
  const [convocatoria, setConvocatoria] = useState("");

  const [ciudades, setCiudades] = useState([]);
  const [ciudad, setCiudad] = useState("");
  const [reporte, setReporte] = useState([]);

  const controllerRef = useRef(null);
  const requestIdRef = useRef(0);

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

  // Número único para esta petición
  const requestId = ++requestIdRef.current;

  // Cancela la petición anterior
  if (controllerRef.current) {
    controllerRef.current.abort();
  }

  const controller = new AbortController();
  controllerRef.current = controller;

  try {

    const res = await fetch(
     `${API_URL}/jueces-asignados?convocatoria=${encodeURIComponent(convocatoria)}&ciudad=${encodeURIComponent(eje)}`,
  {
     signal: controller.signal
  }
);

    const data = await res.json();

    // Si ya existe una petición más nueva, ignoramos esta respuesta
    if (requestId !== requestIdRef.current) {
      return;
    }

    setReporte(data);

  } catch (error) {

    if (error.name !== "AbortError") {
      console.error(error);
    }

  }

};

    return (

    <div className="equipos-expertos">

      <h2>Jueces asignados</h2>

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
              setReporte([]);

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
              <span className="valor">{item.reclutados}</span>
            </div>

            <div className="dato-resumen">
              <span className="etiqueta">Aprobados</span>
              <span className="valor">{item.aprobados}</span>
            </div>

          </div>

          <div className="tabla-equipo">

            <div className="encabezado-tabla">

              <span>Novedad</span>
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

    <span>{experto.numero_novedad}</span>

    <span>{experto.documento_experto}</span>

    <span>{experto.nombre}</span>

    <span>{experto.estado || "-"}</span>

    <span>{experto.validador || "-"}</span>

    <span>{experto.telefono || "-"}</span>

    <span>{experto.observaciones || "-"}</span>

  </div>

))}            
          </div>

          <hr />

        </div>

      ))}

    </div>

  );

}

export default JuecesAsignados;