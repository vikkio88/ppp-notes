import { useState } from "react";
import ResultCard from "./ResultCard";
const { PUBLIC_LINK_URL } = import.meta.env;

type Link = {
  description: string;
  fileUrl: string;
  link: string;
  title: string;
};

export function SearchLink() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Link[] | null>(null);
  const search = (value: string) => {
    value = value.toLocaleLowerCase();
    setIsLoading(true);
    fetch(`/data/${PUBLIC_LINK_URL}`)
      .then((res) => res.json())
      .then((r) => {
        console.log({ r });
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
            searchInput.value = "";
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
        ></input>
        {isLoading && <div className="spinner">🍕</div>}
        {!isLoading && results != null && (
          <div className="results">
            {results.map((l, i) => (
              <ResultCard key={`link_${i}`} linkEntry={l} />
            ))}
          </div>
        )}
      </form>
    </>
  );
}
