import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

import { useSearchParams } from 'react-router-dom'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select'

interface PaginationProps {
  pages: number
  items: number
  page: number
  rows: number
}

export function Pagination({ items, page, pages, rows }: Readonly<PaginationProps>) {
  const [, setSearchParams] = useSearchParams()

  function firstPage() {
    setSearchParams(params => {
      params.set('page', '1')

      return params
    })
  }

  function previousPage() {
    if (page - 1 <= 0) {
      return
    }

    setSearchParams(params => {
      params.set('page', String(page - 1))

      return params
    })
  }

  function nextPage() {
    if (page + 1 > pages) {
      return
    }

    setSearchParams(params => {
      params.set('page', String(page + 1))

      return params
    })
  }

  function lastPage() {
    setSearchParams(params => {
      params.set('page', String(pages))

      return params
    })
  }

  function handleChangeRowsSize(value: string) {
    setSearchParams(params => {
      params.set('rows', value)

      return params
    })
  }

  return (
    <div className="flex text-sm items-center justify-between text-zinc-500">
      <span>Showing {rows} of {items} items</span>
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <span>Rows per page</span>

          <Select onValueChange={handleChangeRowsSize} defaultValue={rows.toString()}>
            <SelectTrigger aria-label="Page" />
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <span>Page {page} of {pages}</span>

        <div className="space-x-1.5">
          <Button onClick={firstPage} size="icon" disabled={page - 1 <= 0}>
            <ChevronsLeft className="size-4" />
            <span className="sr-only">First page</span>
          </Button>
          <Button onClick={previousPage} size="icon" disabled={page - 1 <= 0}>
            <ChevronLeft className="size-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <Button onClick={nextPage} size="icon" disabled={page + 1 > pages}>
            <ChevronRight className="size-4" />
            <span className="sr-only">Next page</span>
          </Button>
          <Button onClick={lastPage} size="icon" disabled={page + 1 > pages}>
            <ChevronsRight className="size-4" />
            <span className="sr-only">Last page</span>
          </Button>
        </div>
      </div>
    </div>
  )
}