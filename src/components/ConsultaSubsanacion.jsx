import React from "react";

export default function ConsultaSubsanacion() {

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
                            <th>Status</th>
                            <th>Documento</th>
                            <th>Nombre del experto</th>
                            <th>Tipo de novedad</th>
                            <th>Eje / Indicador</th>
                            <th>Nivel</th>
                            <th>Responsable de la novedad</th>
                            <th>Acción</th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td
                                colSpan="9"
                                style={{
                                    textAlign: "center",
                                    padding: "40px"
                                }}
                            >

                                No hay registros

                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>

    );

}