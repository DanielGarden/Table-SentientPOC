import {Row,  RowData, RowModel } from "@tanstack/react-table";

export const flattenGroupedRows = <T extends any>(rows: Array<Row<any>>) => {
    const getSubRows = (row: Row<any>) => {
        if(row.subRows.length && row.getIsExpanded()) return [row, ...row.subRows.reduce((srows, srow) => srows.concat(getSubRows(srow)), [])]
        return row
    }

    const flattenedRows =  rows.reduce((rows, row) => rows.concat(getSubRows(row)) , [] as Array<Row<any>>)
    console.log(flattenedRows)
    return flattenedRows
}