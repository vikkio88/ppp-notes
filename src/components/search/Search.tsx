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

const MIN_SEARCH_SIZE = 3;

export function Search({ links }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [canSubmit, setCanSubmit] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(
    null
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchValue = inputRef.current?.value ?? "";
    if (searchValue && searchValue.length >= MIN_SEARCH_SIZE) {
      setSearchResults(fuse.search(searchValue) ?? []);
    }
  };
  const reset = () => {
    if (inputRef.current) inputRef.current.value = "";
    setSearchResults(null);
    inputRef.current?.focus();
    setCanSubmit(false);
  };

  const check = () => {
    if (!inputRef.current) return;

    setCanSubmit(inputRef.current.value.length >= MIN_SEARCH_SIZE);
  };

  const random = () => {
    if (!inputRef.current || !formRef.current) return;
    inputRef.current.value = "pizza";
    formRef.current.requestSubmit();
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
      <form ref={formRef} onSubmit={handleSubmit}>
        <input
          name="search"
          type="text"
          className="search"
          autoComplete="off"
          placeholder="🍕 Cerca tra gli scontrini..."
          ref={inputRef}
          onChange={check}
        />
        {!Boolean(searchResults) && (
          <div className="row">
            <button className="small" disabled={!canSubmit}>
              Cerca 🔗
            </button>
            <button
              className="small"
              onClick={(e) => {
                e.preventDefault();
                random();
              }}
            >
              Mi sento 🍕
            </button>
          </div>
        )}
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
