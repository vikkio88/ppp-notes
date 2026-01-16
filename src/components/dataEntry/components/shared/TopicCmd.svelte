<script lang="ts">
  type Props = {
    onAdd: () => void;
    onCancel: () => void;
  };

  const { onAdd, onCancel }: Props = $props();
</script>

<div class="cmd">
  <button class="i-btn danger" onclick={onCancel}>
    Chiudi<span>❌</span>
  </button>
  <button class="i-btn success" onclick={onAdd}>
    Aggiungi<span>➕</span>
  </button>
</div>
