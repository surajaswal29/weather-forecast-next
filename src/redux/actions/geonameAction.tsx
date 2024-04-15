// import { CityData } from "@/utils/types"
import { createAsyncThunk } from "@reduxjs/toolkit"

type argProps = {
  page: number
  limit: number
  timezone: string
  searchTerm?: string
}

export const fetchGeonameData = createAsyncThunk(
  "fetchGeonameData",
  async (arg: argProps) => {
    // console.log("fetching data")
    // console.log(process.env.NEXT_PUBLIC_GEONAME_API_URL)
    if (process.env.NEXT_PUBLIC_GEONAME_API_URL) {
      let apiURI = `${process.env.NEXT_PUBLIC_GEONAME_API_URL}?limit=${
        arg.limit
      }&offset=${
        arg.searchTerm && arg.searchTerm!.length > 0 ? 0 : arg.page
      }&refine=timezone:${arg.timezone}`
      

      if (arg.searchTerm && arg.searchTerm!.length > 0) {
        apiURI = apiURI.replace(
          "?",
          `?where=ascii_name%20like%20%22${arg.searchTerm}%22&`
        )
      }

      console.log(apiURI);
     
      const response = await fetch(apiURI)
      const apiResult = await response.json()

      return {
        data: apiResult.results,
        totalItems: apiResult.total_count,
        timezone: arg.timezone,
        pageLimit: arg.limit,
        currentPage: arg.page,
        searchTerm: arg.searchTerm,
      }
    } else {
      return []
    }
  }
)
