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
    <div className="detail-panel" id="detailPanel">
      <div className="detail-header">
        <div className="badge-group" style={{ marginBottom: '0.75rem' }}>
          <span className={`badge ${sourceClass}`}>{item.source}</span>
          <span className="badge badge-type">{item.type}</span>
          <span className={`badge ${getImpactBadgeClass(item.impact)}`}>
            {item.impact} Impacto
          </span>
        </div>
        <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-title)', lineHeight: '1.3' }}>
          {item.title}
        </h2>
        
        <div className="detail-meta-grid">
          <div className="detail-meta-item">
            <div className="detail-meta-label">Publicação</div>
            <div className="detail-meta-val">{formatDate(item.date)}</div>
          </div>
          <div className="detail-meta-item">
            <div className="detail-meta-label">Vigência</div>
            <div className="detail-meta-val">{formatDate(item.effectiveDate)}</div>
          </div>
          <div className="detail-meta-item" style={{ gridColumn: 'span 2' }}>
            <div className="detail-meta-label">Escopo / Temas</div>
            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
              {item.areas.map(area => (
                <span key={area} className="area-tag">{area}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="detail-tabs">
        <button
          className={`detail-tab ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => onTabChange('details')}
        >
          Análise Prática
        </button>
        {item.diff && (
          <button
            className={`detail-tab ${activeTab === 'diff' ? 'active' : ''}`}
            onClick={() => onTabChange('diff')}
          >
            Comparativo de Redação
          </button>
        )}
      </div>

      <div className="detail-content" id="detailTabContent">
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

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
        <a
          href={item.officialLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ textDecoration: 'none' }}
        >
          Ver Publicação Oficial 🌐
        </a>
      </div>
    </div>
  );
};
