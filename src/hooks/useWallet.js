import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { ethers } from "ethers";

export const formatAddress = (addr) =>
  `${addr.slice(0, 6)}...${addr.slice(-4)}`;

// Wallet store lives at module level — discovered once on import, not per render.
let _wallets = [];
const _listeners = new Set();

// EIP-6963: ask all installed wallets to announce themselves, collect each one.
window.addEventListener("eip6963:announceProvider", ({ detail }) => {
  if (!_wallets.some((w) => w.info.uuid === detail.info.uuid)) {
    _wallets = [..._wallets, detail];
    _listeners.forEach((l) => l());
  }
});
window.dispatchEvent(new Event("eip6963:requestProvider"));

const subscribeWallets = (listener) => {
  _listeners.add(listener);
  return () => _listeners.delete(listener);
};

export function useWallet() {
  // Reads from the module-level store; re-renders when a new wallet is announced.
  const wallets = useSyncExternalStore(subscribeWallets, () => _wallets);

  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [activeProvider, setActiveProvider] = useState(null);
  const [error, setError] = useState(null);

  // Wraps the raw wallet provider with ethers, then fetches the ETH balance.
  const fetchBalance = useCallback(async (address, rawProvider) => {
    try {
      const provider = new ethers.BrowserProvider(rawProvider);
      const raw = await provider.getBalance(address);
      setBalance(parseFloat(ethers.formatEther(raw)).toFixed(4));
    } catch {
      setBalance(null);
    }
  }, []);

  // Triggers the wallet's connect popup, then stores the account and balance.
  const connect = useCallback(async (rawProvider) => {
    try {
      setError(null);
      const provider = new ethers.BrowserProvider(rawProvider);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      setActiveProvider(rawProvider);
      await fetchBalance(accounts[0], rawProvider);
    } catch (err) {
      setError(err.code === 4001 ? "Connection rejected." : "Failed to connect.");
    }
  }, [fetchBalance]);

  const disconnect = useCallback(() => {
    setAccount(null);
    setBalance(null);
    setActiveProvider(null);
    setError(null);
  }, []);

  // Keep state in sync when the user switches account or network inside their wallet.
  useEffect(() => {
    if (!activeProvider) return;

    const onAccountsChanged = async (accounts) => {
      if (!accounts.length) return disconnect();
      setAccount(accounts[0]);
      await fetchBalance(accounts[0], activeProvider);
    };

    const onChainChanged = () => {
      const addr = activeProvider.selectedAddress;
      if (addr) fetchBalance(addr, activeProvider);
    };

    activeProvider.on("accountsChanged", onAccountsChanged);
    activeProvider.on("chainChanged", onChainChanged);

    return () => {
      activeProvider.removeListener("accountsChanged", onAccountsChanged);
      activeProvider.removeListener("chainChanged", onChainChanged);
    };
  }, [activeProvider, disconnect, fetchBalance]);

  return { wallets, account, balance, error, connect, disconnect };
}
