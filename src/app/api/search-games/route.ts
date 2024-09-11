// src/app/api/search-games/route.ts
import { NextResponse } from "next/server";
import { makeIGDBRequest } from "../../../lib/igdb";
import { Game } from "../../../app/(protected)/game-selection/page";

interface PopularityPrimitive {
  game_id: number;
  value: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    // First, search for games
    const games = (await makeIGDBRequest(
      "games",
      `
      search "${query}";
      fields name, cover.url, summary, rating;
      limit 20;
    `
    )) as Game[];

    console.log("Search results:", games);

    if (games.length === 0) {
      return NextResponse.json({ games: [] });
    }

    // Extract game IDs
    const gameIds = games.map((game) => game.id);

    // Fetch popularity data for these games
    const popularityPrimitives = (await makeIGDBRequest(
      "popularity_primitives",
      `
      fields game_id, value;
      where game_id = (${gameIds.join(",")}) & popularity_type = 1;
    `
    )) as PopularityPrimitive[];

    console.log("Popularity primitives:", popularityPrimitives);

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
    gamesWithPopularity.sort(
      (a, b) => (b.popularity || 0) - (a.popularity || 0)
    );

    return NextResponse.json({ games: gamesWithPopularity });
  } catch (error) {
    console.error("Error searching games:", error);
    return NextResponse.json(
      { error: "Failed to search games" },
      { status: 500 }
    );
  }
}
