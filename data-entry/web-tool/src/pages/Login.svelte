<script lang="ts">
  import { strings } from "../data/strings";
  import app from "../store/app.svelte";

  let name = $state("");
  let title = $state("");
  let num = $state("");

  function isValid(name: string, title: string, num: string) {
    const episodeNum = Number(num);
    return (
      name.length > 2 &&
      !isNaN(episodeNum) &&
      episodeNum > 0 &&
      title.length > 2
    );
  }

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (!isValid(name, title, num)) return;
    app.startSession({ user: name, title, number: Number(num) });
    app.next();
  }
</script>

<main class="f1 f cc">
  <h3>{strings.login.title}</h3>
  <form onsubmit={handleSubmit}>
    <input
      required
      type="text"
      bind:value={title}
      placeholder={strings.login.episodeTitle}
    />
    <input
      required
      type="number"
      bind:value={num}
      placeholder={strings.login.episodeNumber}
    />
    <input
      required
      type="text"
      bind:value={name}
      placeholder={strings.login.name}
    />
    <button>{strings.globals.next}</button>
  </form>
</main>

<style>
  form {
    display: flex;
    flex-direction: column;
  }
  input {
    padding: 1.2rem;
  }
  form > button {
    padding: 1.2rem;
  }
</style>
