import React from 'react';

export const WelcomeCard: React.FC = () => {
  return (
    <div className="welcome-card">
      <div className="welcome-icon">👋</div>
      <div className="welcome-text">
        <h2>Bem-vindo ao Radar de Legislação da Previdência Complementar</h2>
        <p>
          Este painel consolida alterações nas regras das Entidades Fechadas de Previdência Complementar (EFPCs). Clique em qualquer item do feed para ver o impacto atuarial, financeiro e regulatório em detalhes. Para normas atualizadas, abra a aba <strong>Comparativo de Redação</strong> para ver o que mudou na íntegra.
        </p>
      </div>
    </div>
  );
};
