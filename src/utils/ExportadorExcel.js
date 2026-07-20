import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Logo from "../assets/logo.png";

export async function exportarAvanceGeneral(
    convocatoria,
    ciudades = [],
    roles = [],
    vacantes = [],
    reclutados = [],
    preAprobados = []
) {

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "ERP Universidad Libre";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Avance General");

    console.log("========== EXPORTAR EXCEL ==========");
    console.log("Vacantes:", vacantes);
    console.log("Reclutados:", reclutados);

 if (reclutados.length > 0) {
    console.log("Primer reclutado:", reclutados[0]);
}

//=====================================
// CARGAR LOGO
//=====================================

const response = await fetch(Logo);

const blob = await response.blob();

const logoBuffer = await blob.arrayBuffer();

const logoId = workbook.addImage({

    buffer: logoBuffer,

    extension: "png"

});

    if (!Array.isArray(ciudades)) ciudades = [];

    if (!Array.isArray(roles)) roles = [];

    if (!Array.isArray(vacantes)) vacantes = [];

    if (!Array.isArray(preAprobados)) preAprobados = [];


//=====================================
// ANCHO DE COLUMNAS
//=====================================

const columnas = [

    { width: 25 } // Ciudad

];

roles.forEach(() => {

    columnas.push({ width: 14 }); // Requerido
    columnas.push({ width: 14 }); // Reclutado
    columnas.push({ width: 14 }); // Pre aprobado
    columnas.push({ width: 14 }); // Aprobado
    columnas.push({ width: 14 }); // % avance

});

columnas.push({ width: 14 });
columnas.push({ width: 14 });
columnas.push({ width: 14 });
columnas.push({ width: 14 });
columnas.push({ width: 14 });

worksheet.columns = columnas;
worksheet.properties.defaultRowHeight = 22;

//=====================================
// TITULO
//=====================================



// Título centrado dejando espacio para el logo a la derecha
worksheet.mergeCells(2, 2, 2, 10);

worksheet.getCell("B2").value = "UNIVERSIDAD LIBRE";

worksheet.getCell("B2").font = {

    bold: true,
    size: 22,
    color: { argb: "0B5D74" },
    name: "Calibri"

};

worksheet.getCell("B2").alignment = {

    horizontal: "center",
    vertical: "middle"

};

// Altura de la fila del título
worksheet.getRow(2).height = 40;    
//=====================================
// SUBTITULO
//=====================================

// Subtítulo centrado dejando espacio para el logo
worksheet.mergeCells(3, 2, 3, 10);

worksheet.getCell("B3").value = "CONSULTA AVANCE GENERAL";

worksheet.getCell("B3").font = {

    bold: true,
    size: 16,
    name: "Calibri"

};

worksheet.getCell("B3").alignment = {

    horizontal: "center",
    vertical: "middle"

};

// Altura de la fila del subtítulo
worksheet.getRow(3).height = 28;

//=====================================
// INSERTAR LOGO
//=====================================

worksheet.addImage(

    logoId,

    {

        tl: {

            col: 10.8,
            row: 0.7

        },

        ext: {

            width: 180,
            height: 68

        }

    }

);

//=====================================
// INFORMACIÓN
//=====================================

worksheet.getCell("A5").value = "Convocatoria";
worksheet.getCell("B5").value = convocatoria;

// ← AQUÍ va el código de fecha Colombia

const ahora = new Date();

const fechaColombia = new Date(
    ahora.toLocaleString("en-US", {
        timeZone: "America/Bogota"
    })
);

worksheet.getCell("A6").value = "Fecha";
worksheet.getCell("B6").value = fechaColombia;
worksheet.getCell("B6").numFmt = "dd/mm/yyyy hh:mm";

// Ajustar ancho de columnas...
worksheet.getColumn(1).width = 25;
worksheet.getColumn(2).width = 28;

    //=====================================
    // ENCABEZADOS
    //=====================================

    const filaRoles = 9;
    const filaSubtitulos = 10;

    worksheet.getRow(filaRoles).height = 30;
    worksheet.getRow(filaSubtitulos).height = 24;

    //------------------------------------
    // CIUDAD
    //------------------------------------

    worksheet.mergeCells(
        filaRoles,
        1,
        filaSubtitulos,
        1
    );

    const celdaCiudad = worksheet.getCell(filaRoles, 1);

    celdaCiudad.value = "Ciudad";

    celdaCiudad.alignment = {

        horizontal: "center",
        vertical: "middle"

    };

    celdaCiudad.font = {

        bold: true,
        color: { argb: "FFFFFF" },
        size: 12

    };

    celdaCiudad.fill = {

        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "0B5D74" }

    };

    //------------------------------------
    // ROLES
    //------------------------------------

    let columna = 2;

    roles.forEach((rol) => {

        worksheet.mergeCells(
            filaRoles,
            columna,
            filaRoles,
            columna + 4
        );

        const tituloRol = worksheet.getCell(filaRoles, columna);

        tituloRol.value = rol;

        tituloRol.alignment = {

            horizontal: "center",
            vertical: "middle"

        };

        tituloRol.font = {

            bold: true,
            color: { argb: "FFFFFF" }

        };

        tituloRol.fill = {

            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "0B5D74" }

        };

        worksheet.getCell(filaSubtitulos, columna).value = "Requerido";
        worksheet.getCell(filaSubtitulos, columna + 1).value = "Reclutado";
        worksheet.getCell(filaSubtitulos, columna + 2).value = "Pre aprobado";
        worksheet.getCell(filaSubtitulos, columna + 3).value = "Aprobado";
        worksheet.getCell(filaSubtitulos, columna + 4).value = "% avance";

        for (let i = 0; i < 5; i++) {

            const celda = worksheet.getCell(
                filaSubtitulos,
                columna + i
            );

            celda.font = {

                bold: true,
                color: { argb: "FFFFFF" }

            };

            celda.alignment = {

                horizontal: "center"

            };

            celda.fill = {

                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "2F7D94" }

            };

        }

        columna += 5;

    });

    //------------------------------------
    // TOTAL
    //------------------------------------

    worksheet.mergeCells(
        filaRoles,
        columna,
        filaRoles,
        columna + 4
    );

    const tituloTotal = worksheet.getCell(filaRoles, columna);

    tituloTotal.value = "TOTAL";

    tituloTotal.font = {

        bold: true,
        color: { argb: "FFFFFF" }

    };

    tituloTotal.alignment = {

        horizontal: "center"

    };

    tituloTotal.fill = {

        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "0B5D74" }

    };

    worksheet.getCell(filaSubtitulos, columna).value = "Requerido";
    worksheet.getCell(filaSubtitulos, columna + 1).value = "Reclutado";
    worksheet.getCell(filaSubtitulos, columna + 2).value = "Pre aprobado";
    worksheet.getCell(filaSubtitulos, columna + 3).value = "Aprobado";
    worksheet.getCell(filaSubtitulos, columna + 4).value = "% avance";

    for (let i = 0; i < 5; i++) {

        const celda = worksheet.getCell(
            filaSubtitulos,
            columna + i
        );

        celda.font = {

            bold: true,
            color: { argb: "FFFFFF" }

        };

        celda.alignment = {

            horizontal: "center"

        };

        celda.fill = {

            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "2F7D94" }

        };

    }

