import { useQuery } from '@tanstack/react-query'

interface WeatherData {
  temp: number
  description: string
  icon: string
  city: string
}

const geocodeCity = async (city: string) => {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
  )
  const data = await res.json()
  if (!data.results?.length) return null
  return {
    lat: data.results[0].latitude,
    lng: data.results[0].longitude,
    name: data.results[0].name,
  }
}

const fetchWeather = async (city: string): Promise<WeatherData | null> => {
  try {
    const coords = await geocodeCity(city)
    if (!coords) return null

    const res = await fetch(
      `https://open-weather13.p.rapidapi.com/fivedaysforcast?latitude=${coords.lat}&longitude=${coords.lng}&lang=EN`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'open-weather13.p.rapidapi.com',
          'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
        },
      }
    )
    if (!res.ok) return null
    const data = await res.json()
    const current = data?.list?.[0]
    if (!current) return null

    return {
      temp: Math.round((current.main.temp - 32) * 5 / 9),
      description: current.weather?.[0]?.description ?? '',
      icon: current.weather?.[0]?.icon ?? '',
      city: data.city?.name ?? coords.name,
    }
  } catch {
    return null
  }
}

export const useWeather = (city: string | null | undefined) => {
  return useQuery({
    queryKey: ['weather', city],
    queryFn: () => fetchWeather(city!),
    enabled: !!city && !!import.meta.env.VITE_RAPIDAPI_KEY,
    staleTime: 600000,
    retry: false,
  })
}
