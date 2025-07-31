<script lang="ts">
  import type { Game } from '../types/game';
  import GameCard from './game/GameCard.svelte';
  import GameLauncher from './game/GameLauncher.svelte';
  import { getPurchasedGames, addToCart, removeFromCart, getCartItems, purchaseCartItems } from '../services/storeService';
  import { onMount } from 'svelte';

  export let config: any = null;

  let games: Game[] = [];
  let loading = true;
  let error: string | null = null;
  let selectedGame: Game | null = null;
  let isStoreView = false;
  let isCartOpen = false;
  let cartItems: Game[] = [];

  onMount(async () => {
    await loadGames();
    cartItems = getCartItems();
  });

  async function loadGames() {
    loading = true;
    try {
      if (isStoreView) {
        games = config?.games || [];
      } else {
        games = await getPurchasedGames();
      }
    } catch (e) {
      error = 'Failed to load games';
      console.error(e);
    } finally {
      loading = false;
    }
  }

  function handleAddToCart(game: Game) {
    addToCart(game);
    cartItems = getCartItems();
  }

  function handleRemoveFromCart(gameId: string) {
    removeFromCart(gameId);
    cartItems = getCartItems();
  }

  async function handlePurchaseCart() {
    const success = await purchaseCartItems();
    if (success) {
      isCartOpen = false;
      cartItems = [];
      await loadGames();
    }
  }

  function handleGameSelect(game: Game) {
    if (!isStoreView) {
      selectedGame = game;
    }
  }
</script>

<div class="flex items-center justify-center min-h-screen">
  <div class="w-[1000px] h-[600px] bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 rounded-lg shadow-xl relative">
    {#if !selectedGame}
      <div class="absolute top-6 left-6 flex items-center gap-4">
        <div class="flex items-center gap-4">
          <button
            class="text-2xl {!isStoreView ? 'text-white' : 'text-white/60 hover:text-white'}"
            on:click={() => {
              isStoreView = false;
              loadGames();
            }}
          >
            Games
          </button>
          <button
            class="text-2xl {isStoreView ? 'text-white' : 'text-white/60 hover:text-white'}"
            on:click={() => {
              isStoreView = true;
              loadGames();
            }}
          >
            Store
          </button>
        </div>
      </div>
      <div class="absolute top-6 right-6 flex items-center gap-4">
        <button
          class="relative w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          on:click={() => isCartOpen = !isCartOpen}
          aria-label="Shopping cart"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {#if cartItems.length > 0}
            <span class="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartItems.length}
            </span>
          {/if}
        </button>
        <button
          class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          aria-label="Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        <button
          class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          aria-label="User profile"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      </div>
      
      <!-- Cart Panel -->
      {#if isCartOpen}
        <div class="absolute top-20 right-6 w-80 bg-white/10 backdrop-blur-lg rounded-lg shadow-xl p-4 z-50">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-white text-lg font-medium">Cart</h3>
            <button
              class="text-white/60 hover:text-white"
              on:click={() => isCartOpen = false}
              aria-label="Close cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {#if cartItems.length === 0}
            <p class="text-white/60 text-center py-4">Your cart is empty</p>
          {:else}
            <div class="space-y-3 max-h-96 overflow-y-auto">
              {#each cartItems as item (item.id)}
                <div class="flex items-center gap-3 bg-white/5 rounded-lg p-2">
                  <img src={item.thumbnailUrl} alt={item.title} class="w-12 h-12 object-cover rounded" />
                  <div class="flex-1">
                    <h4 class="text-white text-sm font-medium">{item.title}</h4>
                    <p class="text-white/60 text-xs">{item.genre}</p>
                  </div>
                  <button
                    class="text-white/60 hover:text-white"
                    on:click={() => handleRemoveFromCart(item.id)}
                    aria-label={`Remove ${item.title} from cart`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              {/each}
            </div>
            
            <button
              class="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              on:click={handlePurchaseCart}
              aria-label="Purchase all items in cart"
            >
              Purchase All
            </button>
          {/if}
        </div>
      {/if}
      
      <!-- Game Grid -->
      <div class="absolute top-24 left-6 right-6 bottom-6 overflow-y-auto scrollbar-hide">
        {#if loading}
          <div class="flex items-center justify-center h-full">
            <div class="text-white">Loading games...</div>
          </div>
        {:else if error}
          <div class="flex items-center justify-center h-full">
            <div class="text-red-400">{error}</div>
          </div>
        {:else if !isStoreView && games.length === 0}
          <div class="flex flex-col items-center justify-center h-full text-white">
            <p class="text-xl mb-4">No games purchased yet</p>
            <button
              class="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
              on:click={() => {
                isStoreView = true;
                loadGames();
              }}
            >
              Visit Store
            </button>
          </div>
        {:else}
          <div class="grid grid-cols-3 gap-6">
            {#each games as game (game.id)}
              <div class="relative group">
                <GameCard 
                  {game} 
                  onClick={() => {
                    if (isStoreView) {
                      handleAddToCart(game);
                    } else {
                      handleGameSelect(game);
                    }
                  }} 
                />
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {:else}
      <GameLauncher game={selectedGame} isOpen={true} onClose={() => selectedGame = null} />
    {/if}
  </div>
</div>
