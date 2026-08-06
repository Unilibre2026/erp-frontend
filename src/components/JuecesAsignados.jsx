import React, { useEffect, useRef, useState } from "react";
import "./JuecesAsignados.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { exportarJuecesAsignados } from "../utils/ExportadorJuecesAsignados";

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

const exportarExcel = () => {

    const datos = reporte.map(item => ({
        Novedad: item.numero_novedad,
        Documento: item.documento,
        "Nombre del experto": item.nombre,
        Estado: item.estado,
        Ciudad: item.ciudad,
        Rol: item.rol,
        Disponibilidad: item.disponibilidad,
        Teléfono: item.telefono,
        "Ciudad de domicilio": item.ciudad_domicilio
    }));

    const hoja = XLSX.utils.json_to_sheet(datos);

    const libro = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(libro, hoja, "Jueces");

    const excelBuffer = XLSX.write(libro, {
        bookType: "xlsx",
        type: "array"
    });

    const archivo = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    saveAs(
        archivo,
        `Jueces_Asignados_${convocatoria}.xlsx`
    );

};

   return (

  <div className="jueces-asignados">

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
              cargarReporte(valor, "");
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

    <div className="acciones-tabla">

      <button
    className="btn-exportar"
    onClick={() =>
        exportarJuecesAsignados(reporte, convocatoria)
    }
    disabled={reporte.length === 0}
>
    Exportar a Excel
</button>

    </div>

    <div className="tabla-equipo">

      <div className="encabezado-tabla">

        <span>Novedad</span>
        <span>Documento</span>
        <span>Nombre del experto</span>
        <span>Estado</span>
        <span>Ciudad</span>
        <span>Rol</span>
        <span>Disponibilidad</span>
        <span>Teléfono</span>
        <span>Ciudad de domicilio</span>

      </div>

      {reporte.map((item) => (

        <div
          className="fila-equipo"
          key={`${item.numero_novedad}-${item.documento}`}
        >

          <span>{item.numero_novedad}</span>
          <span>{item.documento}</span>
          <span>{item.nombre}</span>
          <span>{item.estado}</span>
          <span>{item.ciudad}</span>
          <span>{item.rol}</span>
          <span>{item.disponibilidad || "-"}</span>
          <span>{item.telefono || "-"}</span>
          <span>{item.ciudad_domicilio || "-"}</span>

        </div>

      ))}

    </div>

  </div>

);

}

export default JuecesAsignados;