import { WeatherActionType } from "@/utils/types"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const fetchCurrentWeatherData = createAsyncThunk(
  "weather/fetchCurrentWeatherData",
  async (arg: WeatherActionType) => {
    console.log(process.env.NEXT_PUBLIC_MAP_API_KEY)
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WEATHER_API}/weather?appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&lat=${arg.lat}&lon=${arg.lng}`
    )
    const data = await response.json()
    return data
  }
)

export const fetchForecastWeatherData = createAsyncThunk(
  "weather/fetchForecastWeatherData",
  async (arg: WeatherActionType) => {
    console.log(process.env.NEXT_PUBLIC_MAP_API_KEY)
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WEATHER_API}/forecast?appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&lat=${arg.lat}&lon=${arg.lng}`
    )
    const data = await response.json()
    return data.list
  }
)
