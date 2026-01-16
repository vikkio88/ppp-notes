<script>
  import app from "../store/app.svelte";
  import TopicItem from "./TopicItem.svelte";
</script>

{#if app.menews.length > 0}
  <h3>MeNews</h3>
  <ul>
    {#each app.menews as t}
      <TopicItem topic={t} type="menews" />
    {/each}
  </ul>
{/if}
{#if app.lorrowaps.length > 0}
  <h3>LorroWap</h3>
  <ul>
    {#each app.lorrowaps as t}
      <TopicItem topic={t} type="lorrowap" />
    {/each}
  </ul>
{/if}
{#if app.main.length > 0}
  <h3>Main</h3>
  <ul>
    {#each app.main as t}
      <TopicItem topic={t} type="main" />
    {/each}
  </ul>
{/if}
