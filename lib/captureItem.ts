import { supabase } from './supabase'

export async function captureItem(itemId: string, userId: string, photoUrl: string) {
  const { data: existing } = await supabase
    .from('captures')
    .select('id')
    .eq('item_id', itemId)
    .single()

  if (existing) {
    return { success: false, reason: 'Already captured by another player!' }
  }

  const { error } = await supabase
    .from('captures')
    .insert({ item_id: itemId, user_id: userId, photo_url: photoUrl, ai_verified: true })

  if (error) return { success: false, reason: error.message }
  return { success: true }
}