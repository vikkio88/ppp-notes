import { useRef, useState } from "react";
import ResultCard from "./ResultCard";
const { PUBLIC_LINK_URL } = import.meta.env;

type Link = {
  description: string;
  fileUrl: string;
  link: string;
  title: string;
};

export function SearchLink() {
  const searchRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Link[] | null>(null);
  const search = (value: string) => {
    value = value.toLocaleLowerCase();
    setIsLoading(true);
    fetch(`/data/${PUBLIC_LINK_URL}`)
      .then((res) => res.json())
      .then((r) => {
        setResults(
          r.filter(
            (l: Link) =>
              l.description.toLowerCase().includes(value) ||
              l.title.toLowerCase().includes(value)
          )
        );
        setIsLoading(false);
      });
  };
  const reset = () => {
    if (searchRef.current?.value) {
      searchRef.current.value = "";
    }
    searchRef.current?.focus();
    setResults(null);
  };
  return (
    <>
      <form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();

          const form = e.target as HTMLFormElement;
          const searchInput = form.elements.namedItem(
            "search"
          ) as HTMLInputElement;

          if (searchInput) {
            const searchValue = searchInput.value;
            search(searchValue);
          }
        }}
      >
        <input
          name="search"
          type="search"
          className="search"
          autoComplete="off"
          placeholder="🍕 Cerca tra gli episodi..."
          ref={searchRef}
        ></input>
      </form>
      {isLoading && <div className="spinner">🍕</div>}
      {!isLoading && results != null && results.length > 0 && (
        <>
          <div className="resultInfo">
            <button onClick={reset}>Reset</button>
          </div>
          <div className="results">
            {results.map((l, i) => (
              <ResultCard key={`link_${i}`} linkEntry={l} />
            ))}
          </div>
        </>
      )}
      {!isLoading && results != null && results.length < 1 && (
        <div className="resultInfo">

          <h2>Nessun Link Trovato</h2>
          <h1>🍕</h1>
          <button onClick={reset}>Reset</button>
        </div>
      )}
    </>
  );
}
