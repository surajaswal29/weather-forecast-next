export interface LayoutProps {
    children: React.ReactNode;
}

export interface GeonameType {
    loading: boolean;
    citiesData: any[];
    totalMergeCount: number;
    mergeCitiesData: any[];
    error: null | string;
    currentPage: number;
    totalItems: number;
    timeZone: string;
    pageLimit: number;
    searchTerm: string;
}

export interface GeonamePayload {
    data: any[];
    totalItems: number;
    timezone: string;
    pageLimit: number;
    currentPage: number;
    searchTerm: string;
}

// type CityData =  {
//     id: string;
//     cityName: string;
//     countryCode: string;
//     countryName: string;
//     population: number;
//     timezone: string;
//     coordinates: {
//         lon: number;
//         lat: number;
//     };
// }

export type WeatherActionType = {
    lat: number;
    lng: number;
}

export interface WeatherSliceType {
    loading:boolean
    currentWeather: null | any
    foreCastWeather: any[]
    foreCastError:null | string
    error:null | string
}