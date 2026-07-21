import React, { useEffect, useState } from "react";
import "./AspirantesConvocatoria.css";
import * as XLSX from "xlsx";
import { exportarAspirantes } from "../utils/ExportadorAspirantes";

const API_URL = "https://erp-unilibre-production.up.railway.app";

function AspirantesConvocatoria() {

    // ==========================================
    // ESTADOS
    // ==========================================

    const [convocatorias, setConvocatorias] = useState([]);
    const [convocatoria, setConvocatoria] = useState("");

    const [archivo, setArchivo] = useState(null);

    const [datos, setDatos] = useState([]);

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

// ==========================================
// CONSULTAR ASPIRANTES
// ==========================================

const cargarAspirantes = async (convocatoriaSeleccionada) => {

    if (!convocatoriaSeleccionada) {

        setDatos([]);

        return;

    }

    try {

        const token = localStorage.getItem("token");

        const res = await fetch(

            `${API_URL}/aspirantes-convocatoria/${encodeURIComponent(convocatoriaSeleccionada)}`,

            {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            }

        );

        if (!res.ok) {

            throw new Error("Error consultando aspirantes.");

        }

        const data = await res.json();

        setDatos(data.datos || []);

    }

    catch (error) {

        console.error(error);

        setDatos([]);

    }

};

const cargarArchivo = async () => {

    console.log("Entró a cargarArchivo");

    if (!archivo) {

        alert("Seleccione un archivo.");

        return;

    }

    const reader = new FileReader();

    reader.onload = async (e) => {

        const data = new Uint8Array(e.target.result);

        const workbook = XLSX.read(data, {

            type: "array"

        });

        const hoja = workbook.Sheets[workbook.SheetNames[0]];

        const encabezados = XLSX.utils.sheet_to_json(hoja, {
           header: 1
         })[0];

        const columnasEsperadas = [

         "convocatoria",
         "documento",
         "nombre"

];

const encabezadosArchivo = encabezados.map(c =>

    String(c).trim().toLowerCase()

);

const archivoValido = columnasEsperadas.every(columna =>

    encabezadosArchivo.includes(columna)

);

if (!archivoValido) {

    alert(

        "El archivo no tiene la estructura esperada."

    );

    return;

}


        const filas = XLSX.utils.sheet_to_json(hoja);

// ==========================================
// LIMPIAR DATOS
// ==========================================

const filasLimpias = filas.map(fila => ({

    convocatoria: String(fila.convocatoria ?? "").trim(),

    documento: String(fila.documento ?? "").trim(),

    nombre: String(fila.nombre ?? "").trim()

}));

// ==========================================
// VALIDAR QUE EL ARCHIVO TENGA REGISTROS
// ==========================================

if (filasLimpias.length === 0) {

    alert("El archivo no contiene registros.");

    return;

}

// ==========================================
// VALIDAR CAMPOS OBLIGATORIOS
// ==========================================

const registrosInvalidos = filasLimpias.filter(

    fila => !fila.documento || !fila.nombre

);

if (registrosInvalidos.length > 0) {

    alert(
        `Se encontraron ${registrosInvalidos.length} registros sin documento o nombre.`
    );

    return;

}


try {

    const token = localStorage.getItem("token");
    const usuario = localStorage.getItem("usuario");

    const res = await fetch(

        `${API_URL}/aspirantes-convocatoria/cargar`,

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`

            },

            body: JSON.stringify({

                usuario,
                aspirantes: filasLimpias

            })

        }

    );

    const resultado = await res.json();

    if (!res.ok) {

        throw new Error(resultado.detail || "Error al cargar los aspirantes.");

    }

    alert(resultado.mensaje);

}
catch (error) {

    console.error(error);

    alert(error.message);

}

    };

    reader.readAsArrayBuffer(archivo);

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

                      onChange={(e) => {

                       const valor = e.target.value;

                         setConvocatoria(valor);

                         cargarAspirantes(valor);

    }}

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
                 disabled={!archivo}
                  onClick={cargarArchivo}

>

    📤 Cargar archivo

</button>

                <button
                  className="btn-exportar"
                  disabled={!convocatoria || datos.length === 0}
                  onClick={() => exportarAspirantes(convocatoria, datos)}
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

    {

                     datos.map((fila, index) => (

                      <tr key={index}>

                        <td>{fila.convocatoria}</td>

                        <td>{fila.documento}</td>

                        <td>{fila.nombre}</td>

            </tr>

        ))

    }

</tbody>

                </table>

            </div>

        </div>

    );

}

export default AspirantesConvocatoria;