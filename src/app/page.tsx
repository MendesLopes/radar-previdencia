'use client';

import React, { useState, useEffect } from 'react';
import { DEFAULT_LEGISLATIONS, LegislationItem } from '@/data/database';
import { Header } from '@/components/Header';
import { WelcomeCard } from '@/components/WelcomeCard';
import { StatsGrid } from '@/components/StatsGrid';
import { SidebarFilters } from '@/components/SidebarFilters';
import { LegislationCard } from '@/components/LegislationCard';
import { DetailPanel } from '@/components/DetailPanel';

const STORAGE_KEY = 'radar_previdencia_data';
const LAST_VIEWED_KEY = 'radar_previdencia_last_viewed';
const THEME_KEY = 'radar_theme';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [legislations, setLegislations] = useState<LegislationItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'diff'>('details');

  // Filtros
  const [search, setSearch] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedImpacts, setSelectedImpacts] = useState<string[]>([]);

  // Alertas
  const [newItems, setNewItems] = useState<LegislationItem[]>([]);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  // Inicialização no lado do cliente
  useEffect(() => {
    setMounted(true);

    // 1. Configura Tema
    const storedTheme = localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null;
    if (storedTheme) {
      setTheme(storedTheme);
      if (storedTheme === 'dark') {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    } else {
      document.body.classList.remove('dark-theme');
    }

    // 2. Carrega e Mescla Base de Dados (LocalStorage Cache Bypass)
    const stored = localStorage.getItem(STORAGE_KEY);
    let loadedData: LegislationItem[] = [];

    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_LEGISLATIONS));
      loadedData = DEFAULT_LEGISLATIONS;
    } else {
      try {
        const storedList: LegislationItem[] = JSON.parse(stored);
        const defaultMap = new Map(DEFAULT_LEGISLATIONS.map(item => [item.id, item]));
        const updatedList = storedList.map(storedItem => {
          const defaultItem = defaultMap.get(storedItem.id);
          if (defaultItem) {
            return { ...storedItem, ...defaultItem };
          }
          return storedItem;
        });

        const storedIds = new Set(storedList.map(item => item.id));
        DEFAULT_LEGISLATIONS.forEach(defaultItem => {
          if (!storedIds.has(defaultItem.id)) {
            updatedList.push(defaultItem);
          }
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
        loadedData = updatedList;
      } catch (e) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_LEGISLATIONS));
        loadedData = DEFAULT_LEGISLATIONS;
      }
    }
    setLegislations(loadedData);

    // 3. Verifica Alertas de Visita Recente
    const lastViewedStr = localStorage.getItem(LAST_VIEWED_KEY);
    if (!lastViewedStr) {
      // Primeira visita do usuário, marca a hora e não exibe alertas gigantes
      const now = new Date().toISOString();
      localStorage.setItem(LAST_VIEWED_KEY, now);
    } else {
      const lastViewedDate = new Date(lastViewedStr);
      const alerts = loadedData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate > lastViewedDate;
      });

      if (alerts.length > 0) {
        setNewItems(alerts);
        setIsAlertModalOpen(true);
      }
    }
  }, []);

  // Alternador de Temas
  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
    if (nextTheme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  };

  // Funções de filtro
  const handleSourceToggle = (source: string) => {
    setSelectedSources(prev =>
      prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source]
    );
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleImpactToggle = (impact: string) => {
    setSelectedImpacts(prev =>
      prev.includes(impact) ? prev.filter(i => i !== impact) : [...prev, impact]
    );
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedSources([]);
    setSelectedTypes([]);
    setSelectedImpacts([]);
  };

  // Fecha alertas e faz autofoco
  const handleCloseAlerts = () => {
    setIsAlertModalOpen(false);
    const now = new Date().toISOString();
    localStorage.setItem(LAST_VIEWED_KEY, now);

    if (newItems.length > 0) {
      setSelectedId(newItems[0].id);
      setActiveTab('details');

      setTimeout(() => {
        const detailPanelEl = document.getElementById('detailPanel');
        if (detailPanelEl) {
          detailPanelEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleSelectCard = (id: string) => {
    setSelectedId(id);
    setActiveTab('details');

    setTimeout(() => {
      const detailPanelEl = document.getElementById('detailPanel');
      if (detailPanelEl) {
        detailPanelEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Filtragem de Legislações
  const filteredLegislations = legislations.filter(item => {
    // 1. Busca por texto
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSummary = item.summary.toLowerCase().includes(q);
      const matchDetails = item.details.toLowerCase().includes(q);
      const matchAreas = item.areas.some(a => a.toLowerCase().includes(q));

      if (!matchTitle && !matchSummary && !matchDetails && !matchAreas) {
        return false;
      }
    }

    // 2. Filtro de Fontes/Órgão
    if (selectedSources.length > 0 && !selectedSources.includes(item.source)) {
      return false;
    }

    // 3. Filtro de Tipos
    if (selectedTypes.length > 0 && !selectedTypes.includes(item.type)) {
      return false;
    }

    // 4. Filtro de Impacto
    if (selectedImpacts.length > 0 && !selectedImpacts.includes(item.impact)) {
      return false;
    }

    return true;
  });

  // Cálculo de Estatísticas
  const stats = {
    total: legislations.length,
    highImpact: legislations.filter(item => item.impact === 'Alto').length,
    newAlertsCount: newItems.length,
  };

  const selectedItem = legislations.find(item => item.id === selectedId) || null;

  // Previne renderização incompatível no SSR
  if (!mounted) {
    return <div style={{ background: 'var(--bg-main)', minHeight: '100vh' }}></div>;
  }

  // Render do Modal de Alertas
  const renderAlertModal = () => {
    if (!isAlertModalOpen) return null;

    return (
      <div className="modal-overlay active" id="alertModal">
        <div className="modal" style={{ animation: 'slideUp 0.3s ease' }}>
          <div className="modal-header">
            <h3 className="modal-title">🔔 Novas Legislações Publicadas!</h3>
            <button
              className="btn btn-theme-toggle"
              style={{ border: 'none', fontSize: '1.2rem', background: 'none', cursor: 'pointer' }}
              onClick={() => setIsAlertModalOpen(false)}
            >
              ×
            </button>
          </div>
          <div className="modal-body" id="alertModalBody">
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.85rem' }}>
              Os seguintes normativos foram publicados desde a sua última visita:
            </p>
            {newItems.map(item => (
              <div
                key={item.id}
                className="new-item-row"
                style={{
                  padding: '1rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  marginBottom: '0.75rem',
                  background: 'var(--bg-main)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-pink)' }}>
                    {item.source} • {item.type}
                  </span>
                  <span
                    className={`badge ${
                      item.impact === 'Alto'
                        ? 'badge-impact'
                        : item.impact === 'Médio'
                        ? 'badge-impact medio'
                        : 'badge-impact baixo'
                    }`}
                  >
                    {item.impact} Impacto
                  </span>
                </div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {item.summary}
                </p>
              </div>
            ))}
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" id="closeAlertBtn" onClick={handleCloseAlerts}>
              Estou Ciente & Analisar Feeds
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        newAlertsCount={newItems.length}
        onOpenAlertModal={() => setIsAlertModalOpen(true)}
      />
      <WelcomeCard />
      <StatsGrid
        total={stats.total}
        highImpact={stats.highImpact}
        newAlertsCount={stats.newAlertsCount}
      />

      <div className="main-layout">
        <SidebarFilters
          search={search}
          onSearchChange={setSearch}
          selectedSources={selectedSources}
          onSourceToggle={handleSourceToggle}
          selectedTypes={selectedTypes}
          onTypeToggle={handleTypeToggle}
          selectedImpacts={selectedImpacts}
          onImpactToggle={handleImpactToggle}
          onClearFilters={handleClearFilters}
          hasActiveFilters={
            search !== '' ||
            selectedSources.length > 0 ||
            selectedTypes.length > 0 ||
            selectedImpacts.length > 0
          }
        />

        <main style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>
          {/* Feed de Normas */}
          <div>
            <div className="feed-header">
              <h2 className="feed-title">Atos Normativos e Resoluções</h2>
              <span className="feed-counter">
                {filteredLegislations.length} {filteredLegislations.length === 1 ? 'item' : 'itens'}
              </span>
            </div>

            <div className="feed-list">
              {filteredLegislations.length === 0 ? (
                <div className="empty-state" style={{ padding: '3rem 1.5rem' }}>
                  <div className="empty-state-icon">🔎</div>
                  <h3>Nenhum resultado encontrado</h3>
                  <p>Tente ajustar os termos de pesquisa ou remover alguns filtros para encontrar o que procura.</p>
                </div>
              ) : (
                filteredLegislations.map(item => (
                  <LegislationCard
                    key={item.id}
                    item={item}
                    isActive={selectedId === item.id}
                    onClick={() => handleSelectCard(item.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Painel de Detalhes do Item Ativo */}
          <DetailPanel
            item={selectedItem}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </main>
      </div>

      {renderAlertModal()}
    </div>
  );
}
