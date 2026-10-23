<script lang="ts">
  import Fuse from "fuse.js";
  import Spinner from "./components/Spinner.svelte";
  import type { IndexedTopic } from "../dataEntry/libs/types";
  import { slugify } from "../../libs/slugify";

  const MIN_SEARCH_SIZE = 2;

  type SearchableTopic = IndexedTopic & { pizzaDescription?: string };

  let fuse: Fuse<SearchableTopic>;
  let allTags: string[] = [];
  let allTopics: SearchableTopic[] = [];

  function searchTerms(terms: string[]): SearchableTopic[] {
    if (!fuse) return [];
    const resultSets = terms.map(
      (t) => new Set(fuse.search(t).map((r) => r.item)),
    );
    const [first, ...rest] = resultSets;
    return [...first].filter((item) => rest.every((set) => set.has(item)));
  }

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    const terms = value
      .split("&&")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    searchResults = searchTerms(terms);
  }

  function searchByTag(tag: string) {
    value = tag;
    searchResults = allTopics.filter((t) => t.tags.includes(tag));
  }

  function random(e: MouseEvent) {
    e.preventDefault();
    if (allTags.length === 0) return;
    searchByTag(allTags[Math.floor(Math.random() * allTags.length)]);
  }

  function reset() {
    searchResults = undefined;
    value = "";
  }

  let value = $state("");
  let canSubmit = $derived(value.trim().length >= MIN_SEARCH_SIZE);
  let searchResults: SearchableTopic[] | undefined = $state();

  let loadingFuse = (async () => {
    const res = await fetch("/data/index/topics.json");
    const topics = (await res.json()) as IndexedTopic[];

    const searchable: SearchableTopic[] = topics.map((t) => ({
      ...t,
      pizzaDescription: t.pizza?.description,
    }));
    allTopics = searchable;

    const tagSet = new Set<string>();
    for (const topic of topics) {
      for (const tag of topic.tags) tagSet.add(tag);
    }
    allTags = [...tagSet];

    fuse = new Fuse(searchable, {
      keys: [
        { name: "description", weight: 2 },
        { name: "tags", weight: 2 },
        { name: "author", weight: 1 },
        { name: "pizzaDescription", weight: 1 },
      ],
      threshold: 0.3,
      ignoreLocation: true,
      minMatchCharLength: MIN_SEARCH_SIZE,
    });
  })();
</script>

{#await loadingFuse}
  <Spinner />
{:then _}
  <form onsubmit={handleSubmit}>
    <input
      name="search"
      type="text"
      class="search"
      autoComplete="off"
      placeholder="🍕 Cerca tra gli episodi..."
      bind:value
    />
    {#if !searchResults}
      <div class="row">
        <button class="small" disabled={!canSubmit}> Cerca 🔍</button>
        <button class="small" onclick={random}> Mi sento 🍕 </button>
      </div>
    {/if}
  </form>

  {#if searchResults}
    <div class="f rc g_5">
      <button class="small" onclick={reset}> Reset </button>
      <span>{searchResults.length} risultat{searchResults.length === 1 ? "o" : "i"}</span>
    </div>
  {/if}
  {#if Array.isArray(searchResults) && searchResults.length > 0}
    <div class="results">
      {#each searchResults as topic}
        <div class="result">
          <a href={`/episodes/${slugify(topic.episodeTitle)}`}>
            <h3>{topic.episodeTitle}</h3>
          </a>
          <div class="f rc g_5">
            <span>{topic.author}</span>
            <span>({topic.section})</span>
            {#if topic.pizza}
              <span>🍕 {topic.pizza.slices}/10</span>
            {/if}
          </div>
          <p>{topic.description}</p>
          {#if topic.pizza?.description}
            <p>🍕 {topic.pizza.description}</p>
          {/if}
          {#if topic.tags.length > 0}
            <div class="f rc fiwr g_5">
              {#each topic.tags as tag}
                <button
                  type="button"
                  class="tag"
                  onclick={() => searchByTag(tag)}
                >
                  {tag}
                </button>
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {:else if Array.isArray(searchResults)}
    <div class="resultInfo">
      <h2>Nessun Risultato Trovato</h2>
      <h1 class="shake">🍕</h1>
    </div>
  {/if}
{/await}

<style>
  .tag {
    background: rgba(255, 122, 122, 0.15);
    color: rgba(51, 51, 51, 0.8);
    padding: 0.2rem 0.7rem;
    border-radius: 10px;
    font-size: 0.85rem;
    border: none;
  }

  .tag:hover {
    background: rgba(255, 122, 122, 0.3);
  }
</style>
