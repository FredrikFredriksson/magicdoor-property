import React, { useState } from "react";
import { useWallet, formatAddress } from "../../hooks/useWallet";
import WalletModal from "./WalletModal";

const WalletConnector = () => {
  const [showModal, setShowModal] = useState(false);
  const { wallets, account, balance, error, connect, disconnect } = useWallet();

  const handleSelect = async (provider) => {
    await connect(provider);
    setShowModal(false);
  };

  return (
    <>
      <div className="wallet-section">
        {account && (
          <span className="wallet-balance">
            {balance !== null ? `${balance} ETH` : "..."}
          </span>
        )}
        <button
          className={`wallet-btn${account ? " wallet-btn--connected" : ""}`}
          onClick={account ? disconnect : () => setShowModal(true)}
        >
          {account ? formatAddress(account) : "Connect Wallet"}
        </button>
        {error && <span className="wallet-error">{error}</span>}
      </div>

      {showModal && (
        <WalletModal
          wallets={wallets}
          onSelect={handleSelect}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default WalletConnector;
