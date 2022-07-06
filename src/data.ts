
import {
    ColumnDef
} from '@tanstack/react-table'

export type Person = {
    firstName: string
    lastName: string
    age: number
    visits: number
    status: string
    progress: number
    date: number
}

export const defaultData: Person[] = [
    {
        firstName: 'tanner',
        lastName: 'linsley',
        age: 24,
        visits: 100,
        status: 'In Relationship',
        progress: 50,
        date: 1657054748000,
    },
    {
        firstName: 'tanner',
        lastName: 'linsley',
        age: 29,
        visits: 100,
        status: 'In Relationship',
        progress: 50,
        date: 1657054748000,
    },
    {
        firstName: 'tanner',
        lastName: 'linsley',
        age: 42,
        visits: 100,
        status: 'In Relationship',
        progress: 50,
        date: 1657054748000,
    },
    {
        firstName: 'Banner',
        lastName: 'linsley',
        age: 42,
        visits: 100,
        status: 'In Relationship',
        progress: 50,
        date: 1657054748000,
    },
    {
        firstName: 'Ranner',
        lastName: 'linsley',
        age: 42,
        visits: 100,
        status: 'In Relationship',
        progress: 50,
        date: 1657054748000,
    },
    {
        firstName: 'tandy',
        lastName: 'miller',
        age: 40,
        visits: 40,
        status: 'Single',
        progress: 80,
        date: 1227054748000,
    },
    {
        firstName: 'joe',
        lastName: 'dirte',
        age: 45,
        visits: 20,
        status: 'Complicated',
        progress: 10,
        date: 1327023748000,
    },
]

export const columns: ColumnDef<Person>[] = [

    {
        accessorKey: 'firstName',
        cell: info => info.getValue(),
        footer: props => props.column.id,
        size: 150,
        enableResizing: true
    },
    {
        accessorFn: row => row.lastName,
        id: 'lastName',
        cell: info => info.getValue(),
        header: () => "Last Name",
        footer: props => props.column.id,
        minSize: 150,
        maxSize: 500,
        enableResizing: true

    },

    {
        header: 'Info',
        footer: props => props.column.id,
        columns: [
            {
                accessorKey: 'age',
                header: () => 'Age',
                footer: props => props.column.id,
            },
            {
                header: 'More Info',
                columns: [
                    {
                        accessorKey: 'visits',
                        header: () => "Visits",
                        footer: props => props.table.getRowModel().rows.reduce((total, current) => total + current.getValue('visits'), 0),
                        size: 400

                    },
                    {
                        accessorKey: 'status',
                        header: 'Status',
                        footer: props => props.column.id,
                        size: 400

                    },
                    {
                        accessorKey: 'progress',
                        header: 'Profile Progress',
                        footer: props => props.column.id,
                        size: 400

                    },
                    {

                        accessorKey: 'date',
                        header: 'Date Progress',
                        cell: d => new Date(d.getValue()).getTime(),
                        size: 400

                    },
                ],
            },
        ],
    },
]
