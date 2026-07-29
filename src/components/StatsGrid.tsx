import React from 'react';

interface StatsGridProps {
  total: number;
  highImpact: number;
  newAlertsCount: number;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  total,
  highImpact,
  newAlertsCount,
}) => {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-label">Total de Normas</div>
        <div className="stat-val" id="statTotalVal">{total}</div>
        <div className="stat-sub">Leis, Decretos e Normas</div>
      </div>
      
      <div className="stat-card red">
        <div className="stat-label">Alto Impacto</div>
        <div className="stat-val" id="statHighVal">{highImpact}</div>
        <div className="stat-sub" style={{ color: 'var(--color-red)' }}>Atenção imediata recomendada</div>
      </div>
      
      <div className="stat-card gold">
        <div className="stat-label">Novidades Não Lidas</div>
        <div className="stat-val" id="statNewVal">{newAlertsCount}</div>
        <div className="stat-sub" id="statNewSubText">Publicadas desde a última leitura</div>
      </div>
      
      <div className="stat-card green">
        <div className="stat-label">Último Sync</div>
        <div className="stat-val" style={{ fontSize: '1.5rem', paddingTop: '0.5rem' }} id="statSyncDate">Hoje</div>
        <div className="stat-sub positive">✓ Conexão oficial estável</div>
      </div>
    </div>
  );
};
