import { supabase } from './supabase'

export async function createSession(campusName: string, city: string, items: any[]) {
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .insert({
      campus_id: campusName.toLowerCase().replace(/\s/g, '-'),
      status: 'active',
      duration: 60,
    })
    .select()
    .single()

  if (sessionError) throw sessionError

  const itemRows = items.map(item => ({
    session_id: session.id,
    name: item.name,
    description: item.description,
    category: item.category,
    point_value: item.point_value,
    is_rare: item.is_rare,
  }))

  const { error: itemsError } = await supabase
    .from('items')
    .insert(itemRows)

  if (itemsError) throw itemsError

  return session
}