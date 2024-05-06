import React, { useEffect, useRef, useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table"

import {
  ArrowDown,
  ArrowUp,
  Clock,
  Edit,
  ExternalLink,
  Heart,
  HeartOff,
  X,
} from "lucide-react"
// import Modal from "./Modal"
import { useAppDispatch, useAppSelector } from "@/hooks/useTypedRedux"
import { fetchGeonameData } from "@/redux/actions/geonameAction"
import Link from "next/link"
import { setCitiesData, setFavCityData } from "@/redux/reducers/geonameSlice"
import { toast } from "react-toastify"
import { useSearchParams } from "next/navigation"

const TIMEZONES = [
  "Europe/Paris",
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

const DataTable: React.FC<{ type: string }> = ({ type }) => {
  const search = useSearchParams()
  const tz =
    typeof window !== "undefined" ? localStorage.getItem("timezone") : ""
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
    theme,
    favCityData,
    order,
    orderField,
  } = useAppSelector((state) => state.cities)

  const columns = [
    {
      accessorKey: "ascii_name",
      header: "City Name",
      size: 200,
      cell: (props: any) => {
        ////console.log(props.row)
        const { coordinates } = props.row.original
        const latitude = coordinates ? coordinates.lat : null
        const longitude = coordinates ? coordinates.lon : null

        // //console.log(coordinates)
        // //console.log(props)
        return (
          <div className='w-full'>
            <Link
              href={`/weather/${props.getValue()}?lat=${latitude}&lng=${longitude}`}
              className='flex items-center gap-1 hover:text-blue-500 hover:underline'
              target='_blank'
              rel='noreferrer'
            >
              {props.getValue()}
              <ExternalLink size={16} />
            </Link>
          </div>
        )
      },
    },
    {
      accessorKey: "cou_name_en",
      header: "Country",
      size: 200,
      enableSorting: false,
    },
    {
      accessorKey: "timezone",
      header: "Timezone",
      enableSorting: false,
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
    {
      accessorKey: "action",
      header: "Action",
      size: 200,
      cell: (props: any) => {
        return (
          <div className='flex items-center gap-2'>
            {type === "all" ? (
              <button
                type='button'
                onClick={() => handleAddToFav(props)}
                className='text-red-500 hover:text-red-400 hover:underline flex items-center gap-2 text-sm'
              >
                {favCityData.some(
                  (item) => item.ascii_name === props.row.original.ascii_name
                ) ? (
                  <span className='flex items-center gap-2'>
                    <Heart size={16} fill='red' />{" "}
                    <em className='text-red-300'>Added to favorites</em>
                  </span>
                ) : (
                  <span className='flex items-center gap-2'>
                    <Heart size={16} /> Add to favorites
                  </span>
                )}
              </button>
            ) : (
              <button
                type='button'
                onClick={() => removeFromFav(props)}
                className='text-red-500 hover:text-red-400 hover:underline flex items-center gap-2 text-sm'
              >
                <HeartOff size={16} />
                Remove from favorites
              </button>
            )}
          </div>
        )
      },
    },
  ]

  const [favFilterError, setFavFilterError] = useState<null | string>(null)
  const [orderSort, setOrderSort] = useState("ASC")
  // filter data
  const [searchData, setSearchData] = useState<string>("")
  // handle search data
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    setSearchData(value)

    if (value.length > 2) {
      if (type === "all") {
        dispatch(setCitiesData([]))

        dispatch(
          fetchGeonameData({
            page: 1,
            limit: 20,
            timezone: timeZone,
            searchTerm: value,
            order: order,
          })
        )
      } else {
        const filterFav = JSON.parse(localStorage.getItem("favCity") || "[]")

        const filterFavData = filterFav.filter((item: any) =>
          item.ascii_name.toLowerCase().includes(value.toLowerCase())
        )

        if (filterFavData.length > 0) {
          dispatch(setFavCityData(filterFavData))
        } else {
          setFavFilterError("No data found")
        }
      }
    }

    if (value.length === 0)
      if (type === "all") {
        dispatch(
          fetchGeonameData({
            page: 1,
            limit: 20,
            timezone: timeZone,
            searchTerm: "",
          })
        )
      } else {
        const filterFav = JSON.parse(localStorage.getItem("favCity") || "[]")
        dispatch(setFavCityData(filterFav))
      }
  }

  // filter timezone
  const [filterTimeZone, setFilterTimeZone] = useState<string>(
    tz || timeZone || ""
  )
  const handleFilterTimeZone = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target
    setFilterTimeZone(value)
    localStorage.setItem("timezone", value)

    if (type === "all") {
      dispatch(setCitiesData([]))

      dispatch(
        fetchGeonameData({
          page: 1,
          limit: 20,
          timezone: value,
          searchTerm: searchData,
          order: order,
        })
      )
    } else {
      const filterFav = JSON.parse(localStorage.getItem("favCity") || "[]")

      if (value === "all") {
        dispatch(setFavCityData(filterFav))
      } else {
        dispatch(setFavCityData(filterFav))

        const filterFavData = filterFav.filter(
          (item: any) => item.timezone === value
        )

        if (filterFav.length > 0) {
          dispatch(setFavCityData(filterFavData))
        } else {
          setFavFilterError("No data found")
        }
      }
    }

    ////console.log("only i am calling")
  }

  const handleAddToFav = (props: any) => {
    const { ascii_name, cou_name_en, population, timezone, coordinates } =
      props.row.original
    const data = {
      ascii_name,
      cou_name_en,
      population,
      timezone,
      coordinates,
    }

    const favCityData = localStorage.getItem("favCity")
    const favCity = favCityData ? JSON.parse(favCityData) : []
    const isExist = favCity.find((item: any) => item.ascii_name === ascii_name)
    if (isExist) {
      // alert("City already added to favorites")
      toast("City already added to favorites", {
        theme: theme,
        type: "error",
      })
      return
    }
    favCity.push(data)
    localStorage.setItem("favCity", JSON.stringify(favCity))
    dispatch(setFavCityData(JSON.parse(localStorage.getItem("favCity")!)))
    toast("City added to favorites", {
      theme: theme,
      type: "success",
    })
  }

  const removeFromFav = (props: any) => {
    const { ascii_name } = props.row.original
    const favCityData = localStorage.getItem("favCity")
    const favCity = favCityData ? JSON.parse(favCityData) : []
    const newFavCity = favCity.filter(
      (item: any) => item.ascii_name !== ascii_name
    )
    localStorage.setItem("favCity", JSON.stringify(newFavCity))
    dispatch(setFavCityData(JSON.parse(localStorage.getItem("favCity")!)))
    toast("City removed from favorites", {
      theme: theme,
      type: "success",
    })
  }

  // handle sorting
  const handleOrder = () => {
    if (type === "all") {
      dispatch(setCitiesData([]))

      const nextArg = {
        page: currentPage,
        limit: pageLimit,
        timezone: timeZone,
        searchTerm: searchData,
        order: `ascii_name%20${
          order.split("%20")[1] === "ASC" ? "DESC" : "ASC"
        }`,
      }
      dispatch(fetchGeonameData(nextArg))
    } else {
      const filterFav = JSON.parse(localStorage.getItem("favCity") || "[]")
      const filterFavData = filterFav.sort((a: any, b: any) => {
        if (orderSort === "ASC") {
          // Sort in ascending order
          if (a.ascii_name < b.ascii_name) {
            return -1
          }
          if (a.ascii_name > b.ascii_name) {
            return 1
          }
          return 0
        } else {
          // Sort in descending order
          if (a.ascii_name > b.ascii_name) {
            return -1
          }
          if (a.ascii_name < b.ascii_name) {
            return 1
          }
          return 0
        }
      })

      if (filterFav.length > 0) {
        dispatch(setFavCityData(filterFavData)) // Update state with sorted data
      } else {
        setFavFilterError("No data found")
      }
    }
  }

  const table = useReactTable({
    data: type === "all" ? mergeCitiesData : favFilterError ? [] : favCityData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  useEffect(() => {
    if (type === "all") {
      const handleScroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
          const nextArg = {
            page: currentPage + 1,
            limit: pageLimit,
            timezone: timeZone,
            searchTerm: searchData,
            order: order,
          }
          dispatch(fetchGeonameData(nextArg))
          // dispatch(setCitiesData([...mergeCitiesData, ...citiesData]))

          ////console.log("I've been called")

          // setCityData((prev) => [...prev, ...citiesData])
        }
      }
      // Add event listener for scroll
      window.addEventListener("scroll", handleScroll)

      // Cleanup: remove event listener when component unmounts
      return () => {
        window.removeEventListener("scroll", handleScroll)
      }
    } else {
      return
    }
  }, [citiesData, currentPage, dispatch])

  useEffect(() => {
    localStorage.setItem("timezone", timeZone || "Asia/Kolkata")
    const initArg = {
      page: 1,
      limit: 20,
      timezone: tz || timeZone || "Asia/Kolkata",
      searchTerm: "",
      order: order,
    }
    dispatch(fetchGeonameData(initArg))
  }, [])

  const renderHistory = (d: any) => {
    const historyData = JSON.parse(localStorage.getItem("history")!)

    if (historyData && historyData.length > 0) {
      return historyData.find(
        (i: any) =>
          i.city.toLowerCase() === d.split(" ").join("%20").toLowerCase()
      )
    } else {
      return null
    }
  }

  return (
    <>
      <div className='w-full mt-6 flex flex-col md:flex-row items-center gap-3'>
        <div
          className={`flex flex-col gap-1 border-zinc-400  p-4 box-border border ${
            theme === "light" ? "bg-zinc-400/60" : "bg-zinc-700/60"
          } rounded-lg`}
        >
          <label htmlFor='search'>Search by any city name</label>
          {type === "all" && (
            <p className='text-xs text-red-400'>
              This search filter is independent of timezone
            </p>
          )}
          <input
            type='text'
            name='search'
            id='search'
            className={`border border-blue-300 p-2 rounded-md w-[300px] ${
              theme === "light" ? "bg-white" : "bg-slate-700"
            }`}
            value={searchData}
            onChange={handleSearch}
            placeholder='Type full city name..'
          />
        </div>
        <div
          className={`flex flex-col gap-1 border-zinc-400 p-4 box-border border ${
            theme === "light" ? "bg-zinc-400/60" : "bg-zinc-700/60"
          } rounded-lg`}
        >
          <label htmlFor='search'>Filter by TimeZones</label>
          {type === "all" && (
            <p className='text-xs text-red-400'>
              Default timezone is &quot;Asia/Kolkata&quot;
            </p>
          )}
          <select
            name='timezone'
            id='timezone'
            className={`border border-blue-300 p-2 rounded-md w-[300px] cursor-pointer ${
              theme === "light" ? "bg-white" : "bg-slate-700"
            }`}
            value={filterTimeZone}
            onChange={handleFilterTimeZone}
          >
            <option value='Asia/Kolkata'>Asia/Kolkata</option>
            {type === "fav" && <option value='all'>All</option>}
            {TIMEZONES.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className='w-full rounded-md border-x mt-6 border-slate-300 overflow-auto'>
        <table
          className={`w-full border-0 border-collapse ${
            theme === "light" ? "bg-white" : "bg-slate-700"
          }`}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className={`border border-slate-500 ${
                  theme === "light" ? "bg-slate-700" : "bg-slate-800"
                } text-white`}
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
                    {header.isPlaceholder ? null : (
                      <div
                        className={"select-none flex items-center gap-1"}
                        // onClick={() =>
                        //   //console.log(header.column.columnDef.header)
                        // }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.columnDef.header === "City Name" && (
                          <span
                            className='cursor-pointer hover:text-blue-500'
                            onClick={() => {
                              handleOrder()
                              setOrderSort((prev) =>
                                prev === "ASC" ? "DESC" : "ASC"
                              )
                            }}
                          >
                            {order?.split("%20")[1] === "ASC" ? (
                              <ArrowUp size={18} />
                            ) : (
                              <ArrowDown size={18} />
                            )}
                          </span>
                        )}
                      </div>
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
                className={`border-b border-slate-300 cursor-pointer ${
                  theme === "light"
                    ? "hover:bg-slate-200"
                    : "hover:bg-slate-800"
                } ease-in-out duration-200`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`p-3 truncate`}
                    style={{
                      maxWidth: cell.column.getSize(),
                    }}
                    // onClick={() => //console.log(cell.column)}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    {cell.column.id === "ascii_name" &&
                      renderHistory(cell.row.original.ascii_name) && (
                        <div className='w-full'>
                          <p className='text-xs text-gray-500'>
                            Already visited
                          </p>
                          <div className='w-full flex gap-2'>
                            <span className='text-gray-500 text-xs'>
                              Max Temp:
                              {(
                                renderHistory(cell.row.original.ascii_name)
                                  ?.maxTemp - 273.15
                              ).toFixed(2)}
                              °C
                            </span>
                            <span className='text-gray-500 text-xs'>
                              Min Temp:
                              {(
                                renderHistory(cell.row.original.ascii_name)
                                  ?.maxTemp - 273.15
                              ).toFixed(2)}
                              °C
                            </span>
                          </div>
                        </div>
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
          <div
            className={`grid grid-cols-4 gap-2 ${
              theme === "light" ? "bg-white" : "bg-slate-600"
            } p-2 rounded-md`}
          >
            <div
              className={`${
                theme === "light" ? "bg-gray-200" : "bg-slate-700"
              } animate-pulse p-6`}
            ></div>
            <div
              className={`${
                theme === "light" ? "bg-gray-200" : "bg-slate-700"
              } animate-pulse p-6`}
            ></div>
            <div
              className={`${
                theme === "light" ? "bg-gray-200" : "bg-slate-700"
              } animate-pulse p-6`}
            ></div>
            <div
              className={`${
                theme === "light" ? "bg-gray-200" : "bg-slate-700"
              } animate-pulse p-6`}
            ></div>
          </div>
        )}
      </div>

      {type === "all" && citiesData.length === 0 && error && (
        <div className='w-full rounded-xl border border-dashed border-slate-300 p-4'>
          <h1>No Data Available</h1>
        </div>
      )}
      {type === "fav" && favCityData.length === 0 && (
        <div className='w-full rounded-b-lg text-red-400 border border-dashed border-red-300 bg-white p-4'>
          <h1>No Data Available</h1>
        </div>
      )}
      {type === "fav" && favFilterError && (
        <div className='w-full rounded-b-lg text-red-400 border border-dashed border-red-300 bg-white p-4'>
          <h1>{favFilterError}</h1>
        </div>
      )}
    </>
  )
}

export default DataTable
