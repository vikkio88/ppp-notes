<script lang="ts">
  import Topic from "../components/Topic.svelte";
  import Topics from "../components/Topics.svelte";
  import { topicTypeMap } from "../libs/topics";
  import type { CollectionType } from "../libs/types";
  import app from "../store/app.svelte";
  let isEnteringData = $state(false);
  let collectionType: CollectionType | undefined = $state();
  function add(c: CollectionType) {
    isEnteringData = true;
    collectionType = c;
  }
  function cancel() {
    isEnteringData = false;
    collectionType = undefined;
  }

  const addCommands = [
    {
      label: `Menews ${topicTypeMap.menews}`,
      command: () => add("menews"),
    },
    {
      label: `Lorrowap ${topicTypeMap.lorrowap}`,
      command: () => add("lorrowap"),
    },
    {
      label: `Main ${topicTypeMap.main}`,
      command: () => add("main"),
    },
    {
      label: `Dolcetto ${topicTypeMap.dolcetto}`,
      command: () => add("dolcetto"),
    },
    {
      label: `Amaro ${topicTypeMap.amaro}`,
      command: () => add("amaro"),
    },
    {
      label: `Lore ${topicTypeMap.lore}`,
      command: () => add("lore"),
    },
  ];
</script>

<h2>
  {`${app.meta?.title ?? "Sconosciuto"}`}
</h2>

{#if isEnteringData && collectionType}
  <Topic type={collectionType} onFinished={cancel} />
{:else}
  <div class="f1">
    <div class="pd">
      <Topics />
    </div>
  </div>
  <div class="cmd add f1">
    {#each addCommands as c}
      <button class="i-btn" onclick={c.command}>
        <span>{c.label}</span>
        <span class="action">➕</span>
      </button>
    {/each}
  </div>
  <div class="cmd f rc btm">
    <button class="i-btn stop" onclick={() => app.next()}>
      Ho Finito<span>🛑</span>
    </button>
  </div>
{/if}

<style>
  .add > button {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
  }

  .stop {
    font-size: 1.5rem;
  }

  h2 {
    text-align: center;
  }

  .btm {
    margin-bottom: 1rem;
  }
</style>
