import React, { useEffect, useRef, useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table"

import { Clock, Edit, ExternalLink, X } from "lucide-react"
import Modal from "./Modal"
import { useAppDispatch, useAppSelector } from "@/hooks/useTypedRedux"
import { fetchGeonameData } from "@/redux/actions/geonameAction"
import Link from "next/link"
import { setCitiesData } from "@/redux/reducers/geonameSlice"

const TIMEZONES = [
  "Europe/Paris",
  "Asia/Kolkata",
  "America/New_York",
  "America/Los_Angeles",
  "Australia/Sydney",
  "Asia/Tokyo",
  "Europe/London",
  "America/Chicago",
  "Asia/Shanghai",
  "America/Toronto",
  "Europe/Berlin",
  "America/Mexico_City",
  "America/Sao_Paulo",
  "Africa/Johannesburg",
  "Asia/Dubai",
  "Pacific/Auckland",
] as const


const DataTable = () => {
  // const [cityData, setCityData] = React.useState<any[]>([])
  const dispatch = useAppDispatch()
  const {
    loading,
    citiesData,
    mergeCitiesData,
    error,
    currentPage,
    totalItems,
    timeZone,
    pageLimit,
  } = useAppSelector((state) => state.cities)

  const columns = [
    {
      accessorKey: "ascii_name",
      header: "City Name",
      size: 200,
      cell: (props: any) => {
        console.log(props.row);
        const { coordinates } = props.row.original
        const latitude = coordinates ? coordinates.lat : null
        const longitude = coordinates ? coordinates.lon : null

        console.log(coordinates)
        return (
          <Link
            href={`/weather/${props.getValue()}?lat=${latitude}&lng=${longitude}`}
            className='flex items-center gap-1 hover:text-blue-500 hover:underline'
            target='_blank'
            rel='noreferrer'
          >
            {props.getValue()}
            <ExternalLink size={16} />
          </Link>
        )
      },
    },
    {
      accessorKey: "cou_name_en",
      header: "Country",
      size: 200,
    },
    {
      accessorKey: "timezone",
      header: "Timezone",
      cell: (props: any) => {
        return (
          <div
            className={`p-2 px-3 gap-1 flex items-center inset-2 capitalize text-xs w-fit font-medium rounded-full bg-gradient-to-tr from-purple-500 to-blue-400 text-white`}
          >
            <Clock size={16} />
            {props.getValue()}
          </div>
        )
      },
      size: 200,
    },
    {
      accessorKey: "population",
      header: "Population",
      size: 200,
    },
  ]

  // filter data
  const [searchData, setSearchData] = useState<string>("")
  // handle search data
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    setSearchData(value)

    if (value.length > 2) {
      dispatch(
        fetchGeonameData({
          page: 1,
          limit: 20,
          timezone: timeZone,
          searchTerm: value,
        })
      )
    }

    value.length === 0 &&
      dispatch(
        fetchGeonameData({
          page: 1,
          limit: 20,
          timezone: timeZone,
          searchTerm: "",
        })
      )
  }

  // filter timezone
  const [filterTimeZone, setFilterTimeZone] = useState<string>("")
  const handleFilterTimeZone = (e: React.ChangeEvent<HTMLSelectElement>) => { 
    const { value } = e.target

    setFilterTimeZone(value)
    dispatch(setCitiesData([]))

    dispatch(
      fetchGeonameData({
        page: 1,
        limit: 20,
        timezone: value,
        searchTerm: searchData,
      })
    )

    console.log("only i am calling");
  }

  const table = useReactTable({
    data: mergeCitiesData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
        const nextArg = {
          page: currentPage + 1,
          limit: pageLimit,
          timezone: timeZone,
        }
        dispatch(fetchGeonameData(nextArg))
        // dispatch(setCitiesData([...mergeCitiesData, ...citiesData]))

        console.log("I've been called");  

        // setCityData((prev) => [...prev, ...citiesData])
      }
    }
    // Add event listener for scroll
    window.addEventListener("scroll", handleScroll)

    // Cleanup: remove event listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [citiesData, currentPage, dispatch])

  useEffect(() => {
    const initArg = {
      page: 1,
      limit: 20,
      timezone: "Asia/Kolkata",
      searchTerm: "",
    }
    dispatch(fetchGeonameData(initArg))
  }, [])

  useEffect(() => {
    console.log(mergeCitiesData)
    // dispatch(setCitiesData([...mergeCitiesData, ...citiesData]))
  }, [mergeCitiesData])

  return (
    <>
      <div className='w-full mt-6 flex items-center gap-3'>
        <div className='flex flex-col gap-2 '>
          <label htmlFor='search'>Search by city name</label>
          <input
            type='text'
            name='search'
            id='search'
            className='border border-blue-300 p-2 h-10 rounded-md w-[300px]'
            value={searchData}
            onChange={handleSearch}
            placeholder="Type full city name.."
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label htmlFor='search'>Filter by TimeZones</label>
          <select
            name='timezone'
            id='timezone'
            className='border border-blue-300 p-2 h-10 rounded-md w-[300px] cursor-pointer bg-white'
            value={filterTimeZone}
            onChange={handleFilterTimeZone}
          >
            <option value=''>All TimeZones</option>
            {TIMEZONES.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className='rounded-md border-x border-slate-300 overflow-hidden mt-6'>
        <table className='w-full border-0 border-collapse bg-white'>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className='border border-slate-500 bg-slate-700 text-white'
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={`whitespace-nowrap text-left p-3 font-medium`}
                    style={{
                      width: header.getSize(),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className='border-b border-slate-300 cursor-pointer hover:bg-slate-200 ease-in-out duration-200'
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`p-3 truncate`}
                    style={{
                      maxWidth: cell.column.getSize(),
                    }}
                    onClick={() => console.log(cell.column)}
                  >
                    {cell.column.id === "description"
                      ? flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      : flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='w-full'>
        {loading && (
          <div className='grid grid-cols-4 gap-2 bg-white p-2 rounded-md'>
            <div className='bg-gray-200 animate-pulse p-6'></div>
            <div className='bg-gray-200 animate-pulse p-6'></div>
            <div className='bg-gray-200 animate-pulse p-6'></div>
            <div className='bg-gray-200 animate-pulse p-6'></div>
          </div>
        )}
      </div>

      {citiesData.length === 0 && error && (
        <div className='w-full rounded-xl border border-dashed border-slate-300 p-4'>
          <h1>No Data Available</h1>
        </div>
      )}
    </>
  )
}

export default DataTable
