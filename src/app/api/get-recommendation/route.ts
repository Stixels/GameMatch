import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { makeIGDBRequest } from '@/utils/igdb' // You'll need to create this file

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { user_email } = await req.json()

    if (!user_email) {
      throw new Error('user_email is required')
    }

    const { data: preferences, error: prefError } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_email', user_email)
      .single()

    if (prefError) throw prefError
    if (!preferences) {
      throw new Error('No preferences found for the user')
    }

    const selectedGamesDetails = await fetchGamesFromIGDB(preferences.selected_games)
    const recommendations = await generateRecommendations(selectedGamesDetails, preferences.questionnaire_answers)

    return NextResponse.json({ data: recommendations })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

// Include the rest of your functions (fetchGamesFromIGDB, generateRecommendations, calculateMatchScore) here
// Also include your interfaces (Game, QuestionnaireAnswers)