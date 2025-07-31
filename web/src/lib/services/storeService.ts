import { writable } from 'svelte/store';
import type { Game } from '../types/game';
import { fetchGames } from './gameService';

const purchasedGames = writable<Game[]>([]);
const cartItems = writable<Game[]>([]);

if (typeof window !== 'undefined') {
  localStorage.removeItem('purchasedGames');
}

if (typeof window !== 'undefined') {
  const savedGames = localStorage.getItem('purchasedGames');
  if (savedGames) {
    purchasedGames.set(JSON.parse(savedGames));
  }
}

purchasedGames.subscribe(games => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('purchasedGames', JSON.stringify(games));
  }
});

export async function purchaseGame(gameId: string): Promise<boolean> {
  const games = await fetchGames();
  const game = games.find(g => g.id === gameId);
  
  if (!game) return false;
  
  purchasedGames.update(games => {
    if (!games.some(g => g.id === gameId)) {
      return [...games, game];
    }
    return games;
  });
  
  return true;
}

export async function getPurchasedGames(): Promise<Game[]> {
  let games: Game[] = [];
  const unsubscribe = purchasedGames.subscribe(value => {
    games = value;
  });
  unsubscribe();
  return games;
}

export async function isGamePurchased(gameId: string): Promise<boolean> {
  let isPurchased = false;
  const unsubscribe = purchasedGames.subscribe(games => {
    isPurchased = games.some(game => game.id === gameId);
  });
  unsubscribe();
  return isPurchased;
}

export function addToCart(game: Game) {
  cartItems.update(items => {
    if (!items.some(item => item.id === game.id)) {
      return [...items, game];
    }
    return items;
  });
}

export function removeFromCart(gameId: string) {
  cartItems.update(items => items.filter(item => item.id !== gameId));
}

export function clearCart() {
  cartItems.set([]);
}

export function getCartItems(): Game[] {
  let items: Game[] = [];
  const unsubscribe = cartItems.subscribe(value => {
    items = value;
  });
  unsubscribe();
  return items;
}

export async function purchaseCartItems(): Promise<boolean> {
  const items = getCartItems();
  let success = true;
  
  for (const game of items) {
    const result = await purchaseGame(game.id);
    if (!result) {
      success = false;
      break;
    }
  }
  
  if (success) {
    clearCart();
  }
  
  return success;
} 