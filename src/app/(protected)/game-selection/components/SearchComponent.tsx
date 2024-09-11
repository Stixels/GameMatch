"use client";

import React, { useState, useCallback } from "react";
import { Input } from "../../../../components/ui/input";

interface SearchComponentProps {
  onSearch: (query: string) => void;
}

export function SearchComponent({ onSearch }: SearchComponentProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      onSearch(query);
    },
    [onSearch]
  );

  return (
    <Input
      type="text"
      placeholder="Search games..."
      value={searchQuery}
      onChange={handleSearch}
      className="w-full sm:w-64"
    />
  );
}
