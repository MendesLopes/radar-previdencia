import React from 'react';

interface StatsGridProps {
  total: number;
  cnpc: number;
  previc: number;
  highImpact: number;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  total,
  cnpc,
  previc,
  highImpact,
}) => {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-value" id="statTotal">{total}</div>
        <div className="stat-label">Total de Normas</div>
      </div>
      <div className="stat-card">
        <div className="stat-value" id="statCNPC">{cnpc}</div>
        <div className="stat-label">Resoluções CNPC</div>
      </div>
      <div className="stat-card">
        <div className="stat-value" id="statPREVIC">{previc}</div>
        <div className="stat-label">Atos PREVIC</div>
      </div>
      <div className="stat-card">
        <div className="stat-value" id="statHigh" style={{ color: 'var(--color-red)' }}>{highImpact}</div>
        <div className="stat-label">Alto Impacto</div>
      </div>
    </div>
  );
};
