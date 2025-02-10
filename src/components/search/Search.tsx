import Fuse from "fuse.js";
import { useMemo, useRef, useState } from "react";
import ResultCard from "./ResultCard";
import type { SearchableLink } from "../../types";

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
    if (searchValue && searchValue.length > 2) {
      setSearchResults(fuse.search(searchValue) ?? []);
    }
  };
  const reset = () => {
    if (inputRef.current) inputRef.current.value = "";
    setSearchResults(null);
    inputRef.current?.focus();
  };

  // const check = () => {};

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
          type="text"
          className="search"
          autoComplete="off"
          placeholder="🍕 Cerca tra gli scontrini..."
          ref={inputRef}
          // onChange={check}
        />
        {/* To activate when suggestions are ready */}
        {/* {!Boolean(searchResults) && (
          <div className="row">
            <button className="small">Cerca 🔗</button>
            <button className="small" onClick={(e) => e.preventDefault()}>
              🍕 Random
            </button>
          </div>
        )} */}
      </form>

      {Boolean(searchResults) && (
        <button className="small" onClick={reset}>
          Reset
        </button>
      )}
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
          <h1 className="shake">🍕</h1>
        </div>
      )}
    </>
  );
}
