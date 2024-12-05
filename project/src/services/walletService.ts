const WALLET_STORAGE_KEY = 'wallet_connection';

export const walletService = {
  saveWalletConnection(address: string) {
    localStorage.setItem(WALLET_STORAGE_KEY, address);
  },

  getWalletConnection(): string | null {
    return localStorage.getItem(WALLET_STORAGE_KEY);
  },

  clearWalletConnection() {
    localStorage.removeItem(WALLET_STORAGE_KEY);
  }
}; 