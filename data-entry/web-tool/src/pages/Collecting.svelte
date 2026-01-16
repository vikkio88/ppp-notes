<script lang="ts">
  import Topic from "../components/Topic.svelte";
  import TopicItem from "../components/TopicItem.svelte";
  import Topics from "../components/Topics.svelte";

  import { t, strings } from "../data/strings";
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
      label: `${strings.collecting.menews} ${topicTypeMap.menews}`,
      command: () => add("menews"),
    },
    {
      label: `${strings.collecting.lorrowap} ${topicTypeMap.lorrowap}`,
      command: () => add("lorrowap"),
    },
    {
      label: `${strings.collecting.main} ${topicTypeMap.main}`,
      command: () => add("main"),
    },
  ];
</script>

<main class="f1 f c">
  <h2>{t(strings.collecting.title, { episode: app.meta?.title ?? 0 })}</h2>

  {#if isEnteringData && collectionType}
    <Topic type={collectionType} onFinished={cancel} />
  {:else}
    <div class="f1">
      <Topics />
    </div>
    <div class="cmd add">
      {#each addCommands as c}
        <button class="i-btn" onclick={c.command}>
          <span>{c.label}</span>
          <span class="action">➕</span>
        </button>
      {/each}
    </div>
    <div class="cmd">
      <button class="i-btn" onclick={() => app.next()}>
        {strings.collecting.finished}<span>🛑</span>
      </button>
    </div>
  {/if}
</main>

<style>
  .add > button {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font-size: 2rem;
  }

  h2 {
    text-align: center;
  }
</style>
