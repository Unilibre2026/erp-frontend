import React, { useState } from "react";
import "./IndicadoresGestion.css";

function IndicadoresGestion() {

    const [consulta, setConsulta] = useState("productividad_diaria");
    const [convocatoria, setConvocatoria] = useState("");
    const [usuario, setUsuario] = useState("");

    return (
        <div className="indicadores-container">

            <h2>Indicadores de Gestión</h2>

                 <div className="filtros">

    <div className="campo">
        <label>Consulta</label>
        <select
            value={consulta}
            onChange={(e) => setConsulta(e.target.value)}
        >
            <option value="productividad_diaria">
                Productividad diaria
            </option>
        </select>
    </div>

    <div className="campo">
        <label>Convocatoria</label>
        <select
            value={convocatoria}
            onChange={(e) => setConvocatoria(e.target.value)}
        >
            <option value="">Seleccione...</option>
        </select>
    </div>

    <div className="campo">
        <label>Usuario</label>
        <select
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
        >
            <option value="">Seleccione...</option>
        </select>
    </div>

    <div className="acciones">
        <button className="btn-consultar">
            Consultar
        </button>
    </div>

</div>
            <div className="indicadores">
                <div className="tarjeta">
                    <span>Ingresos Totales</span>
                    <h3>0</h3>
                </div>

                <div className="tarjeta">
                    <span>Ingresos Usuario</span>
                    <h3>0</h3>
                </div>

                <div className="tarjeta">
                    <span>Participación</span>
                    <h3>0%</h3>
                </div>
            </div>

            <div className="contenedor-tabla">
                <table>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Día</th>
                            <th>Ingresos Totales</th>
                            <th>Ingresos Usuario</th>
                            <th>% Participación</th>
                        </tr>
                    </thead>

                    <tbody>
                    </tbody>

                </table>
            </div>

        </div>
    );
}

export default IndicadoresGestion;