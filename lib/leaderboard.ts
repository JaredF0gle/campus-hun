import { supabase } from './supabase'

export async function getLeaderboard(sessionId: string) {
  const { data, error } = await supabase
    .from('captures')
    .select(`
      user_id,
      items!inner(point_value, session_id)
    `)
    .eq('items.session_id', sessionId)

  if (error) throw error

  const totals: Record<string, number> = {}
  data?.forEach((capture: any) => {
    const uid = capture.user_id
    totals[uid] = (totals[uid] || 0) + capture.items.point_value
  })

  return Object.entries(totals)
    .map(([user_id, points]) => ({ user_id, points }))
    .sort((a, b) => b.points - a.points)
}