<script lang="ts">
  import app from "../store/app.svelte";

  let name = $state("");
  let title = $state("");
  let num = $state("");

  function isValid(num: string) {
    const episodeNum = Number(num);
    return !isNaN(episodeNum) && (episodeNum < 0 || episodeNum > 0);
  }

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (!isValid(num)) return;
    app.startSession({ user: name || "Anonymous", title, number: Number(num) });
    app.next();
  }
</script>

<h3>Raccolta Dati PPP</h3>
<form onsubmit={handleSubmit}>
  <input
    type="text"
    bind:value={title}
    placeholder="Titolo dell'episodio (non obbligatorio)"
  />
  <input
    required
    type="number"
    bind:value={num}
    placeholder="Numero dell'episodio/(-1 se non ha un numero)"
  />
  <input
    type="text"
    bind:value={name}
    placeholder="Il tuo nome/nickname (se vuoi essere citato)"
  />
  <button>Comincia</button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    min-width: 50%;
    min-height: 150%;
    padding: 3rem;
  }
  input {
    padding: 1.2rem;
  }
  form > button {
    padding: 1.2rem;
  }
</style>
