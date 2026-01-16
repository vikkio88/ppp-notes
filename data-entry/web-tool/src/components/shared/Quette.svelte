<script lang="ts">
  import { strings } from "../../data/strings";
  type Props = { value?: number; description?: string; size?: number };

  const MAX_SLICES = 10;
  let {
    size = 96,
    value = $bindable(5),
    description = $bindable(""),
  }: Props = $props();
  let pct = $derived(Math.max(0, Math.min(1, value / MAX_SLICES)));
  let angle = $derived(pct * 360);
  let valueLabel = $derived(String(value).padStart(2, "0"));
  let pizzas = $derived(Array.from({ length: value }));
  let hasPizza = $state(true);
</script>

<article class="f c g aic f1">
  <div class="f r g">
    <h3>{strings.collecting.fette}</h3>
    <input type="checkbox" bind:checked={hasPizza} />
  </div>
  {#if hasPizza}
    <div class="f r">
      {#each pizzas as _}
        <span>🍕</span>
      {:else}
        <span>🍽️</span>
      {/each}
    </div>
    <div class="spinner" style="width:{size}px; height:{size}px">
      <div
        class="ring"
        style="background: conic-gradient(#ffd700 {angle}deg, #eee 0deg)"
      ></div>
      <div class="center">{valueLabel} / {MAX_SLICES}</div>
    </div>
    <div class="controls w100">
      <input
        class="w100"
        name="pizza"
        type="range"
        min="0"
        max={MAX_SLICES}
        bind:value
      />
    </div>
    <div class="f r w100">
      <input
        type="text"
        class="w100"
        name="pizzaDescription"
        bind:value={description}
        placeholder={strings.collecting.pizzaDescription}
      />
    </div>
  {/if}
</article>

<style>
  .controls {
    display: flex;
    align-items: center;
  }
  .spinner {
    position: relative;
    border-radius: 50%;
    display: inline-block;
  }
  .ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
  }
  .ring::before {
    content: "";
    position: absolute;
    inset: 12%;
    background-color: var(--main-bg-faint-color);
    border-radius: 50%;
  }
  .center {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: var(--main-font-color);
  }
</style>
