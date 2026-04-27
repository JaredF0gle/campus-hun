const ANTHROPIC_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_KEY!

export async function verifyPhoto(base64Image: string, itemName: string, itemDescription: string) {
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
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: base64Image,
              },
            },
            {
              type: 'text',
              text: `You are verifying a scavenger hunt photo submission.

Item: "${itemName}"
Description: "${itemDescription}"

Look at the photo and decide if it clearly shows the correct item.

Reject if: blurry, wrong subject, photo of a screen, or too dark to see clearly.

Respond with ONLY a JSON object like this:
{"verified": true, "confidence": 92, "reason": "Clear photo of the fountain with visible water"}

or if rejected:
{"verified": false, "confidence": 45, "reason": "Photo is too blurry to confirm the subject"}`,
            },
          ],
        },
      ],
    }),
  })

  const data = await response.json()
  const text = data.content[0].text
  const cleaned = text.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned)
}