<script lang="ts">
  import { strings } from "../../data/strings";

  type Props = {
    onAdd: () => void;
    onCancel: () => void;
  };

  const { onAdd, onCancel }: Props = $props();
</script>

<div class="cmd">
  <button class="i-btn danger" onclick={onCancel}>
    {strings.globals.close}<span>❌</span>
  </button>
  <button class="i-btn success" onclick={onAdd}>
    {strings.globals.add}<span>➕</span>
  </button>
</div>
