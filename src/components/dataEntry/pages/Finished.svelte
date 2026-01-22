<script lang="ts">
  import app from "../store/app.svelte";
  let name = $state(app.meta?.user || "");
</script>

<main class="f1 f cc">
  <h2>Grazie</h2>
  <h1 class="shake">🍕</h1>
  <p>
    Hai finito di raccogliere dati per l'episodio
    <strong>
      {`"${app.meta?.title ?? "Sconosciuto"}"`}
    </strong>
  </p>

  <p>
    Se vuoi essere citato nella raccolta dati come contributor aggiungi/modifica
    il tuo nome qui:
  </p>
  <input type="text" bind:value={name} />
  <p>Scarica questo file</p>
  <button
    onclick={() => {
      app.name = name;
      app.download();
    }}
  >
    Scarica ⬇️
  </button>

  <p>E condividilo sul pizzord o sul gruppo telegram</p>
</main>

<button class="small" onclick={() => app.restart()}>↩️ Ricomincia</button>

<style>
  input[type="text"] {
    padding: 0.75rem 1rem;
    font-size: 1.1rem;
  }

  button {
    font-size: 2rem;
  }

  .small {
    font-size: 1.2rem;
    padding: 0.5rem;
    margin-bottom: 1rem;
  }
</style>