//=====================================
// FUNCIONES AUXILIARES
//=====================================

//------------------------------
// VACANTES REQUERIDAS
//------------------------------

const obtenerRequeridos = (ciudad, rol) => {

    return vacantes
        .filter(v =>
            v.indicador === ciudad &&
            v.rol === rol
        )
        .reduce(
            (t, v) => t + Number(v.num_expertos || 0),
            0
        );

};

const obtenerReclutados = (ciudad, rol) => {

    const dato = reclutados.find(r =>
        String(r.eje).trim() === String(ciudad).trim() &&
        String(r.rol).trim() === String(rol).trim()
    );

    if (dato) {
        console.log("ENCONTRADO:", ciudad, rol, dato.reclutados);
    } else {
        console.log("NO ENCONTRADO:", ciudad, rol);
    }

    return dato ? Number(dato.reclutados) : 0;

};
//------------------------------
// PRE APROBADOS
//------------------------------

const obtenerPreAprobados = (ciudad, rol) => {

    const dato = preAprobados.find(p =>

        String(p.indicador).trim() === String(ciudad).trim() &&
        String(p.rol).trim() === String(rol).trim()

    );

    return dato ? Number(dato.pre_aprobados) : 0;

};

//------------------------------
// APROBADOS
//------------------------------

const obtenerAprobados = (ciudad, rol) => {

    return reclutados.filter(r =>
        r.indicador === ciudad &&
        r.rol === rol &&
        r.estado === "APROBADO"
    ).length;

};


