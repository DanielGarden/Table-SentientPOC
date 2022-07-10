import styled from '@emotion/styled'
import {
    getGroupedRowModel,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    GroupingState,
    SortingState,
    useReactTable,
    VisibilityState
} from '@tanstack/react-table'
import { useCallback, useState } from 'react'
import { columns, defaultData } from '../data'
import { Window } from '../Window'
import { Table, TableBody, TableCell as _TableCell, TableFooter, TableHeader, TableRow as _TableRow } from './Table'


type TableCellProps = {
    width?: number
    issticky?: boolean
    leftpos?: number
    colSpan?: number
}

const TableCell = styled(_TableCell)(({ width, issticky, leftpos, colSpan }: TableCellProps) => {
    return {
        gridColumn: `span ${colSpan}`,
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

const pinRows = 0
const ddata = Array(3).fill(null).reduce((bigArr, littleArr) => bigArr.concat(defaultData),[])

export const GeneralTable = () => {
    const [data, setData] = useState([...ddata, ...ddata, ...ddata])
    const [sorting, setSorting] = useState<SortingState>([]);
    const [grouping, setGrouping] = useState<GroupingState>(['visits', 'status'])

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
        getGroupedRowModel: test
        // getGroupedRowModel,
    } = useReactTable({
        data,
        columns,
        columnResizeMode: 'onChange',
        state: { sorting, columnVisibility, grouping },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getGroupedRowModel: getGroupedRowModel(),
        onSortingChange: setSorting,
        groupedColumnMode: undefined 
    })

    // console.log(getGroupedRowModel())

    const rows = getRowModel().flatRows.slice(pinRows)
    console.log(test())
    const columnSizes = rows[3].getVisibleCells().map(cell => cell.column.getSize() || 0, [])
    // console.table(rows.map(r => r.getVisibleCells().map(c => ({value: c.getContext().getValue(), isGrouped: c.getIsGrouped(), agg: c.getIsAggregated()}))))
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
                        {flexRender(cell.column.columnDef.cell, cell.getContext())} {cell.getIsGrouped()}
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
                    {getRowModel().flatRows.slice(0, pinRows).map((row, ri) => (

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
                    <Window RowRender={RenderRow} totalItems={getRowModel().flatRows.slice(pinRows).length}/>
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