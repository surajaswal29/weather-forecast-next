"use client"

import React from "react"
import { Loader } from "@googlemaps/js-api-loader"

type Props = {
  coords: {
    lat: number
    lng: number
  }
}

export default function Map({ coords }: Props) {
  const mapRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {

    if (mapRef.current) {
    
      const intitializeMap = async () => {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_MAP_API_KEY!,
          version: "weekly",
        })

        const { Map } = await loader.importLibrary("maps")

        const locationCords = {
          lat: coords.lat,
          lng: coords.lng,
        }

        const { AdvancedMarkerElement } = (await loader.importLibrary(
          "marker"
        )) as google.maps.MarkerLibrary

        const mapOptions: google.maps.MapOptions = {
          center: locationCords,
          zoom: 12,
          mapTypeId: "terrain",
          mapId: "weather-map",
        }

        const map = new Map(mapRef.current as HTMLDivElement, mapOptions)

        const marker = new AdvancedMarkerElement({
          position: locationCords,
          map: map,
        })
      }

      intitializeMap()
    }
  }, [coords])
  return <div ref={mapRef} className='w-full h-[350px] rounded-lg'></div>
}
