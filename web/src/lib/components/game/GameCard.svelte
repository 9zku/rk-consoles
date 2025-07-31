<script lang="ts">
  import type { Game } from '../../types/game';
  import GameLauncher from './GameLauncher.svelte';
  
  export let game: Game;
  export let onClick: () => void = () => {};
  let isLauncherOpen = false;

  function handleClick() {
    isLauncherOpen = true;
    onClick();
  }
</script>

<button 
  class="w-full bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-all duration-300 cursor-pointer group text-left"
  on:click={handleClick}
  on:keydown={(e) => e.key === 'Enter' && handleClick()}
  aria-label={`Play ${game.title}`}
>
  <div class="relative aspect-video">
    <img src={game.thumbnailUrl} alt={game.title} class="w-full h-full object-cover" />
    {#if game.isNew}
      <div class="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">NEW</div>
    {/if}
    <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
      <span class="text-white text-lg font-medium">Play Now</span>
    </div>
  </div>
  <div class="p-4">
    <h3 class="text-white text-lg font-medium mb-1">{game.title}</h3>
    <p class="text-gray-300 text-sm line-clamp-2">{game.description}</p>
    <div class="mt-2 flex items-center gap-2">
      <span class="text-gray-400 text-xs">{game.year}</span>
      <span class="text-gray-400 text-xs">•</span>
      <span class="text-gray-400 text-xs">{game.genre}</span>
    </div>
  </div>
</button>

<GameLauncher {game} isOpen={isLauncherOpen} /> 