import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { supabase } from "../../../lib/supabase";

export async function POST(req: Request) {
  const session = await getServerSession();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { answers } = await req.json();
    const userEmail = session.user.email;

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      );
    }

    // Here, you would typically update the user's questionnaire answers in your database
    // This is a placeholder implementation
    const { error } = await supabase
      .from("user_questionnaire_answers")
      .upsert({ user_id: userEmail, answers });

    if (error) throw error;

    return NextResponse.json({
      message: "Questionnaire answers updated successfully",
    });
  } catch (error) {
    console.error("Error updating questionnaire answers:", error);
    return NextResponse.json(
      { error: "An error occurred while updating questionnaire answers." },
      { status: 500 }
    );
  }
}
