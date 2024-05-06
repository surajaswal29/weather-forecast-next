"use client"

import DataTable from "@/components/DataTable"
import { useAppDispatch, useAppSelector } from "@/hooks/useTypedRedux"
import {
  setFavCityData,
  setTheme,
  setTimeZone,
} from "@/redux/reducers/geonameSlice"
import { useEffect } from "react"

const Home = () => {
  const dispatch = useAppDispatch()
  const { theme } = useAppSelector((state) => state.cities)

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme")
    const favCityData = JSON.parse(localStorage.getItem("favCity") || "[]")
    const timezone = localStorage.getItem("timezone")
    if (currentTheme) {
      dispatch(setTheme(currentTheme))
    }

    if (favCityData?.length > 0) {
      dispatch(setFavCityData(favCityData))
    }

    if (timezone) {
      dispatch(setTimeZone(timezone))
    }
  }, []) //
  return (
    <div
      className={`w-full min-h-screen ${
        theme === "light"
          ? "bg-slate-100 text-black"
          : "bg-slate-900 text-white"
      }`}
    >
      <div className='w-full px-4 md:px-8 lg:px-24 xl:px-36 py-10'>
        <div className='w-full mt-6'>
          <DataTable type={"all"} />
        </div>
      </div>
    </div>
  )
}

export default Home
