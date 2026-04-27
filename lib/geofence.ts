import * as Location from 'expo-location'

export async function checkGeofence(businessLat: number, businessLng: number): Promise<{
  inRange: boolean
  distance: number
}> {
  const { status } = await Location.requestForegroundPermissionsAsync()
  if (status !== 'granted') {
    throw new Error('Location permission denied')
  }

  const location = await Location.getCurrentPositionAsync({})
  const { latitude, longitude } = location.coords

  const distance = getDistanceMeters(latitude, longitude, businessLat, businessLng)

  return {
    inRange: distance <= 100,
    distance: Math.round(distance),
  }
}

function getDistanceMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}