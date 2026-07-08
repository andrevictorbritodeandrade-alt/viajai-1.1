const fs = require('fs');
const file = './components/GuideList.tsx';
let code = fs.readFileSync(file, 'utf8');

// Replace Ziraldo in am_ssa_aju
code = code.replace(
  '{ time: "14:00", activity: "Centro Histórico", details: "Elevador Lacerda e caminhada histórica pelo Pelourinho.", costType: "misto", costLabel: "⚖️ Misto: Passeio Público" }',
  '{ time: "14:00", activity: "Centro Histórico & Ziraldo", details: "Pelourinho e Exposição Mundo Zira no Museu de Arte da Bahia.", costType: "misto", costLabel: "⚖️ Misto: Grátis (MAB)", links: [{ title: "Exposição Ziraldo", url: "https://www.salvadordabahia.com/eventos/exposicao-mundo-zira-ziraldo-interativo/" }] }'
);

// Replace OSBA in am_ssa_aju
code = code.replace(
  '{ time: "19:00", activity: "Noite de Pizza", details: "Reunir lembranças e descansar.", costType: "pago", costLabel: "💳 Gasto: Alimentação" }',
  '{ time: "20:00", activity: "OSBA de Volta ao TCA", details: "Concerto da Folia! LEMBRETE: Comprar ingresso com antecedência, assentos limitados (TCA).", costType: "pago", costLabel: "💳 Gasto: Ingresso", links: [{ title: "Programação OSBA", url: "https://www.salvadordabahia.com/eventos/osba-de-volta-ao-tca-confira-programacao/" }, { title: "Comprar Ingresso", url: "https://bileto.sympla.com.br/event/123150/d/396363/s/2611439" }] }'
);

fs.writeFileSync(file, code);
