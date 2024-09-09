import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { supabase } from "../../../lib/supabase";
import { Session } from "next-auth";

export async function POST(req: Request) {
  const session = (await getServerSession()) as Session & {
    user: { id: string };
  };

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { selectedGames } = await req.json();
    const userId = session.user.id;

    // Here, you would typically update the user's game preferences in your database
    // This is a placeholder implementation
    const { error } = await supabase
      .from("user_game_preferences")
      .upsert({ user_id: userId, selected_games: selectedGames });

    if (error) throw error;

    return NextResponse.json({
      message: "Game preferences updated successfully",
    });
  } catch (error) {
    console.error("Error updating game preferences:", error);
    return NextResponse.json(
      { error: "An error occurred while updating game preferences." },
      { status: 500 }
    );
  }
}
