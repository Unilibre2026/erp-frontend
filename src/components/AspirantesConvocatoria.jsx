import React from "react";
import React, { useEffect, useState } from "react";

function AspirantesConvocatoria() {


    // ==========================================
    // ESTADOS
    // ==========================================

    const [convocatorias, setConvocatorias] = useState([]);
    const [convocatoria, setConvocatoria] = useState("");

    const [archivo, setArchivo] = useState(null);
    const [datos, setDatos] = useState([]);


    return (

        <div className="aspirantes-convocatoria">

            <h2>
                Aspirantes por convocatoria
            </h2>


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

            <div className="barra-superior">

                <div className="campo">

                    <label>
                        Archivo Excel
                    </label>

                    <input
                        type="file"
                        accept=".xlsx,.xls"
                    />

                </div>

                <button className="btn-consultar">
                    Cargar archivo
                </button>

                <button className="btn-exportar">
                    📥 Exportar Excel
                </button>

            </div>

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