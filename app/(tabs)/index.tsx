import { useState } from 'react'
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { createSession } from '../../lib/createSession'
import { generateHuntItems } from '../../lib/generateItems'

const CATEGORIES = ['all', 'campus', 'business', 'monument', 'plant']

const CATEGORY_COLORS: Record<string, string> = {
  campus: '#4A90E2',
  business: '#E67E22',
  monument: '#8E44AD',
  plant: '#27AE60',
}

export default function HomeScreen() {
  const [campus, setCampus] = useState('')
  const [city, setCity] = useState('')
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')
  const [gameStarted, setGameStarted] = useState(false)

async function handleGenerate() {
  setLoading(true)
  try {
    const generated = await generateHuntItems(campus, city)
    await createSession(campus, city, generated)
    setItems(generated)
    setGameStarted(true)
  } catch (e) {
    console.error(e)
  }
  setLoading(false)
}

  const filtered = filter === 'all' ? items : items.filter(i => i.category === filter)

  if (!gameStarted) {
    return (
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 8 }}>🎯 Campus Hunt</Text>
        <Text style={{ fontSize: 16, color: '#666', marginBottom: 32 }}>AI-powered scavenger hunt</Text>

        <TextInput
          placeholder="Campus name (e.g. VCU)"
          value={campus}
          onChangeText={setCampus}
          style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 14, marginBottom: 12, fontSize: 16 }}
        />
        <TextInput
          placeholder="City (e.g. Richmond)"
          value={city}
          onChangeText={setCity}
          style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 14, marginBottom: 24, fontSize: 16 }}
        />

        {loading
          ? <ActivityIndicator size="large" color="#4A90E2" />
          : <TouchableOpacity
              onPress={handleGenerate}
              style={{ backgroundColor: '#4A90E2', padding: 16, borderRadius: 12, alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Generate Hunt</Text>
            </TouchableOpacity>
        }
      </ScrollView>
    )
  }

  return (
    <View style={{ flex: 1, paddingTop: 60 }}>
      <View style={{ paddingHorizontal: 24, marginBottom: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>🎯 {campus} Hunt</Text>
        <Text style={{ color: '#666', marginTop: 4 }}>{items.length} items · {city}</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={{ paddingLeft: 24, marginBottom: 16 }} contentContainerStyle={{ gap: 8, paddingRight: 24 }}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity key={cat} onPress={() => setFilter(cat)}
            style={{
              paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
              backgroundColor: filter === cat ? '#4A90E2' : '#f0f0f0'
            }}>
            <Text style={{ color: filter === cat ? 'white' : '#333', fontWeight: '600', textTransform: 'capitalize' }}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ padding: 24, gap: 12 }}>
        {filtered.map((item, index) => (
          <View key={index} style={{
            backgroundColor: 'white', borderRadius: 16, padding: 16,
            shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', flex: 1, marginRight: 8 }}>{item.name}</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#4A90E2' }}>{item.point_value}pts</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 8 }}>
              <View style={{ backgroundColor: CATEGORY_COLORS[item.category] + '20', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
                <Text style={{ color: CATEGORY_COLORS[item.category], fontSize: 12, fontWeight: '600', textTransform: 'capitalize' }}>
                  {item.category}
                </Text>
              </View>
              {item.is_rare && (
                <View style={{ backgroundColor: '#FFD70020', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
                  <Text style={{ color: '#B8860B', fontSize: 12, fontWeight: '600' }}>⭐ RARE</Text>
                </View>
              )}
            </View>

            <Text style={{ color: '#666', marginTop: 8, lineHeight: 20 }}>{item.description}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}