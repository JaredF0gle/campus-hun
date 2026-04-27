const ANTHROPIC_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_KEY!

const THRESHOLDS: Record<string, number> = {
  campus: 80,
  business: 80,
  monument: 75,
  plant: 70,
}

export async function verifyPhoto(base64Image: string, itemName: string, itemDescription: string, category: string = 'campus') {
  const threshold = THRESHOLDS[category] ?? 80

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-6',
      max_tokens: 256,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: 'image/jpeg', data: base64Image },
          },
          {
            type: 'text',
            text: `You are verifying a scavenger hunt photo submission.

Item: "${itemName}"
Category: "${category}"
Description: "${itemDescription}"
Required confidence threshold: ${threshold}%

Reject if: blurry, wrong subject, photo of a screen, or too dark.
For plants: accept if any plant is clearly visible even if species is uncertain.
For monuments: must clearly show the specific statue or landmark.
For business: must show the correct business exterior or interior.
For campus: must show the correct campus location or object.

Respond with ONLY:
{"verified": true, "confidence": 85, "reason": "Clear photo showing..."}`,
          },
        ],
      }],
    }),
  })

  const data = await response.json()
  const text = data.content[0].text
  const cleaned = text.replace(/```json|```/g, '').trim()
  const result = JSON.parse(cleaned)

  if (result.confidence < threshold) {
    result.verified = false
    result.reason = `Confidence ${result.confidence}% is below the ${threshold}% required for ${category} items. ${result.reason}`
  }

  return result
}