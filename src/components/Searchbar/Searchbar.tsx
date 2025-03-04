import { Input } from '@/components';
import { Search } from 'lucide-react';

import React from 'react';
import { useDebouncedCallback } from 'use-debounce';

export interface SearchbarProps {
  filter: string;
  setFilter: (newValue: string) => void;
  placeholder?: string;
}

export const Searchbar = ({ filter, setFilter, placeholder }: SearchbarProps) => {
  const [input, setInput] = React.useState(filter ?? '');
  React.useEffect(() => {
    setInput(filter ?? '');
  }, [filter]);

  const debounced = useDebouncedCallback((value: string) => {
    setFilter(value);
  }, 250);

  return (
    <div className="relative flex-1 md:grow-0 mr-3">
      <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder || 'Search'}
        className="w-full h-10 rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          debounced(e.target.value);
        }}
      />
    </div>
  );
};
