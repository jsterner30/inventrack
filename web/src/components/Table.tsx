import React from 'react'
import { InventoryItem } from '../util/types'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState
} from '@tanstack/react-table'

interface Props {
  items: InventoryItem[]
}

const columnHelper = createColumnHelper<InventoryItem>()

// Sets the names to be more human readable
// and sets information in columns will be displayed
const columns = [
  columnHelper.accessor('imageUrl', {
    cell: url => <img
      src={url.getValue()}
      alt={url.row.original.productName}
      className='me-3'
      style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                 />,
    header: ''
  }),
  columnHelper.accessor('productName', {
    header: 'Product'
  }),
  columnHelper.accessor('sku', {
    header: 'SKU'
  }),
  columnHelper.accessor('totalInventory', {
    header: 'Total Inventory'
  }),
  columnHelper.accessor('committed', {
    header: 'Committed'
  }),
  columnHelper.accessor('available', {
    header: 'Available To Sell'
  })
]

export const Table: React.FC<Props> = ({ items }) => {
  const [pageIndex, setPageIndex] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(5)
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      pagination: {
        pageIndex,
        pageSize
      },
      sorting
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({ pageIndex, pageSize })
        setPageIndex(newState.pageIndex)
        setPageSize(newState.pageSize)
      } else {
        setPageIndex(updater.pageIndex)
        setPageSize(updater.pageSize)
      }
    },
    onSortingChange: setSorting // Update sorting state
  })

  return (
    <div className='p-2'>
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()} // Enable sorting on click
                  style={{ cursor: 'pointer', textAlign: 'center', padding: '8px' }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  {header.column.getIsSorted() === 'asc' ? ' 🔼' : header.column.getIsSorted() === 'desc' ? ' 🔽' : ''}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} style={{ textAlign: 'center', padding: '8px' }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className='tableFooter'>
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </button>
        <div>Viewing {pageIndex * pageSize}-{(pageIndex + 1) * pageSize} Out Of {items.length} Items</div>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </button>
      </div>
    </div>
  )
}
