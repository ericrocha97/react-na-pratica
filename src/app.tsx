import { Plus, Search, FileDown, MoreHorizontal, ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'
import { Header } from './components/header'
import { Tabs } from './components/tabs'
import { Button } from './components/ui/button'
import { Control, Input } from './components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table'
import { Pagination } from './components/pagination'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'

export interface TagResponse {
  first: number
  prev: number | null
  next: number
  last: number
  pages: number
  items: number
  data: Tag[]
}

export interface Tag {
  title: string
  amountOfVideos: number
  id: string
}

type SortState = 'asc' | 'desc' | 'undefined';

export function App() {
  const [searchParams, setSearchParams] = useSearchParams()
  const urlFilter = searchParams.get('filter') ?? ''

  const [filter, setFilter] = useState(urlFilter)

  const [sort, setSort] = useState("")

  const [sortTag, setSortTag] = useState<SortState>('undefined')
  const [sortVideo, setSortVideo] = useState<SortState>('undefined')

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1

  const rows = searchParams.get('rows') ? Number(searchParams.get('rows')) : 10

  const { data: tagsResponse, isLoading } = useQuery<TagResponse>({
    queryKey: ['get-tags', urlFilter, page, rows, sort],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3333/tags?_page=${page}&_per_page=${rows}&title=${urlFilter}&_sort=${sort}`)
      const data = await response.json()

      // delay 2s
      // await new Promise(resolve => setTimeout(resolve, 2000))

      return data
    },
    placeholderData: keepPreviousData,
  })

  function handleFilter(value: string) {
    setFilter(value)
    setSearchParams(params => {
      params.set('page', '1')
      params.set('filter', value)

      return params
    })
  }


  function handleSortState(value: SortState, type: string): SortState {
    switch (value) {
      case 'undefined':
        setSort(type === "tag" ? "title" : "amountOfVideos")
        return 'asc'
      case 'asc':
        setSort(type === "tag" ? "-title" : "-amountOfVideos")
        return 'desc'
      case 'desc':
        setSort("")
        return 'undefined'
      default:
        return value
    }
  }

  function handleSortTag() {
    setSortTag(prevSortTag => handleSortState(prevSortTag, "tag"))
    setSortVideo('undefined')
  }

  function handleSortVideo() {
    setSortVideo(prevSortVideo => handleSortState(prevSortVideo, "video"))
    setSortTag('undefined')
  }

  function renderSortIndicator(sortState: SortState): JSX.Element {
    switch (sortState) {
      case 'asc':
        return <ChevronUp />
      case 'desc':
        return <ChevronDown />
      case 'undefined':
        return <ChevronsUpDown />
      default:
        return <ChevronsUpDown />
    }
  }

  if (isLoading) {
    return null
  }

  return (
    <div className="py-10 space-y-8">
      <div>
        <Header />
        <Tabs />
      </div>
      <main className="max-w-6xl mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">Tags</h1>
          <Button variant='primary'>
            <Plus className="size-3" />
            Create new
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Input variant='filter'>
              <Search className="size-3" />
              <Control
                placeholder="Search tags..."
                onChange={e => handleFilter(e.target.value)}
                value={filter}
              />
            </Input>
          </div>

          <Button>
            <FileDown className="size-3" />
            Export
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow >
              <TableHead></TableHead>
              <TableHead onClick={handleSortTag}>
                <div className='flex items-center gap-2'>
                  <span className='text-left py-3 px-4 font-medium text-zinc-300'>Tag</span>
                  {renderSortIndicator(sortTag)}
                </div>
              </TableHead>
              <TableHead onClick={handleSortVideo}>
                <div className='flex items-center gap-2'>
                  <span className='text-left py-3 px-4 font-medium text-zinc-300'>Amount of videos</span>
                  {renderSortIndicator(sortVideo)}
                </div>
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tagsResponse?.data.map((tag) => {
              return (
                <TableRow key={tag.id}>
                  <TableCell></TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{tag.title}</span>
                      <span className="text-xs text-zinc-500">{tag.id}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    {tag.amountOfVideos} video(s)
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {tagsResponse && <Pagination pages={tagsResponse.pages} items={tagsResponse.items} page={page} rows={rows} />}
      </main>
    </div>
  )
}