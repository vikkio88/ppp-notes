<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    tooltip?: string;
    secondaryAction?: {
      label: string;
      onClick: () => void;
    };
    position?: "top" | "right" | "left" | "bottom";
    children: Snippet;
    onConfirm: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
  };

  const {
    confirmLabel = "✅",
    cancelLabel = "❌",
    secondaryAction,
    tooltip,
    position = "top",
    onConfirm,
    children,
  }: Props = $props();
  let needsConfirming = $state(false);
</script>

{#if !needsConfirming}
  <button
    class="n-btn"
    data-tooltip={tooltip}
    data-tooltip-position={tooltip ? position : undefined}
    onclick={() => (needsConfirming = true)}
  >
    {@render children()}
  </button>
{:else}
  <div class="f rc g choice">
    <button
      class="n-btn"
      onclick={() => {
        onConfirm();
        needsConfirming = false;
      }}
    >
      {confirmLabel}
    </button>
    {#if secondaryAction}
      <button
        class="n-btn"
        onclick={() => {
          secondaryAction.onClick();
          needsConfirming = false;
        }}>{secondaryAction.label}</button
      >
    {/if}
    <button class="n-btn" onclick={() => (needsConfirming = false)}
      >{cancelLabel}</button
    >
  </div>
{/if}

<style>
  .n-btn {
    position: relative;
  }
  .choice {
    background-color: var(--gray-1-color);
    padding: 0.1rem 0.5rem;
    border-radius: var(--border-radius);
  }
</style>
