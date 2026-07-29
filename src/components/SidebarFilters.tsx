import React from 'react';

interface SidebarFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedSources: string[];
  onSourceToggle: (val: string) => void;
  selectedTypes: string[];
  onTypeToggle: (val: string) => void;
  selectedImpacts: string[];
  onImpactToggle: (val: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  search,
  onSearchChange,
  selectedSources,
  onSourceToggle,
  selectedTypes,
  onTypeToggle,
  selectedImpacts,
  onImpactToggle,
  onClearFilters,
  hasActiveFilters,
}) => {
  const sources = ['CNPC', 'PREVIC', 'Planalto'];
  const types = ['Resolução', 'Portaria', 'Lei', 'Decreto', 'Notícia'];
  const impacts = ['Alto', 'Médio', 'Baixo'];

  return (
    <aside className="sidebar">
      <div className="filter-group">
        <h3 className="filter-title">🔍 Pesquisar</h3>
        <input
          type="text"
          className="search-input"
          placeholder="Ex: portabilidade, taxa..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <h3 className="filter-title">🏢 Órgão Emissor</h3>
        <div className="chip-container" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {sources.map((src) => {
            const active = selectedSources.includes(src);
            return (
              <button
                key={src}
                className={`filter-chip ${active ? 'active' : ''}`}
                onClick={() => onSourceToggle(src)}
              >
                {src}
              </button>
            );
          })}
        </div>
      </div>

      <div className="filter-group">
        <h3 className="filter-title">📄 Tipo de Ato</h3>
        <div className="chip-container" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {types.map((t) => {
            const active = selectedTypes.includes(t);
            return (
              <button
                key={t}
                className={`filter-chip ${active ? 'active' : ''}`}
                onClick={() => onTypeToggle(t)}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      <div className="filter-group">
        <h3 className="filter-title">⚡ Impacto Regulatório</h3>
        <div className="chip-container" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {impacts.map((imp) => {
            const active = selectedImpacts.includes(imp);
            return (
              <button
                key={imp}
                className={`filter-chip ${active ? 'active' : ''}`}
                onClick={() => onImpactToggle(imp)}
              >
                {imp}
              </button>
            );
          })}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          className="btn"
          style={{
            marginTop: '1rem',
            width: '100%',
            justifyContent: 'center',
            borderColor: 'var(--color-pink)',
            color: 'var(--color-pink)',
          }}
          onClick={onClearFilters}
        >
          Limpar Filtros 🗙
        </button>
      )}
    </aside>
  );
};
