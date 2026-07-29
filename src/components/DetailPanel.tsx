import React from 'react';
import { LegislationItem } from '@/data/database';

interface DetailPanelProps {
  item: LegislationItem | null;
  activeTab: 'details' | 'diff';
  onTabChange: (tab: 'details' | 'diff') => void;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({
  item,
  activeTab,
  onTabChange,
}) => {
  if (!item) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <h3>Nenhuma norma selecionada</h3>
        <p>Selecione um normativo na lista ao lado para conferir os detalhes atuariais, regulatórios e o comparativo de redação.</p>
      </div>
    );
  }

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
    <div className="detail-panel" id="detailPanel">
      <div className="detail-header">
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <span className="feed-card-source">{item.source}</span>
          <span className={`badge ${getImpactBadgeClass(item.impact)}`}>
            Impacto {item.impact}
          </span>
        </div>
        <h2 className="detail-title">{item.title}</h2>
        
        <div className="detail-meta-grid">
          <div className="meta-item">
            <span className="meta-label">Publicação</span>
            <span className="meta-value">{formatDate(item.date)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Vigência</span>
            <span className="meta-value">{formatDate(item.effectiveDate)}</span>
          </div>
          <div className="meta-item" style={{ gridColumn: 'span 2' }}>
            <span className="meta-label">Temas Relacionados</span>
            <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
              {item.areas.map(area => (
                <span key={area} className="tag">{area}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="detail-tabs">
        <button
          className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => onTabChange('details')}
        >
          Detalhes do Impacto
        </button>
        {item.diff && (
          <button
            className={`tab-btn ${activeTab === 'diff' ? 'active' : ''}`}
            onClick={() => onTabChange('diff')}
          >
            Comparativo de Redação
          </button>
        )}
      </div>

      <div className="detail-body">
        <div className="detail-tab-content" id="detailTabContent">
          {activeTab === 'details' ? (
            <>
              <div className="detail-section-title">Resumo Executivo</div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                {item.summary}
              </p>
              
              <div className="detail-section-title">O que muda na prática para as EFPCs?</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {item.details}
              </p>
            </>
          ) : (
            item.diff && (
              <>
                <div className="diff-target">
                  <strong>Foco da Alteração:</strong> {item.diff.targetArticle}
                </div>
                
                <div className="diff-container">
                  <div className="diff-box old">
                    <div className="diff-title old">
                      <span>❌ Redação Anterior</span>
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{item.diff.oldText}</div>
                  </div>
                  
                  <div className="diff-box new">
                    <div className="diff-title new">
                      <span>✅ Redação Atualizada</span>
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{item.diff.newText}</div>
                  </div>
                </div>
                
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem', fontStyle: 'italic' }}>
                  * O texto destacado em verde representa as inclusões e flexibilizações aprovadas no novo normativo. O texto em vermelho representa as regras revogadas.
                </p>
              </>
            )
          )}
        </div>
      </div>

      <div className="detail-footer">
        <a
          href={item.officialLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ textDecoration: 'none' }}
        >
          Ver Publicação Oficial 🔗
        </a>
      </div>
    </div>
  );
};
