<script lang="ts">
  import { authorLabelMap } from "../libs/author";
  import { topicTypeMap } from "../libs/topics";
  import type { BaseTopic, CollectionType, MainTopic } from "../libs/types";
  import app from "../store/app.svelte";
  import ConfirmBtn from "./shared/ConfirmBtn.svelte";

  type Props = { topic: MainTopic | BaseTopic; type: CollectionType };

  const { topic, type }: Props = $props();
</script>

<li>
  <span>
    {topicTypeMap[type]}
  </span>

  <span>
    {authorLabelMap[topic.author] || `🧑 ${topic.author}`}
  </span>

  <span class="f1">
    {topic.description}
  </span>

  {#if "pizza" in topic}
    <span>
      (🍕 {topic.pizza?.slices}/10)
    </span>
  {/if}

  <ConfirmBtn onConfirm={() => app.remove(type, topic.id)}>🗑️</ConfirmBtn>
</li>

<style>
  li {
    background-color: var(--main-bg-faint-color);
    padding: var(--pad);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    margin: 0 1rem;
  }
</style>
