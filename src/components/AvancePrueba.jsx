import { useEffect, useState } from "react";
import "./AvancePrueba.css";

const API_URL = "https://erp-unilibre-production.up.railway.app";

function AvancePrueba() {

  const [convocatorias, setConvocatorias] = useState([]);
  const [convocatoria, setConvocatoria] = useState("");

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
          onChange={(e) => setConvocatoria(e.target.value)}
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