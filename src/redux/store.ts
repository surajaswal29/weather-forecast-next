import { configureStore } from "@reduxjs/toolkit"
import citiesSlice from "./reducers/geonameSlice"
import weatherSlice from "./reducers/weatherSlice"

export const makeStore = () => {
  return configureStore({
    reducer: {
      cities: citiesSlice,
      weather: weatherSlice,
    },
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
