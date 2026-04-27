const ANTHROPIC_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_KEY!

export async function generateHuntItems(campusName: string, city: string) {
  const prompt = `Generate a campus scavenger hunt item list for ${campusName} in ${city}.

Return ONLY a JSON array with exactly 12 items, no other text. Use this format:
[
  {
    "name": "item name",
    "description": "what the player needs to photograph",
    "category": "campus",
    "point_value": 10,
    "is_rare": false
  }
]

Categories must be distributed like this:
- 5 items with category "campus" (outdoor landmarks, benches, murals, signs, fountains)
- 3 items with category "business" (local restaurants or coffee shops near campus)
- 2 items with category "monument" (city statues or public art nearby)
- - 2 items with category "plant" (flowering plants, trees, or shrubs native to the region, mark these is_rare: true)

Point values: campus=10, business=20, monument=30, wildlife=50`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await response.json()
  console.log('Full API response:', JSON.stringify(data))

  if (data.error) {
    throw new Error('API error: ' + data.error.message)
  }

  const text = data.content[0].text
  console.log('Raw text:', text)

  const cleaned = text.replace(/```json|```/g, '').trim()
  const items = JSON.parse(cleaned)
  return items
}