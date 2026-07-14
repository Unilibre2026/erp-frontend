import React, { useState } from "react";
import "./AspirantesConvocatoria.css";

function AspirantesConvocatoria() {

    // ==========================================
    // ESTADOS
    // ==========================================

    const [convocatorias, setConvocatorias] = useState([]);
    const [convocatoria, setConvocatoria] = useState("");

    const [archivo, setArchivo] = useState(null);

// ==========================================
// CARGAR CONVOCATORIAS
// ==========================================

    useEffect(() => {

    cargarConvocatorias();

}, []);



const cargarConvocatorias = async () => {

    try {

        const res = await fetch(`${API_URL}/convocatorias`);

        const data = await res.json();

        const lista = [

            ...new Set(

                data.map(c => c.nombre_convocatoria)

            )

        ].sort((a, b) => a.localeCompare(b, "es"));

        setConvocatorias(lista);

    }

    catch (error) {

        console.error(error);

    }

};

    return (

        <div className="aspirantes-convocatoria">

            <h2>

                Aspirantes por convocatoria

            </h2>

            {/*======================================
                    BARRA SUPERIOR
            ======================================*/}

            <div className="barra-superior">

                {/* Convocatoria */}

                <div className="campo">

                    <label>

                        Convocatoria

                    </label>

                    <select

                        value={convocatoria}

                        onChange={(e) => setConvocatoria(e.target.value)}

                    >

                        <option value="">

                            Seleccione convocatoria

                        </option>

                        {

                            convocatorias.map((c) => (

                                <option
                                    key={c}
                                    value={c}
                                >

                                    {c}

                                </option>

                            ))

                        }

                    </select>

                </div>

                {/* Archivo */}

                <div className="campo">

                    <label>

                        Archivo Excel

                    </label>

                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={(e) => setArchivo(e.target.files[0])}
                    />

                </div>

                {/* Botones */}

                <button
                    className="btn-consultar"
                    disabled={!convocatoria || !archivo}
                >

                    📤 Cargar archivo

                </button>

                <button
                    className="btn-exportar"
                    disabled={!convocatoria}
                >

                    📥 Exportar Excel

                </button>

            </div>

            {/*======================================
                    TABLA
            ======================================*/}

            <div className="tabla-aspirantes">

                <table>

                    <thead>

                        <tr>

                            <th>Convocatoria</th>

                            <th>Documento</th>

                            <th>Nombre</th>

                        </tr>

                    </thead>

                    <tbody>

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default AspirantesConvocatoria;