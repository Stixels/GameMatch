// src/app/game-selection/page.tsx
import { Suspense } from "react";
import { GameGrid } from "./components/GameGrid";
import { makeIGDBRequest } from "@/lib/igdb";

interface PopularityPrimitive {
  id: number;
  game_id: number;
  popularity_type: number;
  value: number;
}

export interface Game {
  id: number;
  name: string;
  cover?: { url: string };
  summary?: string;
  rating?: number;
  popularity?: number;
}

async function getInitialGames(): Promise<Game[]> {
  try {
    // First, fetch the top 20 games by popularity (visits)
    const popularityPrimitives = (await makeIGDBRequest(
      "popularity_primitives",
      `
      fields game_id,value;
      sort value desc;
      where popularity_type = 1;
      limit 20;
    `
    )) as PopularityPrimitive[];

    // Extract game IDs from the popularity primitives
    const gameIds = popularityPrimitives.map((p) => p.game_id);

    // Fetch detailed information for these games
    const games = (await makeIGDBRequest(
      "games",
      `
      fields name, cover.url, summary, rating;
      where id = (${gameIds.join(",")});
    `
    )) as Game[];

    // Merge popularity data with game data
    const gamesWithPopularity = games.map((game) => {
      const popularityPrimitive = popularityPrimitives.find(
        (p) => p.game_id === game.id
      );
      return {
        ...game,
        popularity: popularityPrimitive ? popularityPrimitive.value : 0,
      };
    });

    // Sort games by popularity
    return gamesWithPopularity.sort(
      (a, b) => (b.popularity || 0) - (a.popularity || 0)
    );
  } catch (error) {
    console.error("Failed to fetch initial games:", error);
    return [];
  }
}

export default async function GameSelectionPage() {
  const initialGames = await getInitialGames();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Select Your Favorite Games</h1>
      <Suspense fallback={<div>Loading games...</div>}>
        <GameGrid initialGames={initialGames} />
      </Suspense>
    </div>
  );
}
