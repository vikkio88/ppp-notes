<script lang="ts">
  import type { EpisodeEntry } from "./libs/types";

  type Props = { episodes: EpisodeEntry[] };
  const { episodes }: Props = $props();
  let filteredEpisodes: EpisodeEntry[] = $state(episodes);
  let onlyCollected = $state(false);
  let onlyNotCollected = $state(false);
  const total = episodes.length;

  function formatDate(d: Date | string) {
    const date = typeof d === "string" ? new Date(d) : d;
    return date.toLocaleDateString("it-IT");
  }

  function onlyCollectedChange() {
    onlyCollected = !onlyCollected;
    if (onlyCollected) {
      onlyNotCollected = false;
      filteredEpisodes = episodes.filter((e) => e.collected);
      return;
    }

    filteredEpisodes = [...episodes];
  }

  function onlyNotCollectedChange() {
    onlyNotCollected = !onlyNotCollected;
    if (onlyNotCollected) {
      onlyCollected = false;
      filteredEpisodes = episodes.filter((e) => !e.collected);
      return;
    }

    filteredEpisodes = [...episodes];
  }
</script>

<p class="f g">
  <label>
    Filtra Episodi Indicizzati <input
      type="checkbox"
      bind:checked={onlyCollected}
      onclick={onlyCollectedChange}
    />
  </label>
  <label>
    Filtra Episodi da Completare <input
      type="checkbox"
      bind:checked={onlyNotCollected}
      onclick={onlyNotCollectedChange}
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
    <li class={`episode ${e.collected ? "collected" : ""}`}>
      <div class="title">
        <span class="check">{e.collected ? "✓" : ""}</span>
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
  {/each}
</ul>

<style>
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
