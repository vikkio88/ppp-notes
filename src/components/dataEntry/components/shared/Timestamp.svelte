<script lang="ts">
  import { toTimestapLabel } from "../../libs/formatters";
  import type { Timestamp } from "../../libs/types";
  type Props = {
    timestamp?: Timestamp;
  };

  let { timestamp = $bindable({ hours: 0, minutes: 0, seconds: 0 }) }: Props =
    $props();

  let hasTime = $state(false);
  let hours = $state(timestamp.hours);
  let minutes = $state(timestamp.minutes);
  let seconds = $state(timestamp.seconds);
  function onchange() {
    timestamp = {
      hours,
      minutes,
      seconds,
    };
  }

  let timeLabel = $derived(toTimestapLabel(hours, minutes, seconds));
</script>

<article class="f c g aic">
  <div class="f r g">
    <h3>⏱️ Timestamp</h3>
    <input type="checkbox" bind:checked={hasTime} />
  </div>
  {#if hasTime}
    <div class="controls">
      <span class="timeLabel">{timeLabel}</span>
    </div>
    <div class="controls w100 g">
      <input type="number" min="0" max="100" bind:value={hours} {onchange} />h
      <input type="number" min="0" max="59" bind:value={minutes} {onchange} />m
      <input type="number" min="0" max="59" bind:value={seconds} {onchange} />s
    </div>
  {/if}
</article>

<style>
  .controls {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
  }
  .controls > input {
    padding: 1rem;
  }
  .timeLabel {
    font-weight: 700;
    font-size: 3rem;
    font-variant-numeric: tabular-nums;
    color: var(--main-font-color);
  }
</style>
