"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { supabase } from "../../../utils/supabaseClient";
import Image from "next/image";

interface Game {
  id: number;
  title: string;
  genre: string[];
  themes: string[];
  rating: number;
  cover: string;
  score: number;
}

export default function ResultsPage() {
  const [recommendations, setRecommendations] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();

  const fetchRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!session?.user?.email) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase.functions.invoke<{ data: Game[] }>(
        "get-recommendation",
        {
          body: { user_email: session.user.email },
        }
      );

      if (error) throw error;

      if (!data || data.data.length === 0) {
        throw new Error("No recommendations found");
      }

      setRecommendations(data.data);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchRecommendations();
    } else if (status === "unauthenticated") {
      setError("User not authenticated");
      setLoading(false);
    }
  }, [status, fetchRecommendations]);

  if (loading)
    return (
      <div className="container mx-auto p-4">Loading recommendations...</div>
    );
  if (error)
    return (
      <div className="container mx-auto p-4">
        Error: {error}. <button onClick={fetchRecommendations}>Retry</button>
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Game Recommendations</h1>
      {recommendations.map((game) => (
        <Card key={game.id} className="mb-4">
          <CardHeader>
            <CardTitle>{game.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex">
            {game.cover && (
              <Image
                src={game.cover.replace("t_thumb", "t_cover_big")}
                alt={game.title}
                width={200}
                height={300}
                className="mr-4"
              />
            )}
            <div>
              <p>Genre: {game.genre.join(", ")}</p>
              <p>Themes: {game.themes.join(", ")}</p>
              <p>Rating: {game.rating.toFixed(1)}</p>
              <p className="mt-2 font-semibold">Match Score: {game.score}</p>
            </div>
          </CardContent>
        </Card>
      ))}
      <button
        onClick={fetchRecommendations}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Refresh Recommendations
      </button>
    </div>
  );
}
