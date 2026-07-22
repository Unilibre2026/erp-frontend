import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";

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

    {datos.length === 0 ? (

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

    ) : (

        datos.map((item) => (

            <tr key={item.id}>

                <td>{item.id}</td>
                <td style={{ textAlign: "center" }}>

    <Eye
        size={18}
        style={{
            cursor: "pointer",
            color: "#2563eb"
        }}
    />

</td>
                <td>{item.status}</td>
                <td>{item.documento_experto}</td>
                <td>{item.nombre}</td>
                <td>{item.tipo_novedad}</td>
                <td>{item.eje}</td>
                <td>{item.nivel}</td>
                <td>{item.responsable}</td>

            </tr>

        ))

    )}

</tbody>

                </table>

            </div>

        </div>

    );

}