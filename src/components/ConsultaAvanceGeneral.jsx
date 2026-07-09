import { useEffect, useState } from "react";
import "./ConsultaAvanceGeneral.css";

const API_URL = "https://erp-unilibre-production.up.railway.app";

function ConsultaAvanceGeneral() {

    // ==========================
    // ESTADOS
    // ==========================

    const [convocatorias, setConvocatorias] = useState([]);
    const [convocatoria, setConvocatoria] = useState("");

    // ==========================
    // USE EFFECT
    // ==========================

    useEffect(() => {

        cargarConvocatorias();

    }, []);

    // ==========================
    // FUNCIONES
    // ==========================

    const cargarConvocatorias = async () => {

        try {

            const res = await fetch(`${API_URL}/convocatorias`);

            const data = await res.json();

            const unicas = [
                ...new Set(
                    data.map((c) => c.nombre_convocatoria)
                )
            ];

            setConvocatorias(unicas);

        } catch (error) {

            console.error(error);

        }

    };

    // ==========================
    // RETURN
    // ==========================

    return (

    <div className="consulta-avance-general">

        <h2>Consulta avance general</h2>

        <div className="barra-superior">

            <div className="campo">

                <label>Convocatoria</label>

                <select
                    value={convocatoria}
                    onChange={(e) => {

                        const valor = e.target.value;

                        setConvocatoria(valor);

                    }}
                >

                    <option value="">
                        Seleccione convocatoria
                    </option>

                    {

                        convocatorias.map((c, index) => (

                            <option
                                key={index}
                                value={c}
                            >
                                {c}
                            </option>

                        ))

                    }

                </select>

            </div>

        </div>

    </div>

);

} 

export default ConsultaAvanceGeneral;