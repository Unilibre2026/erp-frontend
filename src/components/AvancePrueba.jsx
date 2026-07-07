import { useEffect, useState } from "react";
import "./AvancePrueba.css";

const API_URL = "https://erp-unilibre-production.up.railway.app";

function AvancePrueba() {

  const [convocatorias, setConvocatorias] = useState([]);
  const [convocatoria, setConvocatoria] = useState("");
  const [indicadores, setIndicadores] = useState([]);

  useEffect(() => {
    cargarConvocatorias();
  }, []);

  const cargarConvocatorias = async () => {
    try {
      const res = await fetch(`${API_URL}/convocatorias`);
      const data = await res.json();

      const unicas = [
        ...new Set(data.map(c => c.nombre_convocatoria))
      ];

      setConvocatorias(unicas);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="avance-prueba">

      <h2>Avance por prueba</h2>

      <div className="filtro-convocatoria">

        <label>Convocatoria</label>

        <select
          value={convocatoria}
          onChange={(e) => {const valor = e.target.value;setConvocatoria(valor);cargarIndicadores(valor);}}
        >
          <option value="">
            Seleccione convocatoria
          </option>

          {convocatorias.map((c, index) => (
            <option key={index} value={c}>
              {c}
            </option>
          ))}

        </select>

      </div>

      <hr />

      <div className="contenedor-indicadores">
        {/* Aquí aparecerán los indicadores */}
      </div>

    </div>
  );
}

export default AvancePrueba;

const cargarIndicadores = async (convocatoriaSeleccionada) => {

    if (!convocatoriaSeleccionada) {
        setIndicadores([]);
        return;
    }

    try {

        const res = await fetch(
            `${API_URL}/indicadores/${encodeURIComponent(convocatoriaSeleccionada)}`
        );

        const data = await res.json();

        setIndicadores(data);

    } catch (error) {
        console.error(error);
    }

};