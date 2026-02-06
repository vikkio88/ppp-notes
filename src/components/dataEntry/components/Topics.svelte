<script lang="ts">
  import type { CollectionType } from "../libs/types";
  import app from "../store/app.svelte";
  import TopicItem from "./TopicItem.svelte";

  const categories: {
    type: CollectionType;
    label: string;
  }[] = [
    { type: "menews", label: "MeNews" },
    { type: "lorrowap", label: "LorroWap" },
    { type: "main", label: "Main" },
    { type: "dolcetto", label: "Dolcetti" },
    { type: "amaro", label: "Amari" },
    { type: "impizioni", label: "Impizioni" },
    { type: "lore", label: "Lore" },
  ];
</script>

{#each categories as { label, type }}
  {#if app[type]?.length > 0}
    <div class="topic">
      <strong>{label}</strong>
      <ul>
        {#each app[type] as t}
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
