import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { fetchGeonameData } from "../actions/geonameAction"
import { GeonamePayload, GeonameType } from "@/utils/types"

const initialState = {
  loading: false,
  citiesData: [],
  totalMergeCount: 0,
  mergeCitiesData: [],
  error: null,
  currentPage: 1,
  totalItems: 0,
  timeZone: "",
  pageLimit: 20,
  searchTerm: "",
} as GeonameType

const citiesSlice = createSlice({
  name: "cities",
  initialState,
  reducers: {
    setCitiesData: (state, action) => {
      console.log(action.payload)
      state.totalMergeCount = action.payload.length
      state.mergeCitiesData = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGeonameData.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchGeonameData.fulfilled.type,
      (state, action: PayloadAction<GeonamePayload>) => {
        state.loading = false
        state.citiesData = action.payload?.data
        state.totalMergeCount = state.mergeCitiesData.length
        state.mergeCitiesData = state.searchTerm
          ? action.payload?.data
          : [...state.mergeCitiesData, ...action.payload?.data]
        state.totalItems = action.payload?.totalItems
        state.timeZone = action.payload?.timezone
        state.pageLimit = action.payload?.pageLimit
        state.currentPage = action.payload?.currentPage
        state.searchTerm = action.payload?.searchTerm
        state.error = null
      }
    )
    builder.addCase(fetchGeonameData.rejected, (state) => {
      state.loading = false
      state.citiesData = []
      state.error = "Something went wrong"
    })
  },
})

export const { setCitiesData } = citiesSlice.actions
export default citiesSlice.reducer
