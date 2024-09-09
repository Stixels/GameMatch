"use client";

import React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";

interface GameDetailsProps {
  game: {
    id: number;
    name: string;
    cover?: { url: string };
    summary?: string;
    rating?: number;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GameDetailsModal({ game, isOpen, onClose }: GameDetailsProps) {
  if (!game) return null;

  const getAbsoluteImageUrl = (url?: string) => {
    if (!url) return "/placeholder-game-cover.jpg";
    if (url.startsWith("//")) {
      return `https:${url}`;
    }
    return url;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-2">
            {game.name}
          </DialogTitle>
        </DialogHeader>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="relative w-full h-64">
            <Image
              src={getAbsoluteImageUrl(
                game.cover?.url?.replace("t_thumb", "t_cover_big")
              )}
              alt={game.name}
              fill
              sizes="(max-width: 425px) 100vw, 425px"
              style={{ objectFit: "cover" }}
              className="rounded-md"
            />
          </div>
          <div className="h-48 overflow-y-auto">
            <DialogDescription className="text-sm leading-relaxed">
              {game.summary}
            </DialogDescription>
          </div>
          {game.rating && (
            <div className="flex items-center space-x-2">
              <span className="font-semibold">Rating:</span>
              <div className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm">
                {Math.round(game.rating)}/100
              </div>
            </div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
