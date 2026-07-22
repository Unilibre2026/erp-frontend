import React, { useEffect, useState } from "react";
import { FileUser, User } from "lucide-react";
import "./ConsultaSubsanacion.css";

const API_URL = "https://erp-unilibre-production.up.railway.app";

export default function ConsultaSubsanacion() {

    const [datos, setDatos] = useState([]);
    const [expertoSeleccionado, setExpertoSeleccionado] = useState(null);
    const [perfilLaboral, setPerfilLaboral] = useState("");
    const [perfilAcademico, setPerfilAcademico] = useState("");
    
    const [justificacion, setJustificacion] = useState("");
    const [editarPerfilLaboral, setEditarPerfilLaboral] = useState(false);
    const [editarPerfilAcademico, setEditarPerfilAcademico] = useState(false);
    const [editarJustificacion, setEditarJustificacion] = useState(false);

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

    const guardarSubsanacion = async () => {

    try {

        const token = localStorage.getItem("token");
        const subsanadoPor = localStorage.getItem("usuario");

        const body = {

            numero_novedad: expertoSeleccionado.numero_novedad,
            convocatoria: expertoSeleccionado.convocatoria,
            tipo_novedad: expertoSeleccionado.tipo_novedad,
            eje: expertoSeleccionado.eje,
            nivel: expertoSeleccionado.nivel,
            rol: expertoSeleccionado.rol,

            nombre: expertoSeleccionado.nombre,
            documento_experto: expertoSeleccionado.documento_experto,

            responsable: expertoSeleccionado.responsable,

            motivo_retiro: expertoSeleccionado.motivo_retiro,

            observaciones: expertoSeleccionado.justificacion_aprobacion,

            contactar_futuro:
                expertoSeleccionado.contactar_futuras_convocatorias,

            justificacion: justificacion,

            perfil_laboral: perfilLaboral,
            perfil_academico: perfilAcademico,

            validador: expertoSeleccionado.validador,

            subsanado_por: subsanadoPor

        };

        const res = await fetch(`${API_URL}/subsanaciones`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
});

const data = await res.json();

if (!res.ok) {
    throw new Error(data.detail || "Error al guardar la subsanación");
}

alert("Subsanación guardada correctamente.");

setExpertoSeleccionado(null);

cargarSubsanaciones();

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
                                             
                                             setJustificacion("");
                                             setEditarPerfilLaboral(false);
                                             setEditarPerfilAcademico(false);
                                             setJustificacion(item.justificacion_asignacion || "");
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
            <strong>Disponibilidad</strong>
            <p>{expertoSeleccionado.disponibilidad_tiempo}</p>
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

    <div className="titulo-edicion">

        <h4>Justificación</h4>

        <button
            type="button"
            className={`btn-modificar ${editarJustificacion ? "activo" : ""}`}
            onClick={() => setEditarJustificacion(!editarJustificacion)}
        >
            {editarJustificacion ? "Modificando información" : "Modificar"}
        </button>

    </div>

    <textarea
        className={`textarea-subsanacion ${editarJustificacion ? "editando" : ""}`}
        rows={5}
        value={justificacion}
        readOnly={!editarJustificacion}
        onChange={(e) => setJustificacion(e.target.value)}
        placeholder="Describa las correcciones realizadas para atender las observaciones."
    />

</div>   

<div className="texto-perfil">

    <div className="titulo-edicion">

        <h4>Perfil Laboral</h4>

        <button
            type="button"
            className={`btn-modificar ${editarPerfilLaboral ? "activo" : ""}`}
            onClick={() => setEditarPerfilLaboral(!editarPerfilLaboral)}
        >
            {editarPerfilLaboral ? "Modificando información" : "Modificar"}
        </button>

    </div>

    <textarea
        className={`textarea-subsanacion ${editarPerfilLaboral ? "editando" : ""}`}
        rows={6}
        value={perfilLaboral}
        readOnly={!editarPerfilLaboral}
        onChange={(e) => setPerfilLaboral(e.target.value)}
    />

</div>



<div className="texto-perfil">

    <div className="titulo-edicion">

        <h4>Perfil Académico</h4>

        <button
            type="button"
            className={`btn-modificar ${editarPerfilAcademico ? "activo" : ""}`}
            onClick={() => setEditarPerfilAcademico(!editarPerfilAcademico)}
        >
            {editarPerfilAcademico ? "Modificando información" : "Modificar"}
        </button>

    </div>

    <textarea
        className={`textarea-subsanacion ${editarPerfilAcademico ? "editando" : ""}`}
        rows={6}
        value={perfilAcademico}
        readOnly={!editarPerfilAcademico}
        onChange={(e) => setPerfilAcademico(e.target.value)}
    />

</div>

<div className="acciones-subsanacion">

    <button
        className="btn-guardar-subsanacion"
        type="button"
        onClick={guardarSubsanacion}
    >
        Guardar Subsanación
    </button>

    <button
        className="btn-retirar-novedad"
        type="button"
    >
        Retirar novedad
    </button>

    

</div>

 

    
</div>



                            </div>

                        </div>

                    </div>

            

            )}

        </div>

    );

}