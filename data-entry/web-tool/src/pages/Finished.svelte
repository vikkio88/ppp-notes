<script lang="ts">
  import { strings, t } from "../data/strings";
  import app from "../store/app.svelte";
</script>

<h3>Finished</h3>

<main class="f1 f cc">
  <p>{t(strings.finished.message, { episode: app.meta?.title! })}</p>
  <p>{strings.finished.please}</p>
  <button onclick={() => app.download()}>{strings.finished.download}</button>
  <h1 class="shake">🍕</h1>
</main>
<div class="m0a pd">
  <button class="n-btn" onclick={() => app.restart()}>↩️ Restart</button>
</div>
