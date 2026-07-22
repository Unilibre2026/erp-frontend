import React, { useEffect, useState } from "react";
import { FileUser, User } from "lucide-react";
import "./ConsultaSubsanacion.css";

const API_URL = "https://erp-unilibre-production.up.railway.app";

export default function ConsultaSubsanacion() {

    const [datos, setDatos] = useState([]);
    const [expertoSeleccionado, setExpertoSeleccionado] = useState(null);
    const [perfilLaboral, setPerfilLaboral] = useState("");
    const [perfilAcademico, setPerfilAcademico] = useState("");
    const [disponibilidad, setDisponibilidad] = useState("");

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
                            <th>Ver información</th>
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

                                <tr key={item.numero_novedad}>

                                    <td>{item.numero_novedad}</td>

                                    <td style={{ textAlign: "center" }}>

                                        <button
                                          className="btn-ver-subsanacion"
                                          title="Ver hoja de vida"
                                          onClick={() => {

                                             setExpertoSeleccionado(item);

                                             setPerfilLaboral(item.perfil_laboral || "");
                                             setPerfilAcademico(item.perfil_academico || "");
                                             setDisponibilidad(item.disponibilidad_tiempo || "");

    }}
>
    <FileUser strokeWidth={2} />
</button>

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

            {expertoSeleccionado && (

                <div
                    className="modal-overlay"
                    onClick={() => setExpertoSeleccionado(null)}
                >

                    <div
                        className="modal-hoja-vida"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="modal-header">

                            <div>

                                <h2
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                    }}
                                >
                                    <User size={28} color="#ffffff" />
                                </h2>

                                <small
                                    style={{
                                        fontSize: "25px",
                                        fontWeight: "600",
                                        color: "#ffffff",
                                    }}
                                >
                                    Gestión de Subsanación
                                </small>

                            </div>

                            <button
                                className="btn-cerrar-modal"
                                onClick={() => setExpertoSeleccionado(null)}
                            >
                                ✕
                            </button>

                        </div>

                        <div className="modal-body">
                            <div className="card-observaciones">

    <h3>Observaciones</h3>

    <div className="observaciones-grid">

        <div>

            <strong>Estado</strong>

            <p>{expertoSeleccionado.aprobacion}</p>

        </div>

        <div>

            <strong>Fecha de notificación</strong>

            <p>
               {new Date(expertoSeleccionado.fecha_aprobacion).toLocaleString("es-CO", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
    })}
</p>

        </div>

    </div>

    <div className="observaciones-texto">

        <strong>Observaciones</strong>

        <p>{expertoSeleccionado.justificacion_aprobacion}</p>

    </div>

</div>

                            
                            

                                <div className="card-perfil">

    <h3>Información General</h3>

    <div className="info-grid">

        <div>
            <strong>Número de novedad</strong>
            <p>{expertoSeleccionado.numero_novedad}</p>
        </div>

        <div>
            <strong>Convocatoria</strong>
            <p>{expertoSeleccionado.convocatoria}</p>
        </div>

        <div>
            <strong>Documento</strong>
            <p>{expertoSeleccionado.documento_experto}</p>
        </div>

        <div>
            <strong>Nombre del experto</strong>
            <p>{expertoSeleccionado.nombre}</p>
        </div>

        <div>
            <strong>Tipo de novedad</strong>
            <p>{expertoSeleccionado.tipo_novedad}</p>
        </div>

        <div>
            <strong>Indicador</strong>
            <p>{expertoSeleccionado.eje}</p>
        </div>

        <div>
            <strong>Nivel</strong>
            <p>{expertoSeleccionado.nivel}</p>
        </div>

        <div>
            <strong>Rol</strong>
            <p>{expertoSeleccionado.rol}</p>
        </div>

        <div>
            <strong>Responsable</strong>
            <p>{expertoSeleccionado.responsable}</p>
        </div>

        <div>
            <strong>Fecha de creación</strong>
            <p>
                {new Date(expertoSeleccionado.fecha_creacion).toLocaleDateString("es-CO")}
            </p>
        </div>

    </div>

</div>

<div className="card-perfil">

    <h3>Perfil del Experto</h3>

    <div className="texto-perfil">

        <h4>Perfil Laboral</h4>

        <textarea
         className="textarea-subsanacion"
         rows={6}
         value={perfilLaboral}
         onChange={(e) => setPerfilLaboral(e.target.value)}
/>

    </div>

    <div className="texto-perfil">

        <h4>Perfil Académico</h4>

        <textarea
            className="textarea-subsanacion"
            rows={6}
            value={perfilAcademico}
            onChange={(e) => setPerfilAcademico(e.target.value)}
/>

    </div>

    <div className="texto-perfil">

        <h4>Disponibilidad</h4>

        <textarea
          className="textarea-subsanacion"
          rows={6}
          value={disponibilidad}
          onChange={(e) => setDisponibilidad(e.target.value)}
/>

    </div>

</div>



                            </div>

                        </div>

                    </div>

            

            )}

        </div>

    );

}