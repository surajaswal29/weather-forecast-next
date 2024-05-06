"use client"

import Map from "@/components/Map"
import { useAppDispatch, useAppSelector } from "@/hooks/useTypedRedux"
import {
  fetchCurrentWeatherData,
  fetchForecastWeatherData,
} from "@/redux/actions/weatherAction"
import { setFavCityData, setTheme } from "@/redux/reducers/geonameSlice"
import { setTempCity } from "@/redux/reducers/weatherSlice"
import {
  ArrowDown,
  ArrowLeftRight,
  Droplets,
  Fan,
  Gauge,
  LandPlot,
  MoveLeft,
  Sunrise,
  Sunset,
  Thermometer,
  Wind,
} from "lucide-react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import React, { Suspense, useEffect, useMemo, useState } from "react"

type Props = {
  params: {
    city: string
  }
}

const FORECAST_CONST = [
  "Hour",
  "weather",
  "tempreature",
  "Real Feel",
  "pressure",
  "sea level",
  "ground level",
  "humidity",
  "wind speed",
  "wind degree",
  "visibility",
] as const

const CityPage: React.FC<Props> = ({ params }) => {
  const search = useSearchParams()
  const router = useRouter()

  const coordinates = useMemo(
    () => ({
      lat: Number(search.get("lat")),
      lng: Number(search.get("lng")),
    }),
    [search]
  )

  const [currentDate, setCurrentDate] = useState<Date[]>([])
  const [activeDate, setActiveDate] = useState<any>({
    date: `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${new Date().getDate().toString().padStart(2, "0")}`,
    index: 0,
  })

  const calcNext5Days = () => {
    const days = []
    for (let i = 0; i < 5; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      days.push(date)
    }
    setCurrentDate(days)
    return days
  }

  // redux
  const dispatch = useAppDispatch()
  const { theme } = useAppSelector((state) => state.cities)
  const { loading, currentWeather, error, foreCastWeather, foreCastError } =
    useAppSelector((state) => state.weather)

  useEffect(() => {
    const initArg = {
      ...coordinates,
    }
    dispatch(fetchCurrentWeatherData(initArg))
    dispatch(fetchForecastWeatherData(initArg))
    calcNext5Days()
  }, [coordinates, dispatch])

  useEffect(() => {
    console.log(currentWeather)
    console.log(foreCastWeather)
    if (currentWeather) {
      dispatch(
        setTempCity({
          max: currentWeather.main.temp_max,
          min: currentWeather.main.temp_min,
        })
      )
      const cityData = {
        city: params.city,
        maxTemp: currentWeather.main.temp_max,
        minTemp: currentWeather.main.temp_min,
      }

      let historyData = JSON.parse(localStorage.getItem("history")!)
      if (historyData && historyData.length > 0) {
        const isExist = historyData.find(
          (item: any) => item.city === params.city
        )
        if (!isExist) {
          historyData.push(cityData)
        }
      } else {
        historyData = [cityData]
      }

      localStorage.setItem("history", JSON.stringify(historyData))
    }
  }, [currentWeather, dispatch, foreCastWeather])

  const convertTimestampToDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return date.toDateString()
  }
  const convertTimestampToTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleTimeString()
  }

  function degreesToDirection(degrees: number) {
    const directions = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ]
    const index = Math.round(degrees / 22.5) % 16
    return directions[index]
  }

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

  if (loading || !foreCastWeather) {
    return (
      <div className='w-full h-screen flex items-center justify-center text-blue-500 bg-slate-300'>
        Loading...
      </div>
    )
  }
  return (
    <Suspense
      fallback={
        <div className='w-full h-screen flex items-center justify-center text-blue-500 bg-slate-300'>
          Loading...
        </div>
      }
    >
      <div
        className={`w-full px-4 md:px-12 md:py-8 lg:px-16 lg:py-12 xl:px-24 xl:py-16 ${
          theme === "light" ? "bg-slate-100" : "bg-slate-900"
        }`}
      >
        <div className='w-full flex flex-col-reverse lg:flex-row gap-6'>
          <div
            className={`w-full ${
              theme === "light" ? "bg-white" : "bg-slate-800"
            } p-3 rounded-xl`}
          >
            <div className='w-full flex flex-col lg:flex-row gap-4'>
              {/* City Name & Temprature */}
              <div className='flex-1 flex bg-blue-500 rounded-lg p-3 text-white '>
                <div className='w-full flex flex-col justify-center items-center'>
                  <Image
                    src={`https://openweathermap.org/img/wn/${currentWeather?.weather[0].icon}@2x.png`}
                    alt='Weather Icon'
                    width={40}
                    height={40}
                  />
                  <h1 className='text-2xl font-medium whitespace-nowrap'>
                    {(currentWeather?.main.temp - 273.15).toFixed(2) || 0}°C
                  </h1>
                  <p className='text-xs'>
                    {currentWeather?.weather[0].main || ""}
                  </p>
                </div>
                <div className='w-full flex flex-col justify-center'>
                  <h1 className='text-3xl font-bold whitespace-nowrap'>
                    {decodeURIComponent(params.city) || ""}
                  </h1>

                  <p className='text-xs capitalize'>
                    {currentWeather?.weather[0].description}
                  </p>
                  <p className='text-xs'>
                    {convertTimestampToDate(currentWeather?.dt) || ""}
                  </p>
                </div>
              </div>
              {/* Sunrise and Sunset */}
              <div className='flex-1 flex bg-blue-500 rounded-lg p-3 text-white gap-2 '>
                {/* sunrise */}
                <div className='flex-1 flex items-center border rounded-md gap-2 p-3 backdrop-blur justify-center'>
                  <div className='p-3 rounded-full bg-gradient-to-t from-orange-200 to-yellow-400'>
                    <Sunrise className='w-6 h-6' />
                  </div>

                  <div className='text-sm uppercase whitespace-nowrap'>
                    <strong className='text-sm font-bold'>Sunrise</strong>
                    <br></br>
                    {convertTimestampToTime(currentWeather?.sys.sunrise)}
                  </div>
                </div>
                {/* sunset */}
                <div className='flex-1 flex items-center border rounded-md gap-2 p-3 backdrop-blur justify-center'>
                  <div className='p-3 rounded-full bg-gradient-to-b from-yellow-200 to-orange-400'>
                    <Sunset className='w-6 h-6' />
                  </div>

                  <div className='text-sm uppercase whitespace-nowrap'>
                    <strong className='text-sm font-bold'>Sunset</strong>
                    <br></br>
                    {convertTimestampToTime(currentWeather?.sys.sunset)}
                  </div>
                </div>
              </div>
            </div>
            <div className='w-full mt-6 flex items-center justify-between flex-wrap gap-4 text-slate-600'>
              <div className='w-fit flex-1 basis-[120px] border rounded-md overflow-hidden'>
                <h1 className='flex items-center gap-2 mb-2 bg-blue-500 text-white p-3 whitespace-nowrap'>
                  <Thermometer />
                  Real feel
                </h1>
                <p className='text-xl font-medium px-3 py-2'>
                  {(currentWeather?.main.feels_like - 273.15).toFixed(2)}°C
                </p>
              </div>
              <div className='w-fit flex-1 basis-[120px] border rounded-md overflow-hidden'>
                <h1 className='flex items-center gap-2 mb-2 bg-blue-500 text-white p-3 whitespace-nowrap'>
                  <Droplets />
                  Humidity
                </h1>
                <p className='text-xl font-medium px-3 py-2'>
                  {currentWeather?.main?.humidity || 0}%
                </p>
              </div>
              <div className='w-fit flex-1 basis-[120px] border rounded-md overflow-hidden'>
                <h1 className='flex items-center gap-2 mb-2 bg-blue-500 text-white p-3 whitespace-nowrap'>
                  <Gauge />
                  Pressure
                </h1>
                <p className='text-xl font-medium px-3 py-2'>
                  {currentWeather?.main?.pressure || 0} hPa
                </p>
              </div>
              <div className='w-fit flex-1 basis-[120px] border rounded-md overflow-hidden'>
                <h1 className='flex items-center gap-2 mb-2 bg-blue-500 text-white p-3 whitespace-nowrap'>
                  <ArrowDown />
                  Sea level
                </h1>
                <p className='text-xl font-medium px-3 py-2'>
                  {currentWeather?.main?.sea_level || 0} hPa
                </p>
              </div>
              <div className='w-fit flex-1 basis-[120px] border rounded-md overflow-hidden'>
                <h1 className='flex items-center gap-2 mb-2 bg-blue-500 text-white p-3 whitespace-nowrap'>
                  <LandPlot />
                  Ground level
                </h1>
                <p className='text-xl font-medium px-3 py-2'>
                  {currentWeather?.main?.grnd_level || 0} hPa
                </p>
              </div>
              <div className='w-fit flex-1 basis-[120px] border rounded-md overflow-hidden'>
                <h1 className='flex items-center gap-2 mb-2 bg-blue-500 text-white p-3 whitespace-nowrap'>
                  <Wind />
                  Wind Speed
                </h1>
                <p className='text-xl font-medium px-3 py-2'>
                  {currentWeather?.wind.speed || 0} m/sec
                </p>
              </div>
              <div className='w-fit flex-1 basis-[120px] border rounded-md overflow-hidden'>
                <h1 className='flex items-center gap-2 mb-2 bg-blue-500 text-white p-3 whitespace-nowrap'>
                  <ArrowLeftRight />
                  Wind Degree
                </h1>
                <p className='text-xl font-medium px-3 py-2'>
                  {currentWeather?.wind?.deg || 0}{" "}
                  {degreesToDirection(currentWeather?.wind?.deg)}
                </p>
              </div>
              <div className='w-fit flex-1 basis-[120px] border rounded-md overflow-hidden'>
                <h1 className='flex items-center gap-2 mb-2 bg-blue-500 text-white p-3 whitespace-nowrap'>
                  <Fan />
                  Wind Gust
                </h1>
                <p className='text-xl font-medium px-3 py-2'>
                  {currentWeather?.main?.gust || 0}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`w-full ${
              theme === "light" ? "bg-white" : "bg-slate-800"
            } p-3 rounded-xl`}
          >
            <Map coords={coordinates} />
          </div>
        </div>

        <div className='w-full my-6'>
          <div className='w-full p-3 rounded-xl'>
            <h1
              className={`text-2xl font-bold mb-4 ${
                theme === "light" ? "text-black" : "text-white"
              }`}
            >
              5 Days Weather Forecast for {decodeURIComponent(params.city)}
            </h1>
          </div>
          <div className='w-full flex items-center gap-4 overflow-auto'>
            {currentDate.map((i, index) => (
              <button
                key={index}
                className={`${
                  activeDate.index === index ? "bg-blue-500" : "bg-blue-300"
                } p-2 px-3 rounded-md text-white whitespace-nowrap`}
                onClick={() =>
                  setActiveDate({
                    index: index,
                    date: `${i.getFullYear()}-${(i.getMonth() + 1)
                      .toString()
                      .padStart(2, "0")}-${i
                      .getDate()
                      .toString()
                      .padStart(2, "0")}`,
                  })
                }
              >
                {i.toDateString()}
              </button>
            ))}
          </div>
          {activeDate.date && (
            <div
              className={`w-full rounded-xl border ${
                theme === "light"
                  ? "bg-white text-black"
                  : "bg-slate-800 text-white"
              } mt-4 overflow-auto`}
            >
              <table className='w-full border-transparent'>
                <thead>
                  <tr className='w-full border bg-slate-800 text-white'>
                    {FORECAST_CONST.map((item, index) => (
                      <th
                        key={index}
                        className='border p-3 whitespace-nowrap capitalize text-sm'
                      >
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {foreCastWeather
                    ?.filter(
                      (item) => item.dt_txt.split(" ")[0] === activeDate.date
                    )
                    .map((d, index) => (
                      <tr
                        key={index}
                        className='w-full text-sm border text-center'
                      >
                        <td className='p-3'>{d.dt_txt.split(" ")[1]}</td>
                        <td className='p-3 flex items-center'>
                          <Image
                            src={`https://openweathermap.org/img/wn/${currentWeather?.weather[0].icon}@2x.png`}
                            alt='Weather Icon'
                            width={40}
                            height={40}
                          />
                          <div className='flex flex-col items-start'>
                            <p>{d.weather[0].main}</p>
                            <p
                              className={`text-xs ${
                                theme === "light"
                                  ? "text-gray-700"
                                  : "text-gray-300"
                              }`}
                            >
                              {d.weather[0].description}
                            </p>
                          </div>
                        </td>
                        <td className='p-3'>
                          {(d.main.temp - 273.15).toFixed(2)}°C
                        </td>
                        <td className='p-3'>
                          {(d.main.feels_like - 273.15).toFixed(2)}°C
                        </td>
                        <td className='p-3'>{d.main.pressure} hPa</td>
                        <td className='p-3'>{d.main.sea_level} hPa</td>
                        <td className='p-3'>{d.main.grnd_level} hPa</td>
                        <td className='p-3'>{d.main.humidity} %</td>
                        <td className='p-3'>{d.wind.speed} m/sec</td>
                        <td className='p-3'>
                          {d.wind.deg}{" "}
                          {degreesToDirection(currentWeather?.wind?.deg)}
                        </td>
                        <td className='p-3'>{d.visibility} m</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Suspense>
  )
}

export default CityPage
