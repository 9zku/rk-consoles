<script lang="ts">
  import { onMount } from 'svelte';
  import type { Game } from '../types/game';
  import { fetchGames } from '../services/gameService';
  import { purchaseGame, isGamePurchased } from '../services/storeService';
  import GameCard from './game/GameCard.svelte';

  let games: Game[] = [];
  let purchasedGames: Set<string> = new Set();
  let loading = true;

  onMount(async () => {
    games = await fetchGames();
    for (const game of games) {
      if (await isGamePurchased(game.id)) {
        purchasedGames.add(game.id);
      }
    }
    loading = false;
  });

  async function handlePurchase(gameId: string) {
    const success = await purchaseGame(gameId);
    if (success) {
      purchasedGames.add(gameId);
    }
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold text-white mb-8">Game Store</h1>
  
  {#if loading}
    <div class="text-white text-center">Loading games...</div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {#each games as game (game.id)}
        <div class="relative">
          <GameCard {game} />
          <button
            class="absolute bottom-4 right-4 px-4 py-2 rounded-lg text-white font-medium transition-colors
              {purchasedGames.has(game.id) 
                ? 'bg-green-500 cursor-default' 
                : 'bg-blue-500 hover:bg-blue-600'}"
            on:click={() => !purchasedGames.has(game.id) && handlePurchase(game.id)}
            disabled={purchasedGames.has(game.id)}
          >
            {purchasedGames.has(game.id) ? 'Purchased' : 'Purchase'}
          </button>
        </div>
      {/each}
    </div>
  {/if}
</div> 