<script lang="ts">
  import type { Game } from '../../types/game';

  export let game: Game;
  export let isOpen = false;
  export let onClose: () => void = () => {};

  let iframeRef: HTMLIFrameElement;
  let isLoading = true;
  let hasError = false;

  function closeGame() {
    onClose();
  }

  function handleIframeLoad() {
    isLoading = false;
  }

  function handleIframeError() {
    isLoading = false;
    hasError = true;
  }
</script>

{#if isOpen}
  <div class="absolute inset-0 bg-black z-50 flex flex-col">
    <!-- Game Header -->
    <div class="flex items-center justify-between p-4 bg-black/50">
      <h2 class="text-white text-xl">{game.title}</h2>
      <div class="flex items-center gap-4">
        <button 
          class="text-white hover:text-red-400 transition-colors"
          on:click={closeGame}
          aria-label="Close game"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Game Content -->
    <div class="flex-1 relative">
      {#if isLoading}
        <div class="absolute inset-0 flex items-center justify-center bg-black/50">
          <div class="text-white text-xl">Loading game...</div>
        </div>
      {/if}
      
      {#if hasError}
        <div class="absolute inset-0 flex items-center justify-center bg-black/50">
          <div class="text-white text-xl">Failed to load game. Please try again.</div>
        </div>
      {:else}
        <iframe
          bind:this={iframeRef}
          src={game.gameUrl}
          class="w-full h-full"
          on:load={handleIframeLoad}
          on:error={handleIframeError}
          title={`Play ${game.title}`}
        ></iframe>
      {/if}
    </div>
  </div>
{/if} 