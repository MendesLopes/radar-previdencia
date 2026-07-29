import React from 'react';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  newAlertsCount: number;
  onOpenAlertModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  newAlertsCount,
  onOpenAlertModal,
}) => {
  return (
    <header>
      <div className="logo-container">
        <div className="logo-icon">R</div>
        <div className="logo-text">
          <h1>RADAR PREVIDENCIÁRIO</h1>
          <p>Previdência Complementar</p>
        </div>
      </div>

      <div className="header-actions">
        {newAlertsCount > 0 && (
          <div
            id="systemAlertIndicator"
            className="btn btn-primary"
            style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 0 10px rgba(239, 68, 68, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
            onClick={onOpenAlertModal}
          >
            <span
              className="alert-bell-icon"
              style={{
                animation: 'ring 1s infinite alternate',
                fontSize: '1rem',
              }}
            >
              🔔
            </span>
            <span id="alertCountBadge">{newAlertsCount} novas</span>
          </div>
        )}

        <button
          className="btn btn-theme-toggle"
          id="themeToggleBtn"
          title="Alternar Tema Claro/Escuro"
          onClick={onToggleTheme}
        >
          {theme === 'light' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
};
