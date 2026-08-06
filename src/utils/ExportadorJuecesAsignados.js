import * as XLSX from "xlsx";

export const exportarJuecesAsignados = (reporte, convocatoria) => {

    const datos = reporte.map(item => ({
        Novedad: item.numero_novedad,
        Documento: item.documento,
        "Nombre del experto": item.nombre,
        Estado: item.estado,
        Ciudad: item.ciudad,
        Rol: item.rol,
        Disponibilidad: item.disponibilidad,
        Teléfono: item.telefono,
        "Ciudad de domicilio": item.ciudad_domicilio
    }));

    const hoja = XLSX.utils.json_to_sheet(datos);

    const libro = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(libro, hoja, "Jueces");

    XLSX.writeFile(
        libro,
        `Jueces_Asignados_${convocatoria}.xlsx`
    );

};