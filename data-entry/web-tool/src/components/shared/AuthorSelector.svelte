<script lang="ts">
  import { type Author, AUTHORS } from "../../libs/types";
  import { authorLabelMap } from "../../libs/author";
  import { strings } from "../../data/strings";

  type Props = {
    author?: Author;
  };

  let { author = $bindable("Other") }: Props = $props();
  let selectedAuthor = $state(author);

  const handleChange = (e: Event) => {
    const newType = (e.target as HTMLSelectElement).value as Author;
    selectedAuthor = newType;
    author = newType;
  };
</script>

<div class="f r g aic">
  <select onchange={handleChange} value={selectedAuthor}>
    {#each AUTHORS as a}
      <option value={a}>
        {authorLabelMap[a]}
      </option>
    {/each}
  </select>
  {#if selectedAuthor === "Other"}
    <input
      type="text"
      placeholder={strings.collecting.authorPH}
      bind:value={author}
      onfocus={() => (author = "")}
    />
  {/if}
</div>

<style>
  select {
    padding: 1rem 1.5rem;
    background-color: var(--main-bg-faint-color);
    color: var(--main-font-color);
    font-size: 1.2rem;
  }
</style>
