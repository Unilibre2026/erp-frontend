import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Logo from "../assets/logo.png";

export async function exportarAvanceGeneral(
    convocatoria,
    ciudades = [],
    roles = [],
    vacantes = []
) {

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "ERP Universidad Libre";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Avance General");

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

    //=====================================
    // ANCHO DE COLUMNAS
    //=====================================

    console.log("Convocatoria:", convocatoria);
    console.log("Ciudades:", ciudades);
    console.log("Roles:", roles);
    console.log("Vacantes:", vacantes);

//=====================================
// ANCHO DE COLUMNAS
//=====================================

const columnas = [

    { width: 25 } // Ciudad

];

roles.forEach(() => {

    columnas.push({ width: 14 });
    columnas.push({ width: 14 });
    columnas.push({ width: 14 });

});

columnas.push({ width: 14 });
columnas.push({ width: 14 });
columnas.push({ width: 14 });

worksheet.columns = columnas;

//=====================================
// TITULO
//=====================================

const ultimaColumna = worksheet.columnCount;

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

            col: 10.2,   // Entre las columnas K y L
            row: 0.6

        },

        ext: {

            width: 165,
            height: 60

        }

    }

);

//=====================================
// INFORMACIÓN
//=====================================

    worksheet.getCell("A5").value = "Convocatoria";
    worksheet.getCell("B5").value = convocatoria;

    worksheet.getCell("A6").value = "Fecha";
    worksheet.getCell("B6").value = new Date();
    worksheet.getCell("B6").numFmt = "dd/mm/yyyy hh:mm";

    //Ajustar ancho de columnas de información//
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
            columna + 2
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
        worksheet.getCell(filaSubtitulos, columna + 2).value = "% avance";

        for (let i = 0; i < 3; i++) {

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

        columna += 3;

    });

    //------------------------------------
    // TOTAL
    //------------------------------------

    worksheet.mergeCells(
        filaRoles,
        columna,
        filaRoles,
        columna + 2
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
    worksheet.getCell(filaSubtitulos, columna + 2).value = "% avance";

    for (let i = 0; i < 3; i++) {

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

const obtenerCantidad = (ciudad, rol) => {

    return vacantes
        .filter(v =>

            v.indicador === ciudad &&
            v.rol === rol

        )
        .reduce(

            (total, v) => total + Number(v.num_expertos || 0),

            0

        );

};

const obtenerTotalCiudad = (ciudad) => {

    return vacantes
        .filter(v => v.indicador === ciudad)
        .reduce(

            (total, v) => total + Number(v.num_expertos || 0),

            0

        );

};



//=====================================
// DATOS DE LA TABLA
//=====================================

let fila = 11;

ciudades.forEach((ciudad) => {

    let columna = 1;

    worksheet.getCell(fila, columna).value = ciudad;

    columna++;

    roles.forEach((rol) => {

        worksheet.getCell(fila, columna).value =
            obtenerCantidad(ciudad, rol);

        columna++;

        worksheet.getCell(fila, columna).value = 0;

        columna++;

        worksheet.getCell(fila, columna).value = "0,0%";

        columna++;

    });

    worksheet.getCell(fila, columna).value =
        obtenerTotalCiudad(ciudad);

    columna++;

    worksheet.getCell(fila, columna).value = 0;

    columna++;

    worksheet.getCell(fila, columna).value = "0,0%";

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

worksheet.getCell(fila, columnaTotal).value = "0,0%";

    //=====================================
    // GUARDAR
    //=====================================

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(
        new Blob([buffer]),
        "Consulta_Avance_General.xlsx"
    );

}