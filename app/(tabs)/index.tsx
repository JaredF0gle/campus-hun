import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { supabase } from '../../lib/supabase'

export default function HomeScreen() {
  const [status, setStatus] = useState('Connecting to Supabase...')

  useEffect(() => {
    async function testConnection() {
      const { error } = await supabase.from('users').select('*')
      if (error) {
        setStatus('Connection failed: ' + error.message)
      } else {
        setStatus('✅ Supabase connected!')
      }
    }
    testConnection()
  }, [])

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20 }}>{status}</Text>
    </View>
  )
}