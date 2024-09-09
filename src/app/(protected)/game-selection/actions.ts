// src/app/game-selection/actions.ts
"use server";

import { revalidatePath } from "next/cache";

export async function toggleGameSelection(gameId: number, selected: boolean) {
  // In a real application, you would update this in your database
  console.log(`Game ${gameId} ${selected ? "selected" : "deselected"}`);

  // Revalidate the game selection page to reflect the changes
  revalidatePath("/game-selection");

  return { success: true };
}
