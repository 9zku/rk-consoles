<script lang="ts">
  import Screen from './lib/components/Screen.svelte';
  import { useNuiEvent } from './lib/utils/useNuiEvent';
  import { fetchNui } from './lib/utils/fetchNui';
  import { onMount, onDestroy } from 'svelte';
  import "./app.css";

  let visible = false;
  let config: any = null;

  useNuiEvent<{ show: boolean }>('setVisible', (data) => {
    visible = data.show;
    if (data.show && !config) {
      fetchConfig();
    }
  });

  async function fetchConfig() {
    try {
      config = await fetchNui('getConfig');
    } catch (error) {
      console.error('Failed to fetch config:', error);
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && visible) {
      visible = false;
      fetchNui('closeUI');
    }
  }

  onMount(() => {
    document.addEventListener('keydown', handleKeydown);
  });

  onDestroy(() => {
    document.removeEventListener('keydown', handleKeydown);
  });
</script>

{#if visible}
  <Screen {config} />
{/if}

<style>

</style>
