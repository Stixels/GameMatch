import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
        global: {
          headers: {
            'X-Client-Info': 'nextjs',
          },
          fetch: (url, options) => {
            return fetch(url, {
              ...options,
              credentials: 'include',
            })
          },
        },
      }
    )
    const { user_email, selected_games, questionnaire_answers } = await req.json()

    if (!user_email) {
      throw new Error('user_email is required')
    }

    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_email,
        selected_games,
        questionnaire_answers,
      }, { onConflict: 'user_email' })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 400 })
  }
}