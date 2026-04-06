import React from "react";

const WalletModal = ({ wallets, onSelect, onClose }) => (
  <div className="wallet-overlay" onClick={onClose}>
    <div className="wallet-modal" onClick={(e) => e.stopPropagation()}>
      <div className="wallet-modal-header">
        <h5>Select a Wallet</h5>
        <button className="wallet-modal-close" onClick={onClose}>✕</button>
      </div>

      {wallets.length === 0 ? (
        <p className="wallet-modal-empty">
          No wallets detected. Please install MetaMask or another browser wallet extension.
        </p>
      ) : (
        <ul className="wallet-modal-list">
          {wallets.map(({ info, provider }) => (
            <li key={info.uuid} onClick={() => onSelect(provider)}>
              <img src={info.icon} alt={info.name} width={32} height={32} />
              <span>{info.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

export default WalletModal;
