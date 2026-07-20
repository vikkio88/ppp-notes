<script lang="ts">
  import Fuse from "fuse.js";
  import Spinner from "./components/Spinner.svelte";
  import type { IndexedTopic } from "../dataEntry/libs/types";
  let fuse: { tags: Fuse<{ tag: string; episodes: IndexedTopic[] }> };

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    const result = fuse?.tags.search(value);
    searchResults = result.map((r) => ({
      match: r.item.tag,
      episodes: r.item.episodes,
    }));
  }

  function random(e: MouseEvent) {
    e.preventDefault();
    console.log("RANDOM");
  }

  function reset() {
    searchResults = undefined;
    value = "";
  }

  let value = $state("");
  let canSubmit = $derived(value && value.length > 3);
  let searchResults: { match: string; episodes: IndexedTopic[] }[] | undefined =
    $state();

  let loadingFuse = (async () => {
    const r = await fetch("/data/index/tags_episodes.json");
    const tagsIndex = (await r.json()) as Record<string, IndexedTopic[]>;

    fuse = {
      tags: new Fuse(
        Object.entries(tagsIndex).map((e) => {
          return {
            tag: e[0],
            episodes: e[1],
          };
        }),
        { keys: ["tag"], threshold: 0.2 },
      ),
    };
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
    <button class="small" onclick={reset}> Reset </button>
  {/if}
  {#if Array.isArray(searchResults) && searchResults.length > 0}
    <ul>
      {#each searchResults as r}
        <li>{r.match}</li>
        <ul>
          {#each r.episodes as e}
            <li>
              {e.episodeTitle} - {e.author}
              {e.section}
              {e.description}
            </li>
          {/each}
        </ul>
      {:else}
        <div class="resultInfo">
          <h2>Nessun Link Trovato</h2>
          <h1 class="shake">🍕</h1>
        </div>
      {/each}
    </ul>
  {/if}
{/await}
