import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export async function exportarAvanceGeneral() {

    // Crear libro
    const workbook = new ExcelJS.Workbook();

    workbook.creator = "ERP Universidad Libre";
    workbook.lastModifiedBy = "ERP Universidad Libre";
    workbook.created = new Date();

    // Crear hoja
    const worksheet = workbook.addWorksheet("Avance General");

    // Texto de prueba
    worksheet.getCell("A1").value = "UNIVERSIDAD LIBRE";

    worksheet.getCell("A2").value = "CONSULTA AVANCE GENERAL";

    worksheet.getCell("A3").value = "Exportación en construcción";

    // Generar archivo

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(

        new Blob([buffer]),

        "Prueba.xlsx"

    );

}