<script>
  import app from "../store/app.svelte";
  import TopicItem from "./TopicItem.svelte";
</script>

{#if app.menews.length > 0}
  <div class="topic">
    <strong>MeNews</strong>
    <ul>
      {#each app.menews as t}
        <TopicItem topic={t} type="menews" />
      {/each}
    </ul>
  </div>
{/if}
{#if app.lorrowaps.length > 0}
  <div class="topic">
    <strong>LorroWap</strong>
    <ul>
      {#each app.lorrowaps as t}
        <TopicItem topic={t} type="lorrowap" />
      {/each}
    </ul>
  </div>
{/if}
{#if app.main.length > 0}
  <div class="topic">
    <strong>Main</strong>
    <ul>
      {#each app.main as t}
        <TopicItem topic={t} type="main" />
      {/each}
    </ul>
  </div>
{/if}
{#if app.dolcetto.length > 0}
  <div class="topic">
    <strong>Dolcetti</strong>
    <ul>
      {#each app.dolcetto as t}
        <TopicItem topic={t} type="dolcetto" />
      {/each}
    </ul>
  </div>
{/if}
{#if app.amaro.length > 0}
  <div class="topic">
    <strong>Amari</strong>
    <ul>
      {#each app.amaro as t}
        <TopicItem topic={t} type="amaro" />
      {/each}
    </ul>
  </div>
{/if}
{#if app.lore.length > 0}
  <div class="topic">
    <strong>Lore</strong>
    <ul>
      {#each app.lore as t}
        <TopicItem topic={t} type="lore" />
      {/each}
    </ul>
  </div>
{/if}

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
