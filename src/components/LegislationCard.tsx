import React from 'react';
import { LegislationItem } from '@/data/database';

interface LegislationCardProps {
  item: LegislationItem;
  isActive: boolean;
  onClick: () => void;
}

export const LegislationCard: React.FC<LegislationCardProps> = ({
  item,
  isActive,
  onClick,
}) => {
  // Converte data americana YYYY-MM-DD para DD/MM/YYYY
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const getImpactBadgeClass = (impact: string) => {
    switch (impact) {
      case 'Alto':
        return 'badge-impact';
      case 'Médio':
        return 'badge-impact medio';
      case 'Baixo':
        return 'badge-impact baixo';
      default:
        return '';
    }
  };

  const sourceClass = item.source.toLowerCase() === 'cnpc' ? 'badge-source cnpc' : 'badge-source';

  return (
    <div
      className={`legislation-card ${isActive ? 'active' : ''}`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-top">
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <span className={`badge ${sourceClass}`}>{item.source}</span>
          <span className="badge badge-type">{item.type}</span>
        </div>
        <span className="card-date">{formatDate(item.date)}</span>
      </div>
      <h3 className="card-title">{item.title}</h3>
      <p className="card-summary">{item.summary}</p>
      <div className="card-bottom">
        <span className={`badge ${getImpactBadgeClass(item.impact)}`}>
          {item.impact} Impacto
        </span>
        <div className="card-areas">
          {item.areas.slice(0, 2).map((area) => (
            <span key={area} className="area-tag">
              {area}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
