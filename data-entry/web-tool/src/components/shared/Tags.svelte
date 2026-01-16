<script lang="ts">
  import { toTag } from "../../libs/formatters";
  import ConfirmBtn from "./ConfirmBtn.svelte";

  type Props = {
    tags?: string[];
  };

  let { tags = $bindable([]) }: Props = $props();



  let adding = $state(false);
  let input = $state("");

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (input.length < 2) {
      return;
    }

    select(input);
  };

  const removeTag = async (tag: string) => {
    tag = toTag(tag);
    const newTags = [...tags].filter((t) => t !== tag);
    tags = [...newTags];
  };

  const select = async (tag: string) => {
    const newTag = toTag(tag.trim());

    if (tags.includes(newTag)) {
      input = "";
      adding = false;
      return;
    }

    tags.push(newTag);
    input = "";
    adding = false;
    return;
  };

  const reset = () => {
    input = "";
    adding = false;
  };
</script>

<div class="f rc tag-list">
  {#each tags as tag}
    <ConfirmBtn
      onConfirm={() => removeTag(tag)}
      confirmLabel={"🗑️"}
      cancelLabel={"↩️"}
    >
      <span class="tag">{tag}</span>
    </ConfirmBtn>
  {/each}

  {#if adding}
    <div class="f rc g choice">
      <form onsubmit={onSubmit}>
        <input bind:value={input} placeholder="Add tag..." class="tag-input" />
      </form>
      <button class="n-btn cancel" onclick={reset}>❌</button>
    </div>
  {:else}
    <button class="n-btn add" onclick={() => (adding = true)}>➕ Tag</button>
  {/if}
</div>

<style>
  .tag-list {
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .tag {
    background: var(--accent-v1-color);
    color: var(--danger-color);
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius);
    font-size: 1rem;
    text-shadow: var(--white-1-color) 1px 1px 5px;
  }

  input {
    font-size: 0.85rem;
    padding: 0.2rem 0.5rem;
    border: 1px solid var(--gray-4-color);
    outline: none;
    flex: 4;
  }

  .cancel {
    flex: 1;
  }

  .n-btn {
    font-size: 1.5rem;
    padding: 0.2rem 0.5rem;
    margin: 0 0.5rem;
  }

  .add.n-btn:hover {
    background-color: var(--black-1-color);
  }

  .choice {
    position: relative;
    background-color: var(--gray-1-color);
    padding: 0.1rem 0.5rem;
    border-radius: var(--border-radius);
  }

</style>
