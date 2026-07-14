import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Logo from "../assets/logo.png";

export async function exportarConsultaCNSC(
    convocatoria,
    datos
) {

    const workbook = new ExcelJS.Workbook();

    const hoja = workbook.addWorksheet("Consulta CNSC");



    // ==========================================
    // AQUÍ CONSTRUIREMOS EL REPORTE
    // ==========================================



    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(

        new Blob([buffer]),

        `Consulta CNSC - ${convocatoria}.xlsx`

    );

}