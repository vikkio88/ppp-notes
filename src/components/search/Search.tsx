import Fuse from "fuse.js";
import { useEffect, useMemo, useRef, useState } from "react";
import ResultCard from "./ResultCard";

export interface SearchableLink {
  episodeTitle: string;
  episodeAudioUrl: string;
  url: string;
  description: string;
}

interface Props {
  links: SearchableLink[];
}

interface SearchResult {
  item: SearchableLink;
  refIndex: number;
}

export function Search({ links }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(
    null
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchValue = inputRef.current?.value ?? "";
    if (searchValue && searchValue.length > 3) {
      setSearchResults(fuse.search(searchValue) ?? []);
    }
  };
  const reset = () => {
    if (inputRef.current) inputRef.current.value = "";
    setSearchResults(null);
  };

  const fuse = useMemo(
    () =>
      new Fuse(links, {
        keys: ["episodeTitle", "description"],
        includeMatches: true,
        minMatchCharLength: 2,
        threshold: 0,
        ignoreLocation: true,
      }),
    [links]
  );

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          name="search"
          type="search"
          className="search"
          autoComplete="off"
          placeholder="🍕 Cerca tra gli scontrini degli episodi..."
          ref={inputRef}
        />
      </form>
      {Boolean(searchResults) && <button onClick={reset}>Reset</button>}
      {Array.isArray(searchResults) && searchResults.length > 0 && (
        <>
          <div className="results">
            {searchResults.map(({ item, refIndex }) => (
              <ResultCard key={refIndex} link={item} />
            ))}
          </div>
        </>
      )}
      {Array.isArray(searchResults) && searchResults.length < 1 && (
        <div className="resultInfo">
          <h2>Nessun Link Trovato</h2>
          <h1>🍕</h1>
        </div>
      )}
    </>
  );
}
