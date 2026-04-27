import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

const MOCK_RESULTS = [
  { name: 'Player 1', points: 90 },
  { name: 'Player 2', points: 60 },
  { name: 'Player 3', points: 30 },
]

export default function EndScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
      <Text style={{ fontSize: 32, fontWeight: 'bold', textAlign: 'center' }}>🏆 Hunt Over!</Text>
      <Text style={{ textAlign: 'center', color: '#666', marginTop: 8, marginBottom: 32 }}>Final Standings</Text>

      {MOCK_RESULTS.map((player, index) => (
        <View key={index} style={{
          flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
          backgroundColor: index === 0 ? '#FFD700' : 'white',
          padding: 16, borderRadius: 12, marginBottom: 12,
          shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2
        }}>
          <Text style={{ fontSize: 20 }}>{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</Text>
          <Text style={{ flex: 1, marginLeft: 12, fontWeight: 'bold', fontSize: 16 }}>{player.name}</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#4A90E2' }}>{player.points}pts</Text>
        </View>
      ))}

      <TouchableOpacity style={{
        backgroundColor: '#4A90E2', padding: 16, borderRadius: 12,
        alignItems: 'center', marginTop: 24
      }}>
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Play Again</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}