// import { CityData } from "@/utils/types"
import { createAsyncThunk } from "@reduxjs/toolkit"

type argProps = {
  page: number
  limit: number
  timezone: string
  searchTerm?: string
  order?: string
}

export const fetchGeonameData = createAsyncThunk(
  "fetchGeonameData",
  async (arg: argProps) => {
    console.log(arg)
    // console.log("fetching data")
    // console.log(process.env.NEXT_PUBLIC_GEONAME_API_URL)
    if (process.env.NEXT_PUBLIC_GEONAME_API_URL) {
      let apiURI

      if (arg.searchTerm && arg.searchTerm!.length > 0) {
        apiURI = `${process.env.NEXT_PUBLIC_GEONAME_API_URL}?where=ascii_name%20like%20%22${arg.searchTerm}%22`
      } else {
        apiURI = `${process.env.NEXT_PUBLIC_GEONAME_API_URL}?limit=${arg.limit}&offset=${arg.page}&refine=timezone:${arg.timezone}`
      }

      if (arg.order) {
        console.log(arg.order)
        apiURI = apiURI.replace("?", `?&order_by=${arg.order}&`)
      }

      console.log(apiURI)

      const response = await fetch(apiURI)
      const apiResult = await response.json()

      return {
        data: apiResult.results,
        totalItems: apiResult.total_count,
        timezone: arg.timezone,
        pageLimit: arg.limit,
        currentPage: arg.page,
        searchTerm: arg.searchTerm,
        order: arg.order,
        orderField: arg.order
          ? arg.order.split("%20")[0] === "ascii_name"
            ? "City Name"
            : "Population"
          : "",
      }
    } else {
      return []
    }
  }
)
