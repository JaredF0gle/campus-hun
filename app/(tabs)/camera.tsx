import { CameraView, useCameraPermissions } from 'expo-camera'
import { useLocalSearchParams } from 'expo-router'
import { useRef, useState } from 'react'
import { ActivityIndicator, Button, Text, TouchableOpacity, View } from 'react-native'
import { checkGeofence } from '../../lib/geofence'
import { verifyPhoto } from '../../lib/verifyPhoto'

export default function CameraScreen() {
  const params = useLocalSearchParams()
  const item = {
    name: (params.name as string) || 'Any Plant or Tree',
    description: (params.description as string) || 'Photograph any plant, flower, or tree you can find nearby',
    category: (params.category as string) || 'plant',
    lat: params.lat ? parseFloat(params.lat as string) : null,
    lng: params.lng ? parseFloat(params.lng as string) : null,
  }

  const [permission, requestPermission] = useCameraPermissions()
  const [capturing, setCapturing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [geofenceStatus, setGeofenceStatus] = useState<string | null>(null)
  const cameraRef = useRef<CameraView>(null)

  if (!permission) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Loading camera...</Text>
    </View>
  }

  if (!permission.granted) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 24 }}>
        Campus Hunt needs camera access to verify items
      </Text>
      <Button title="Grant Camera Permission" onPress={requestPermission} />
    </View>
  }

  async function takePicture() {
    if (!cameraRef.current) return
    setCapturing(true)
    setResult(null)
    setGeofenceStatus(null)

    try {
      if (item.category === 'business' && item.lat && item.lng) {
        const geo = await checkGeofence(item.lat, item.lng)
        if (!geo.inRange) {
          setGeofenceStatus(`You are ${geo.distance}m away. Get within 100m of ${item.name} to submit.`)
          setCapturing(false)
          return
        }
      }

      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.5 })
      if (photo?.base64) {
        const verification = await verifyPhoto(photo.base64, item.name, item.description, item.category)
        setResult(verification)
      }
    } catch (e: any) {
      console.error(e)
      setResult({ verified: false, reason: e.message || 'Something went wrong' })
    }
    setCapturing(false)
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back">
        <View style={{ flex: 1, justifyContent: 'flex-end', padding: 32 }}>

          <View style={{ backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{item.name}</Text>
            <Text style={{ color: '#ccc', marginTop: 4, fontSize: 13 }}>{item.description}</Text>
            {item.category === 'business' && (
              <View style={{ backgroundColor: '#E67E22', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginTop: 8, alignSelf: 'flex-start' }}>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>📍 Must be within 100m</Text>
              </View>
            )}
          </View>

          {geofenceStatus && (
            <View style={{ backgroundColor: '#E74C3C', borderRadius: 12, padding: 16, marginBottom: 24 }}>
              <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>📍 Too Far Away</Text>
              <Text style={{ color: 'white', textAlign: 'center', marginTop: 6 }}>{geofenceStatus}</Text>
            </View>
          )}

          {result && (
            <View style={{
              backgroundColor: result.verified ? '#27AE60' : '#E74C3C',
              borderRadius: 12, padding: 16, marginBottom: 24
            }}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>
                {result.verified ? '✅ Verified!' : '❌ Try Again'}
              </Text>
              <Text style={{ color: 'white', textAlign: 'center', marginTop: 6 }}>{result.reason}</Text>
              {result.confidence && (
                <Text style={{ color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: 4, fontSize: 12 }}>
                  Confidence: {result.confidence}%
                </Text>
              )}
            </View>
          )}

          {capturing
            ? <View style={{ alignItems: 'center' }}>
                <ActivityIndicator size="large" color="white" />
                <Text style={{ color: 'white', marginTop: 12 }}>Claude is checking your photo...</Text>
              </View>
            : <TouchableOpacity
                onPress={takePicture}
                style={{
                  backgroundColor: 'white', width: 72, height: 72,
                  borderRadius: 36, alignSelf: 'center',
                  borderWidth: 4, borderColor: '#4A90E2'
                }}
              />
          }
        </View>
      </CameraView>
    </View>
  )
}