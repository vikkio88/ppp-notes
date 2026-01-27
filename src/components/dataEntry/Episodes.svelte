<script lang="ts">
  import type { EpisodeEntry } from "./libs/types";

  type Props = { episodes: EpisodeEntry[]; partials: number[] };
  const { episodes, partials }: Props = $props();
  let filteredEpisodes: EpisodeEntry[] = $state(episodes);
  let onlyCollected = $state(false);
  let onlyNotCollected = $state(false);
  let textFilter = $state("");
  const total = episodes.length;

  function formatDate(d: Date | string) {
    const date = typeof d === "string" ? new Date(d) : d;
    return date.toLocaleDateString("it-IT");
  }

  $effect(() => {
    if (textFilter.length < 2 && textFilter !== "") {
      return;
    }

    applyFilters();
  });

  function applyFilters() {
    let result = [...episodes];

    if (onlyCollected) {
      onlyNotCollected = false;
      result = result.filter((e) => e.collected);
    } else if (onlyNotCollected) {
      onlyCollected = false;
      result = result.filter((e) => !e.collected);
    }

    if (textFilter.length >= 2) {
      const q = textFilter.toLowerCase();
      result = result.filter((e) => {
        return `${e.title}`.toLowerCase().includes(q);
      });
    }

    filteredEpisodes = result;
  }
</script>

<p class="f g filters">
  <input
    name="search"
    type="text"
    class="search"
    autocomplete="off"
    placeholder="Filtra titoli..."
    bind:value={textFilter}
  />
  <label>
    Indicizzati <input
      type="checkbox"
      bind:checked={onlyCollected}
      onclick={applyFilters}
    />
  </label>
  <label>
    Non Indicizzati <input
      type="checkbox"
      bind:checked={onlyNotCollected}
      onclick={applyFilters}
    />
  </label>
</p>
{#if filteredEpisodes.length !== total}
  <p>
    {filteredEpisodes.length} / {total}
  </p>
{/if}

<ul class="episodes">
  {#each filteredEpisodes as e}
    {@const partial = e.collected && partials.includes(e.number)}
    <li class="episode" class:collected={e.collected && !partial} class:partial>
      <div class="title">
        <span class="check">
          {partial ? "◐" : e.collected ? "✓" : ""}
        </span>
        <a href={`/data/tool/?episode=${e.file}`}>
          {" "}
          <span>{e.title}</span>
        </a>
      </div>
      {#if e.collected && e.meta.user}
        <div class="meta">
          Raccolto da <strong>{e.meta.user}</strong> il{" "}
          {formatDate(e.meta.date)}
        </div>
      {/if}
    </li>
  {:else}
    <h2>Nessun risultato</h2>
  {/each}
</ul>

<style>
  .filters > label {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 1rem;
  }
  .episodes {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .episode {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem 1.2rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    background: #fafafa;
  }

  .episode.collected {
    border-color: #b6e3b6;
    background: #f3fbf3;
  }

  .episode.partial {
    border-color: #e3e3b6;
    border-style: dotted;
    border-width: 2px;
    background: #fbfbf3;
  }

  .title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
  }

  .check {
    width: 1.25rem;
    color: #2e7d32;
  }

  .meta {
    font-size: 14px;
    color: #555;
    padding-left: 1.75rem;
  }
</style>
