"use client";

import React, { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { Card, CardContent } from "../../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { GameDetailsModal } from "./GameDetailsModal";
import { toggleGameSelection } from "../actions";
import { Game } from "../page";
import { motion } from "framer-motion";
import { Button } from "../../../../components/ui/button";
import { useRouter } from "next/navigation";
import { CheckCircle, GamepadIcon } from "lucide-react";
import { SearchComponent } from "./SearchComponent";
import { useSession } from "next-auth/react";
import { supabase } from "../../../../utils/supabaseClient";

interface GameGridProps {
  initialGames: Game[];
}

export function GameGrid({ initialGames = [] }: GameGridProps) {
  const [games, setGames] = useState<Game[]>(initialGames);
  const [selectedGames, setSelectedGames] = useState<number[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"popularity" | "rating">(
    "popularity"
  );
  const router = useRouter();
  const { data: session } = useSession();

  const handleSearch = useCallback(
    async (query: string) => {
      if (query.length > 2) {
        try {
          const response = await fetch(
            `/api/search-games?q=${encodeURIComponent(query)}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch games");
          }
          const data = await response.json();
          setGames(data.games);
        } catch (error) {
          console.error("Error searching games:", error);
        }
      } else if (query.length === 0) {
        setGames(initialGames);
      }
    },
    [initialGames]
  );

  const handleSort = useCallback((value: "popularity" | "rating") => {
    setSortOrder(value);
  }, []);

  const sortedGames = useMemo(() => {
    return [...games].sort((a, b) => {
      if (sortOrder === "popularity") {
        return (b.popularity || 0) - (a.popularity || 0);
      } else {
        return (b.rating || 0) - (a.rating || 0);
      }
    });
  }, [games, sortOrder]);

  const handleGameSelection = (game: Game) => {
    setSelectedGames((prev) => {
      const isSelected = prev.includes(game.id);
      if (isSelected) {
        return prev.filter((id) => id !== game.id);
      } else {
        return [...prev, game.id];
      }
    });

    toggleGameSelection(game.id, !selectedGames.includes(game.id));
  };

  const openGameDetails = (game: Game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
  };

  const getAbsoluteImageUrl = (url?: string) => {
    if (!url) return null;
    if (url.startsWith("//")) {
      return `https:${url}`;
    }
    return url;
  };

  const handleFinishSelection = async () => {
    if (selectedGames.length > 0) {
      try {
        const { error } = await supabase.functions.invoke(
          "save-user-preferences",
          {
            body: {
              user_email: session?.user?.email,
              selected_games: selectedGames,
              questionnaire_answers: null, // We'll fill this later
            },
          }
        );

        if (error) throw error;

        router.push("/questionnaire");
      } catch (error) {
        console.error("Error saving game selection:", error);
        alert("There was an error saving your selection. Please try again.");
      }
    } else {
      alert("Please select at least one game before proceeding.");
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <SearchComponent onSearch={handleSearch} />
        <Select onValueChange={handleSort} value={sortOrder}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popularity">Popularity</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {sortedGames.length === 0 ? (
        <p className="text-center text-gray-500 my-8">
          No games found. Try adjusting your search.
        </p>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {sortedGames.map((game) => (
            <motion.div
              key={game.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedGames.includes(game.id) ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => openGameDetails(game)}
              >
                <CardContent className="p-4">
                  <div className="relative w-full h-48 mb-3 bg-gray-200 flex items-center justify-center">
                    {getAbsoluteImageUrl(
                      game.cover?.url?.replace("t_thumb", "t_cover_big")
                    ) ? (
                      <Image
                        src={
                          getAbsoluteImageUrl(
                            game.cover?.url?.replace("t_thumb", "t_cover_big")
                          ) || ""
                        }
                        alt={game.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        style={{ objectFit: "cover" }}
                        className="rounded-md"
                      />
                    ) : (
                      <GamepadIcon className="w-16 h-16 text-gray-400" />
                    )}
                    {selectedGames.includes(game.id) && (
                      <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                    {game.name}
                  </h3>
                  <Button
                    className={`w-full ${
                      selectedGames.includes(game.id)
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGameSelection(game);
                    }}
                  >
                    {selectedGames.includes(game.id) ? "Deselect" : "Select"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      <div className="mt-8 flex justify-center">
        <Button
          onClick={handleFinishSelection}
          disabled={selectedGames.length === 0}
          className="px-6 py-2 text-lg"
        >
          Finish Selection ({selectedGames.length} game
          {selectedGames.length !== 1 ? "s" : ""} selected)
        </Button>
      </div>

      <GameDetailsModal
        game={selectedGame}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
