"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { GameDetailsModal } from "../app/(protected)/game-selection/components/GameDetailsModal";
import { toggleGameSelection } from "../app/(protected)/game-selection/actions";

interface Game {
  id: number;
  name: string;
  cover?: { url: string };
  summary?: string;
  rating?: number;
  popularity?: number;
}

interface GameGridProps {
  initialGames: Game[];
}

export function GameGrid({ initialGames }: GameGridProps) {
  const [games, setGames] = useState<Game[]>(initialGames);
  const [selectedGames, setSelectedGames] = useState<number[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"popularity" | "rating">("popularity");
  const [isPending, startTransition] = useTransition();

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const response = await fetch(
        `/api/search-games?q=${encodeURIComponent(query)}`
      );
      const searchResults = await response.json();
      setGames(sortGames(searchResults, sortBy));
    } else if (query.length === 0) {
      setGames(sortGames(initialGames, sortBy));
    }
  };

  const handleSort = (value: "popularity" | "rating") => {
    setSortBy(value);
    setGames(sortGames(games, value));
  };

  const sortGames = (
    gamesToSort: Game[],
    sortByField: "popularity" | "rating"
  ) => {
    return [...gamesToSort].sort((a, b) => {
      if (sortByField === "popularity") {
        return (b.popularity || 0) - (a.popularity || 0);
      } else {
        return (b.rating || 0) - (a.rating || 0);
      }
    });
  };

  const handleGameSelection = async (game: Game) => {
    const isSelected = selectedGames.includes(game.id);
    startTransition(async () => {
      const result = await toggleGameSelection(game.id, !isSelected);
      if (result.success) {
        setSelectedGames((prev) =>
          isSelected ? prev.filter((id) => id !== game.id) : [...prev, game.id]
        );
      }
    });
  };

  const openGameDetails = (game: Game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
  };

  const getAbsoluteImageUrl = (url?: string) => {
    if (!url) return "/placeholder-game-cover.jpg";
    if (url.startsWith("//")) {
      return `https:${url}`;
    }
    return url;
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          placeholder="Search games..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-64"
        />
        <Select onValueChange={handleSort} defaultValue="popularity">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popularity">Popularity</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {games.map((game) => (
          <Card
            key={game.id}
            className="cursor-pointer transition-all hover:shadow-lg"
            onClick={() => openGameDetails(game)}
          >
            <CardContent className="p-4">
              <div className="relative w-full h-48 mb-2">
                <Image
                  src={getAbsoluteImageUrl(
                    game.cover?.url?.replace("t_thumb", "t_cover_big")
                  )}
                  alt={game.name}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-md"
                />
              </div>
              <h3 className="font-semibold text-sm">{game.name}</h3>
              <button
                className={`mt-2 px-2 py-1 text-xs rounded ${
                  selectedGames.includes(game.id)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleGameSelection(game);
                }}
                disabled={isPending}
              >
                {selectedGames.includes(game.id) ? "Selected" : "Select"}
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
      <GameDetailsModal
        game={selectedGame}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