//------------------------------
// PORCENTAJE
//------------------------------

const calcularPorcentaje = (requeridos, reclutados) => {

    if (requeridos === 0) return 0;

    return reclutados / requeridos;

};



//=====================================
// DATOS DE LA TABLA
//=====================================

let fila = 11;

ciudades.forEach((ciudad) => {

    let columna = 1;

    worksheet.getCell(fila, columna).value = ciudad;

    columna++;

    let totalRequeridosCiudad = 0;
    let totalReclutadosCiudad = 0;
    let totalPreCiudad = 0;
    let totalAprobadosCiudad = 0;

    roles.forEach((rol) => {

        const requeridos = obtenerRequeridos(ciudad, rol);
        const reclutadosRol = obtenerReclutados(ciudad, rol);
        const preRol = obtenerPreAprobados(ciudad, rol);
        const aprobadosRol = obtenerAprobados(ciudad, rol);

        totalRequeridosCiudad += requeridos;
        totalReclutadosCiudad += reclutadosRol;
        totalPreCiudad += preRol;
        totalAprobadosCiudad += aprobadosRol;

        worksheet.getCell(fila, columna).value = requeridos;
        columna++;

        worksheet.getCell(fila, columna).value = reclutadosRol;
        columna++;

        worksheet.getCell(fila, columna).value = preRol;
        columna++;

        worksheet.getCell(fila, columna).value = aprobadosRol;
        columna++;

        const porcentaje = calcularPorcentaje(
            requeridos,
            reclutadosRol
        );

        worksheet.getCell(fila, columna).value = porcentaje;
        worksheet.getCell(fila, columna).numFmt = "0.0%";

        columna++;

    });

    worksheet.getCell(fila, columna).value = totalRequeridosCiudad;
    columna++;

    worksheet.getCell(fila, columna).value = totalReclutadosCiudad;
    columna++;

    worksheet.getCell(fila, columna).value = totalPreCiudad;
    columna++;

    worksheet.getCell(fila, columna).value = totalAprobadosCiudad;
    columna++;

    worksheet.getCell(fila, columna).value =
        calcularPorcentaje(
            totalRequeridosCiudad,
            totalReclutadosCiudad
        );

    worksheet.getCell(fila, columna).numFmt = "0.0%";

    fila++;

});


//=====================================
// FILA TOTAL
//=====================================

let columnaTotal = 1;

worksheet.getCell(fila, columnaTotal).value = "TOTAL";

worksheet.getCell(fila, columnaTotal).font = {
    bold: true
};

worksheet.getCell(fila, columnaTotal).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FCE4EC" }
};

columnaTotal++;

roles.forEach((rol) => {

    const requerido = vacantes
        .filter(v => v.rol === rol)
        .reduce((t, v) => t + Number(v.num_expertos || 0), 0);

    worksheet.getCell(fila, columnaTotal).value = requerido;
    columnaTotal++;

    worksheet.getCell(fila, columnaTotal).value = 0;
    columnaTotal++;

    worksheet.getCell(fila, columnaTotal).value = 0;
    columnaTotal++;

    worksheet.getCell(fila, columnaTotal).value = 0;
    columnaTotal++;

    worksheet.getCell(fila, columnaTotal).value = "0,0%";
    columnaTotal++;

});

const totalGeneral = vacantes.reduce(

    (t, v) => t + Number(v.num_expertos || 0),

    0

);

worksheet.getCell(fila, columnaTotal).value = totalGeneral;
columnaTotal++;

worksheet.getCell(fila, columnaTotal).value = 0;
columnaTotal++;

worksheet.getCell(fila, columnaTotal).value = 0;
columnaTotal++;

worksheet.getCell(fila, columnaTotal).value = 0;
columnaTotal++;

worksheet.getCell(fila, columnaTotal).value = "0,0%";
columnaTotal++;

    //=====================================
    // GUARDAR
    //=====================================

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(
        new Blob([buffer]),
        "Consulta_Avance_General.xlsx"
    );

}