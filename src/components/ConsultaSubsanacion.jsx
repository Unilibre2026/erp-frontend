import React, { useEffect, useState } from "react";

const API_URL = "https://erp-unilibre-production.up.railway.app";

export default function ConsultaSubsanacion() {

    const [datos, setDatos] = useState([]);

    useEffect(() => {
        cargarSubsanaciones();
    }, []);

    const cargarSubsanaciones = async () => {

        try {

            const token = localStorage.getItem("token");

            const res = await fetch(`${API_URL}/aprobaciones/subsanaciones`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();

            setDatos(Array.isArray(data) ? data : []);

        } catch (error) {

            console.error(error);

        }

    };

    return (

        <div style={{ padding: "20px" }}>

            <h2 style={{ marginBottom: "20px" }}>
                Consulta de subsanación
            </h2>

            <div
                className="table-wrapper"
                style={{ overflowX: "auto" }}
            >

                <table
                    className="tabla-aprobaciones"
                    border="1"
                    cellPadding="10"
                >

                    <thead>

                        <tr>
                            <th>N. novedad</th>
                            <th>Acción</th>
                            <th>Status</th>
                            <th>Documento</th>
                            <th>Nombre del experto</th>
                            <th>Tipo de novedad</th>
                            <th>Eje / Indicador</th>
                            <th>Nivel</th>
                            <th>Responsable de la novedad</th>
                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td
                                colSpan={9}
                                style={{
                                    textAlign: "center",
                                    padding: "40px"
                                }}
                            >
                                datos.map(...)
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>

    );

}