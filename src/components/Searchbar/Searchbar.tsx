import { CircleX, Search } from 'lucide-react';

import React from 'react';

import { Input } from '@/components';

export interface SearchbarProps {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}

export const Searchbar = ({ filter, setFilter }: SearchbarProps) => {
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  return (
    <div className="relative flex-1 md:grow-0 mr-3">
      <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
      {filter.length > 0 && (
        <CircleX
          onClick={() => setFilter('')}
          className="h-4 w-4 right-2.5 top-3 text-muted-foreground absolute cursor-pointer"
        />
      )}
      <Input
        type="search"
        placeholder="Search by id, paymail or pubKey..."
        className="w-full h-10 rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        value={filter}
        onChange={handleFilterChange}
      />
    </div>
  );
};
