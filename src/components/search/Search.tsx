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
  const [inputVal, setInputVal] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(
    null
  );

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setInputVal(e.currentTarget.value);
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

  useEffect(() => {
    // Add search result only if
    // input value is more than one character
    let inputResult = inputVal.length > 1 ? fuse.search(inputVal) : [];
    setSearchResults(inputResult);
  }, [inputVal]);

  return (
    <>
      <input
        name="search"
        type="search"
        className="search"
        autoComplete="off"
        placeholder="🍕 Cerca tra gli episodi..."
        ref={inputRef}
        value={inputVal}
        onChange={handleChange}
      ></input>
      {inputVal.length > 0 && <button onClick={() => setInputVal("")}>Reset</button>}
      {searchResults != null && searchResults.length > 0 && (
        <>
          <div className="results">
            {searchResults.map(({ item, refIndex }) => (
              <ResultCard key={refIndex} link={item} />
            ))}
          </div>
        </>
      )}
      {searchResults != null && inputVal.length > 1 && searchResults.length === 0 && (
        <div className="resultInfo">
          <h2>Nessun Link Trovato</h2>
          <h1>🍕</h1>
        </div>
      )}
    </>
  );
}
