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
    <td>{item.id}</td>

    <td>
        {/* Aquí irá el ojo */}
    </td>

    <td>{item.status}</td>
    <td>{item.documento_experto}</td>
    <td>{item.nombre}</td>
    <td>{item.tipo_novedad}</td>
    <td>{item.eje}</td>
    <td>{item.nivel}</td>
    <td>{item.responsable}</td>
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

                                No hay registros

                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>

    );

}