import * as React from 'react'

import './App.css'

import {
    ColumnResizeMode,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState
} from '@tanstack/react-table'
import { columns, defaultData } from './data'
import { Table, TableBody, TableCell as _TableCell, TableFooter, TableHeader, TableRow as _TableRow } from './table/Table'
import styled from '@emotion/styled'
import { useState } from 'react'

type TableCellProps = {
    width?: number
    issticky?: boolean
    leftpos?: number
}

const TableCell = styled(_TableCell)(({ width, issticky, leftpos }: TableCellProps) => {

    return {
        width: `${width || 150}px`,
        position: issticky ? 'sticky' : 'inherit',
        zIndex: issticky ? 5 : undefined,
        left: leftpos != null && issticky ? `${leftpos}px` : undefined,
    }
})

type TableRowProps = {
    issticky?: boolean
    toppos?: number
}
const TableRow = styled(_TableRow)(({ issticky, toppos }: TableRowProps) => ({
    position: issticky ? 'sticky' : 'inherit',
    left: toppos != null && issticky ? `${toppos}px` : undefined,

}))

const pinRows = 2
const ddata = [...defaultData, ...defaultData, ...defaultData]

export default function App() {
    const [data, setData] = useState([...ddata, ...ddata, ...ddata])
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        age: false
    })

    const {
        getHeaderGroups,
        getRowModel,
        getFooterGroups,
        getState
    } = useReactTable({
        data,
        columns,
        columnResizeMode: 'onChange',
        state: { sorting, columnVisibility },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting
    })

    // React.useEffect(() => {
    //     columns[1].getToggleVisibilityHandler()
    // }, [])

    return (
        <div className="p-2">
            <Table>
                <TableHeader>
                    {getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id} issticky={pinRows > 0} toppos={0}>
                            {headerGroup.headers.map((header, i) => (
                                <TableCell key={header.id}
                                    issticky={i < 2}
                                    leftpos={header.column.getStart()}

                                    width={header.column.getSize()}

                                >
                                    <button
                                        onMouseDown={header.getResizeHandler()}
                                        onTouchStart={header.getResizeHandler()}

                                        style={{
                                            color: 'purple',
                                            
                                        }}
                                    >{header.column.getIsResizing() ? 'resizingggg' : 'not resizing'} {header.column.getCanResize() ? 'Can' : 'Cannot'} {header.column.getSize()}</button>
                                    <span onClick={(e) => {
                                        header.column.getToggleSortingHandler()?.({
                                            ...e,
                                            shiftKey: sorting.length ? true : false
                                        })
                                    }}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        {{
                                            asc: " 🔼",
                                            desc: " 🔽"
                                        }[header.column.getIsSorted() as string] ?? null}
                                    </span>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                    {getRowModel().rows.slice(0, pinRows).map((row, ri) => (

                        <TableRow key={row.id} issticky={pinRows > ri}>
                            {row.getVisibleCells().map((cell, i) => (
                                <TableCell
                                    key={cell.id}
                                    issticky={i < 2}
                                    leftpos={cell.column.getStart()}
                                >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    {/* {console.log(getState())} */}
                                </TableCell>
                            ))}
                        </TableRow>

                    ))}
                </TableHeader>
                <TableBody>
                    {getRowModel().rows.slice(pinRows).map((row, ri) => (
                        <TableRow key={row.id} issticky={pinRows > ri} >
                            {row.getVisibleCells().map((cell, i) => (
                                <TableCell
                                    key={cell.id}
                                    issticky={i < 2}
                                    leftpos={cell.column.getStart()}
                                >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    {/* {console.log(getState())} */}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    {getFooterGroups().map(footerGroup => (
                        <TableRow key={footerGroup.id}>
                            {footerGroup.headers.map(header => (
                                <TableCell key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.footer,
                                            header.getContext()
                                        )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableFooter>
            </Table>
        </div >
    )
}