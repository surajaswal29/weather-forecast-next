"use client"

import DataTable from "@/components/DataTable"
import { useAppDispatch, useAppSelector } from "@/hooks/useTypedRedux"
import { setFavCityData, setTheme } from "@/redux/reducers/geonameSlice"
import { Heart } from "lucide-react"
import { useEffect } from "react"
const Home = () => {
  const dispatch = useAppDispatch()
  const { theme } = useAppSelector((state) => state.cities)

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme")
    const favCityData = JSON.parse(localStorage.getItem("favCity") || "[]")
    if (currentTheme) {
      dispatch(setTheme(currentTheme))
    }

    if (favCityData?.length > 0) {
      dispatch(setFavCityData(favCityData))
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
        <div
          className={`w-full my-6 border border-slate-400 ${
            theme === "light" ? "bg-slate-200" : "bg-slate-700"
          } rounded-lg p-3`}
        >
          <h1 className='text-xl flex items-center gap-3'>
            <Heart />
            My Favorites cities
          </h1>
        </div>
        <div className='w-full mt-6'>
          <DataTable type='fav' />
        </div>
      </div>
    </div>
  )
}

export default Home
