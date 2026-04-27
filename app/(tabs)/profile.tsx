import { ScrollView, Text, View } from 'react-native'

export default function ProfileScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <View style={{
          width: 80, height: 80, borderRadius: 40,
          backgroundColor: '#4A90E2', justifyContent: 'center', alignItems: 'center', marginBottom: 12
        }}>
          <Text style={{ fontSize: 32 }}>🎓</Text>
        </View>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Campus Hunter</Text>
        <Text style={{ color: '#666', marginTop: 4 }}>student@university.edu</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Points', value: '180' },
          { label: 'Games Played', value: '3' },
          { label: 'Rares Found', value: '2' },
        ].map((stat, i) => (
          <View key={i} style={{
            flex: 1, backgroundColor: '#f5f5f5', borderRadius: 12,
            padding: 16, alignItems: 'center'
          }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#4A90E2' }}>{stat.value}</Text>
            <Text style={{ fontSize: 12, color: '#666', textAlign: 'center', marginTop: 4 }}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Category Breakdown</Text>
      {[
        { category: 'Campus', points: 50, color: '#4A90E2' },
        { category: 'Business', points: 60, color: '#E67E22' },
        { category: 'Monument', points: 30, color: '#8E44AD' },
        { category: 'Plant', points: 40, color: '#27AE60' },
      ].map((cat, i) => (
        <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: cat.color }} />
            <Text style={{ fontSize: 16 }}>{cat.category}</Text>
          </View>
          <Text style={{ fontWeight: 'bold', color: cat.color }}>{cat.points}pts</Text>
        </View>
      ))}
    </ScrollView>
  )
}