import { useState } from 'react'
import { ActivityIndicator, Button, ScrollView, Text, TextInput, View } from 'react-native'
import { generateHuntItems } from '../../lib/generateItems'

export default function HomeScreen() {
  const [campus, setCampus] = useState('')
  const [city, setCity] = useState('')
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  async function handleGenerate() {
    setLoading(true)
    try {
      const generated = await generateHuntItems(campus, city)
      setItems(generated)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>
        Campus Hunt
      </Text>
      <TextInput
        placeholder="Campus name"
        value={campus}
        onChangeText={setCampus}
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 }}
      />
      <TextInput
        placeholder="City"
        value={city}
        onChangeText={setCity}
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 }}
      />
      <Button title="Generate Hunt Items" onPress={handleGenerate} />

      {loading && <ActivityIndicator style={{ marginTop: 24 }} size="large" />}

      {items.map((item, index) => (
        <View key={index} style={{ marginTop: 16, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
          <Text style={{ fontWeight: 'bold' }}>{item.name} — {item.point_value}pts</Text>
          <Text style={{ color: '#666', marginTop: 4 }}>{item.category} {item.is_rare ? '⭐ RARE' : ''}</Text>
          <Text style={{ marginTop: 4 }}>{item.description}</Text>
        </View>
      ))}
    </ScrollView>
  )
}