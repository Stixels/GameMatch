import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

interface Game {
  id: number;
  title: string;
  genre: string[];
  playstyle: string[];
  difficulty: number;
  themes: string[];
  score: number;
}
function Recommendations() {
  const [recommendations, setRecommendations] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  async function fetchRecommendations() {
    try {
      setLoading(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase.functions.invoke<Game[]>(
        "get-recommendation",
        {
          body: { user_id: user.id },
        }
      );

      if (error) throw error;
      if (!data || data.length === 0)
        throw new Error("No recommendations found");

      setRecommendations(data);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }

  function renderGameDetails(game: Game) {
    return (
      <div key={game.id} className="game-recommendation">
        <h3>{game.title}</h3>
        <p>Genre: {game.genre.join(", ")}</p>
        <p>Playstyle: {game.playstyle.join(", ")}</p>
        <p>Difficulty: {game.difficulty}</p>
        <p>Themes: {game.themes.join(", ")}</p>
        <p>Match Score: {game.score}</p>
      </div>
    );
  }

  if (loading) return <div>Loading recommendations...</div>;
  if (error)
    return (
      <div>
        Error: {error}. <button onClick={fetchRecommendations}>Retry</button>
      </div>
    );

  return (
    <div className="recommendations-container">
      <h2>Recommended Games for You</h2>
      {recommendations.length > 0 ? (
        <div className="recommendations-list">
          {recommendations.map(renderGameDetails)}
        </div>
      ) : (
        <p>No recommendations available. Try updating your preferences.</p>
      )}
      <button onClick={fetchRecommendations}>Refresh Recommendations</button>
    </div>
  );
}

export default Recommendations;
