<script lang="ts">
  import { load } from "../api/episode";
  import Collecting from "./pages/Collecting.svelte";
  import Finished from "./pages/Finished.svelte";
  import Login from "./pages/Login.svelte";
  import app from "./store/app.svelte";

  const params = new URLSearchParams(window.location.search);
  const url = params.get("episode");
  let episodePromise = url ? load(url) : Promise.resolve();
</script>

{#await episodePromise}
  <h1>Loading</h1>
{:then resp}
  {#if resp}
    <pre>
{JSON.stringify(resp, null, 2)}
</pre>
  {/if}
  {#if app.phase === "collecting"}
    <Collecting />
  {:else if app.phase === "finished"}
    <Finished />
  {:else}
    <!-- This is if you need to log in -->
    <Login />
  {/if}
{/await}
