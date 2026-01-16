<script lang="ts">
  import Collecting from "./pages/Collecting.svelte";
  import Finished from "./pages/Finished.svelte";
  import Login from "./pages/Login.svelte";
  import app from "./store/app.svelte";
</script>

{#if app.phase === "collecting"}
  <Collecting />
{:else if app.phase === "finished"}
  <Finished />
{:else}
  <!-- This is if you need to log in -->
  <Login />
{/if}
