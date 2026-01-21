<script lang="ts">
  import app from "../store/app.svelte";
  let name = $state(app.meta?.user || "");
</script>

<h3>Finished</h3>

<main class="f1 f cc">
  <p>
    Se vuoi essere citato/quotato come contributor aggiungi/modifica il tuo nome
    qui:
    <input type="text" bind:value={name} />
  </p>

  <p>
    {`Finito di raccogliere dati per l'episodio "${app.meta?.title ?? "Sconosciuto"}"`}
  </p>
  <p>Per favore, scarica e condividi questo file:</p>
  <button
    onclick={() => {
      app.name = name;
      app.download();
    }}>Scarica</button
  >
  <h1 class="shake">🍕</h1>
</main>
<div class="m0a pd">
  <button class="n-btn" onclick={() => app.restart()}>↩️ Restart</button>
</div>

<style></style>
