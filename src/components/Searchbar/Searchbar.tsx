import { Input } from '@/components';
import { Search } from 'lucide-react';

import React from 'react';

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
      <Input
        type="search"
        placeholder="Search"
        className="w-full h-10 rounded-lg bg-background pl-8 pr-8 md:w-[200px] lg:w-[336px]"
        value={filter}
        onChange={handleFilterChange}
      />
    </div>
  );
};
