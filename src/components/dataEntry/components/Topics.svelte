<script lang="ts">
  import type { CollectionType } from "../libs/types";
  import app from "../store/app.svelte";
  import TopicItem from "./TopicItem.svelte";

  const categories: {
    type: CollectionType;
    label: string;
    appKey:
      | "menews"
      | "lorrowaps" // TODO: if I remove this by converting it to singular I can remove appKey from here
      | "main"
      | "dolcetto"
      | "amaro"
      | "impizioni"
      | "lore";
  }[] = [
    { type: "menews", label: "MeNews", appKey: "menews" },
    { type: "lorrowap", label: "LorroWap", appKey: "lorrowaps" },
    { type: "main", label: "Main", appKey: "main" },
    { type: "dolcetto", label: "Dolcetti", appKey: "dolcetto" },
    { type: "amaro", label: "Amari", appKey: "amaro" },
    { type: "impizioni", label: "Impizioni", appKey: "impizioni" },
    { type: "lore", label: "Lore", appKey: "lore" },
  ];
</script>

{#each categories as { label, type, appKey }}
  {#if app[appKey]?.length > 0}
    <div class="topic">
      <strong>{label}</strong>
      <ul>
        {#each app[appKey] as t}
          <TopicItem topic={t} {type} />
        {/each}
      </ul>
    </div>
  {/if}
{/each}

<style>
  ul {
    margin-block-start: 0;
    margin-block-end: 0;
    padding-inline-start: 0;
  }

  .topic {
    display: flex;
    flex-direction: column;
    padding: 1rem;
  }

  .topic > strong {
    text-align: center;
  }
</style>
