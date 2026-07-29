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
        return 'badge-danger';
      case 'Médio':
        return 'badge-warning';
      case 'Baixo':
        return 'badge-success';
      default:
        return '';
    }
  };

  return (
    <div
      className={`feed-card ${isActive ? 'active' : ''}`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="feed-card-header">
        <span className="feed-card-source">{item.source}</span>
        <span className="feed-card-date">{formatDate(item.date)}</span>
      </div>
      <h3 className="feed-card-title">{item.title}</h3>
      <p className="feed-card-summary">{item.summary}</p>
      <div className="feed-card-meta">
        <span className={`badge ${getImpactBadgeClass(item.impact)}`}>
          Impacto {item.impact}
        </span>
        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
          {item.areas.slice(0, 2).map((area) => (
            <span key={area} className="tag">
              {area}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
