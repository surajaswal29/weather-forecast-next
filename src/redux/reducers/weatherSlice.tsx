import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import {
  fetchCurrentWeatherData,
  fetchForecastWeatherData,
} from "../actions/weatherAction"
import { WeatherSliceType } from "@/utils/types"

const initialState = {
  loading: false,
  currentWeather: null,
  foreCastWeather: [],
  maxTempCity: null,
  minTempCity: null,
  foreCastError: null,
  error: null,
} as WeatherSliceType

type PayloadType = any

const weatherSlice = createSlice({
  name: "weather",
  initialState: initialState,
  reducers: {
    setTempCity: (state, action) => {
      return {
        ...state,
        maxTempCity: action.payload.max,
        minTempCity: action.payload.min,
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchCurrentWeatherData.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(
      fetchCurrentWeatherData.fulfilled.type,
      (state, action: PayloadAction<PayloadType>) => {
        state.loading = false
        state.currentWeather = action.payload
        state.error = null
      }
    )
    builder.addCase(
      fetchCurrentWeatherData.rejected,
      (state, action: PayloadAction<PayloadType>) => {
        state.loading = false
        state.currentWeather = null
        state.error = action.payload
      }
    )
    builder.addCase(fetchForecastWeatherData.pending, (state) => {
      state.loading = true
      state.foreCastError = null
    })
    builder.addCase(
      fetchForecastWeatherData.fulfilled.type,
      (state, action: PayloadAction<PayloadType>) => {
        state.loading = false
        state.foreCastWeather = action.payload
        state.foreCastError = null
      }
    )
    builder.addCase(
      fetchForecastWeatherData.rejected,
      (state, action: PayloadAction<PayloadType>) => {
        state.loading = false
        state.foreCastWeather = []
        state.foreCastError = action.payload
      }
    )
  },
})

export const { setTempCity } = weatherSlice.actions
export default weatherSlice.reducer
