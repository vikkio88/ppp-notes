<script lang="ts">
  import { authorLabelMap } from "../../libs/author";
  import { type Author, AUTHORS } from "../../libs/types";

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
      placeholder="Conduttore"
      bind:value={author}
      onfocus={() => (author = "")}
    />
  {/if}
</div>

<style>
  select {
    padding: 1rem 1.5rem;
    font-size: 1.2rem;
  }
  input[type="text"] {
    padding: 1rem 1.5rem;
    font-size: 1.2rem;
  }
</style>
