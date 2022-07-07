import {

    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState
} from '@tanstack/react-table'
import { FixedSizeList } from 'react-window'
import { columns, defaultData } from '../data'
import { Table, TableBody, TableCell as _TableCell, TableFooter, TableHeader, TableRow as _TableRow } from './Table'
import styled from '@emotion/styled'
import { useState, useCallback, useMemo } from 'react'
import { Window } from '../Window'


type TableCellProps = {
    width?: number
    issticky?: boolean
    leftpos?: number
    colSpan?: number
}

const TableCell = styled(_TableCell)(({ width, issticky, leftpos, colSpan }: TableCellProps) => {
    return {
        // width: width ? `${width}px` : undefined,
        // width: "100%",
        position: issticky ? 'sticky' : 'static',
        zIndex: issticky ? 5 : undefined,
        left: leftpos != null && issticky ? `${leftpos}px` : undefined,
    }
})

type TableRowProps = {
    issticky?: boolean
    toppos?: number
    columnSizes: Array<number>
}
const TableRow = styled(_TableRow)(({ issticky, toppos, columnSizes }: TableRowProps) => ({
    position: issticky ? 'sticky' : 'inherit',
    left: toppos != null && issticky ? `${toppos}px` : undefined,
    gridTemplateColumns: columnSizes.reduce((sizes, column) => sizes += `${column}px `, "")
}))

const pinRows = 2
const ddata = Array(2000).fill(null).reduce((bigArr, littleArr) => bigArr.concat(defaultData),[])

export const GeneralTable = () => {
    const [data, setData] = useState([...ddata, ...ddata, ...ddata])
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        age: false
    })

    const {
        getHeaderGroups,
        getAllColumns,
        getRowModel,
        getFooterGroups,
        getState,
        getTotalSize,
    } = useReactTable({
        data,
        columns,
        columnResizeMode: 'onChange',
        state: { sorting, columnVisibility },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
    })

    console.log(getAllColumns())

    const rows = getRowModel().rows.slice(pinRows)

    const columnSizes = rows[1].getVisibleCells().map(cell => cell.column.getSize() || 0, [])

    const RenderRow = useCallback(({ index, style }) => {
        const row = rows[index]
        return (
            <TableRow key={`${row.id}-${index}`} style={{ ...style }} columnSizes={columnSizes} data-testid={`row-${index}`}>
                {row.getVisibleCells().map((cell, i) => (
                    <TableCell
                        key={cell.id}
                        issticky={i < 2}
                        leftpos={cell.column.getStart()}
                        width={cell.column.columnDef.size}
                        
                    >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        {/* {console.log(getState())} */}
                    </TableCell>
                ))}
            </TableRow>)
    }, [rows])

    return (
        <div>
            <Table style={{ width: getTotalSize(), margin: '0 2em' }} >
                <TableHeader>
                    {getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id} issticky={false} columnSizes={columnSizes}>
                            {headerGroup.headers.map((header, i) => (
                                <TableCell key={header.id}
                                    issticky={i < 2}
                                    leftpos={header.column.getStart()}
                                    colSpan={header.colSpan}
                                    width={header.column.getSize()}

                                >
                                    {console.log(header.column.id)}
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

                        <TableRow key={row.id} issticky={false} columnSizes={columnSizes}>
                            {row.getVisibleCells().map((cell, i) => (
                                <TableCell
                                    key={cell.id}
                                    issticky={i < 2}
                                    leftpos={cell.column.getStart()}
                                    width={cell.column.getSize()}
                                >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    {/* {console.log(getState())} */}
                                </TableCell>
                            ))}
                        </TableRow>

                    ))}
                </TableHeader>
                <TableBody>
                    {/* <FixedSizeList
                        height={400}
                        itemCount={getRowModel().rows.slice(pinRows).length}
                        itemSize={28}
                        width={"calc(100% + 1.5em)"}
                    >
                        {RenderRow}
                    </FixedSizeList> */}
                    <Window RowRender={RenderRow} totalItems={getRowModel().rows.slice(pinRows).length}/>
                </TableBody>
                <TableFooter>
                    {getFooterGroups().map(footerGroup => (
                        <TableRow key={footerGroup.id} columnSizes={columnSizes}>
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