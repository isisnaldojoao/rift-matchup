'use client';

import { useState } from 'react';
import { champions } from './data/championsData';

// --- Types ---
interface Champion {
  name: string;
  role: string;
  icon: string;
}

interface Runes {
  primary: string;
  keystone: string;
  secondary: string;
}

interface Tip {
  type: 'key' | 'warning' | 'info';
  text: string;
}

interface AnalysisData {
  champion: string;
  opponent: string;
  winRate: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  runes: Runes;
  coreBuild: string[];
  startingItems: string[];
  defensiveOption: string;
  tips: Tip[];
  taPedindo?: string;
  setup?: string;
  todaABuild?: string[];
  games?: string[];
  dicas?: string[];
  dificuldade?: 'Easy' | 'Medium' | 'Hard';
  'win rate'?: string;
}

const normalizeChampionName = (name: string) => name.trim().replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
const getChampionIcon = (name: string) => champions.find((champ) => normalizeChampionName(champ.name) === normalizeChampionName(name))?.icon;

// --- Subcomponents ---

const Sidebar = () => (
  <aside className="w-20 hidden md:flex flex-col items-center py-6 bg-[#0E121A] border-r border-white/5 z-20">
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 mb-10 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)] cursor-pointer">
      <span className="text-white font-black text-xl">L</span>
    </div>
    <nav className="flex flex-col gap-6 w-full items-center">
      <button className="p-3 text-cyan-400 bg-cyan-400/10 rounded-xl relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-400 rounded-r-full" />
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
      </button>
      <button className="p-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></button>
    </nav>
  </aside>
);

const Header = () => (
  <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#0A0D14]/80 backdrop-blur-md sticky top-0 z-10">
    <h2 className="text-xl font-bold text-white tracking-wide uppercase">
      Matchup <span className="text-cyan-400">Analyzer</span>
    </h2>
    <div className="hidden md:flex items-center bg-[#131823] border border-white/5 rounded-full px-4 py-2">
      <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
      <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Patch 14.8</span>
    </div>
  </header>
);

const HeroBanner = () => (
  <div className="relative w-full mt-6 h-[220px] md:h-[280px] rounded-2xl overflow-hidden shadow-2xl flex items-end p-8 border border-white/5">
    <div className="absolute inset-0 bg-[url('https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/bltcfa4652c8d383f56/5e28807d1acb700b46eb823d/01_2020_Key_Art.jpg')] bg-cover bg-center opacity-30 mix-blend-luminosity" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-[#0A0D14]/60 to-transparent" />
    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-transparent" />
    
    <div className="relative z-10 space-y-2">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 backdrop-blur-sm border border-white/10 mb-2">
        <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Summoner's Rift</span>
      </div>
      <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter drop-shadow-lg">
        Domine sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Rota</span>
      </h1>
      <p className="text-slate-400 text-sm max-w-xl">
        Selecione os campeões para acessar as estatísticas avançadas, runas otimizadas e dicas estratégicas em tempo real.
      </p>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[#131823] border border-white/5 border-dashed rounded-2xl h-64">
    <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4 border border-white/5 shadow-inner">
      <span className="text-2xl opacity-50">🔮</span>
    </div>
    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Nenhum Confronto Analisado</h3>
    <p className="text-slate-500 text-xs max-w-sm">
      Selecione os campeões no painel acima e gere a análise para visualizar estatísticas avançadas da rota.
    </p>
  </div>
);

const MatchupResults = ({ data }: { data: AnalysisData }) => {
  const diffColors = {
    Easy: 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]',
    Medium: 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]',
    Hard: 'text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]',
  };

  const championIcon = getChampionIcon(data.champion);
  const opponentIcon = getChampionIcon(data.opponent);
  const tipIcons = { key: '🎯', warning: '⚠️', info: '💡' };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 bg-[#131823] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 h-full relative z-10">
            <div className="space-y-1 text-center md:text-left">
              <h4 className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Predição de Confronto</h4>
              <div className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start text-white">
                <div className="flex items-center gap-3">
                  {championIcon ? (
                    <img src={championIcon} alt={data.champion} className="w-12 h-12 rounded-full border border-white/10 shadow-lg" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-sm text-slate-500">?</div>
                  )}
                  <span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">{data.champion}</span>
                </div>
                <span className="text-slate-600 text-sm">vs</span>
                <div className="flex items-center gap-3">
                  {opponentIcon ? (
                    <img src={opponentIcon} alt={data.opponent} className="w-12 h-12 rounded-full border border-white/10 shadow-lg" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-sm text-slate-500">?</div>
                  )}
                  <span className="text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.5)]">{data.opponent}</span>
                </div>
              </div>
              {data.taPedindo && (
                <p className="text-xs text-slate-400 mt-2">{data.taPedindo}</p>
              )}
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Win Rate</div>
                <div className="text-4xl font-black text-white">{data.winRate}</div>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-cyan-400 border-r-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)] rotate-45" />
            </div>
          </div>
        </div>

        <div className="bg-[#131823] border border-white/5 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2">Dificuldade</span>
          <h2 className={`text-4xl font-black uppercase tracking-tighter ${diffColors[data.difficulty] || 'text-zinc-400'}`}>
            {data.difficulty}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#131823] border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
            <h3 className="text-xs font-bold uppercase text-slate-300 tracking-wider flex items-center gap-2">
              <span className="text-cyan-400">⚡</span> Setup de Runas
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {data.setup && (
              <div className="bg-[#0B0E14] p-4 rounded-xl border border-white/5 text-sm text-slate-200">
                <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Setup</span>
                <div>{data.setup}</div>
              </div>
            )}
            <div className="flex justify-between items-center bg-[#0B0E14] p-4 rounded-xl border border-white/5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Principal</span>
              <span className="text-sm text-white font-bold">{data.runes.primary}</span>
            </div>
            <div className="flex justify-between items-center bg-cyan-950/20 p-4 rounded-xl border border-cyan-500/20">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Keystone</span>
              <span className="text-sm text-cyan-400 font-bold drop-shadow-md">{data.runes.keystone}</span>
            </div>
            <div className="flex justify-between items-center bg-[#0B0E14] p-4 rounded-xl border border-white/5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Secundária</span>
              <span className="text-sm text-slate-300 font-bold">{data.runes.secondary}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#131823] border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
            <h3 className="text-xs font-bold uppercase text-slate-300 tracking-wider flex items-center gap-2">
              <span className="text-amber-400">⚔️</span> Build Recomendada
            </h3>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Core Build</span>
              <div className="flex gap-3 flex-wrap">
                {data.coreBuild.map((item, idx) => (
                  <div key={idx} className="bg-[#0B0E14] border border-white/10 px-3 py-2 rounded-lg text-xs text-slate-200 font-semibold shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400/80" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            {data.todaABuild && data.todaABuild.length > 0 && (
              <div className="bg-[#0B0E14] p-4 rounded-xl border border-white/5">
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Toda a Build</span>
                <div className="flex flex-wrap gap-2">
                  {data.todaABuild.map((item, idx) => (
                    <span key={`allbuild-${idx}`} className="bg-slate-900/80 text-xs text-slate-200 px-3 py-2 rounded-full border border-white/10">{item}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0B0E14] p-3 rounded-xl border border-white/5">
                <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Iniciais</span>
                <div className="text-xs text-slate-300 font-medium">{data.startingItems.join(', ')}</div>
              </div>
              <div className="bg-[#0B0E14] p-3 rounded-xl border border-white/5">
                <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Defensivo</span>
                <div className="text-xs text-emerald-400 font-medium">{data.defensiveOption}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#131823] border border-white/5 rounded-2xl overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-blue-600" />
        <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
          <h3 className="text-xs font-bold uppercase text-slate-300 tracking-wider flex items-center gap-2">
            <span className="text-blue-400">📖</span> Game Guide & Dicas
          </h3>
        </div>
        <div className="p-6 space-y-6">
          {data.games && data.games.length > 0 && (
            <div className="bg-[#0B0E14] rounded-2xl p-4 border border-white/5">
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-3">Games</div>
              <ul className="space-y-3 text-sm text-slate-300">
                {data.games.map((game, idx) => (
                  <li key={`game-${idx}`} className="flex items-start gap-3 p-4 rounded-xl bg-[#0A0F18] border border-white/5">
                    <div className="mt-0.5 bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20 text-cyan-300">
                      🎮
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{game}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <ul className="space-y-4">
            {data.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-[#0B0E14] border border-white/5 hover:border-white/10 transition-colors">
                <div className="mt-0.5 bg-white/5 p-2 rounded-lg border border-white/5">
                  <span className="text-sm">{tipIcons[tip.type]}</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{tip.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---

export default function Home() {
  const [yourChamp, setYourChamp] = useState<string>('Ahri');
  const [opponentChamp, setOpponentChamp] = useState<string>('Zed');
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const isValidChampion = (name: string) => champions.some((champ) => normalizeChampionName(champ.name) === normalizeChampionName(name));

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (!isValidChampion(yourChamp)) {
      setError(`O campeão "${yourChamp}" não existe no League of Legends.`);
      return;
    }

    if (!isValidChampion(opponentChamp)) {
      setError(`O campeão "${opponentChamp}" não existe no League of Legends.`);
      return;
    }

    if (normalizeChampionName(yourChamp) === normalizeChampionName(opponentChamp)) {
      setError('Escolha um campeão diferente do oponente.');
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/analyze-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ champion: yourChamp, opponent: opponentChamp })
      });
      
      if (!response.ok) throw new Error('Falha na comunicação com o servidor');
      
      const result = await response.json();
      if (result.success) {
        setAnalysis(result.data);
        setNotice(result.notice || null);
      } else throw new Error('Erro ao processar matchup');
      
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro inesperado.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-300 font-sans flex overflow-hidden selection:bg-cyan-500/30">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Header />

        <div className="max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
          <HeroBanner />

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}
          {notice && (
            <div className="bg-blue-500/10 border border-blue-500/50 text-blue-200 px-4 py-3 rounded-xl text-sm font-medium">
              {notice}
            </div>
          )}

          <div className="bg-[#131823] border border-white/5 rounded-2xl p-6 shadow-xl relative">
            <form onSubmit={handleAnalyze} className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto] gap-6 items-end">
              
              <div className="space-y-3">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Seu Campeão
                </label>
                <input
                  value={yourChamp}
                  onChange={(e) => {
                    setYourChamp(e.target.value);
                    setError(null);
                    setNotice(null);
                  }}
                  placeholder="Digite seu campeão"
                  className="w-full rounded-xl border border-white/10 bg-[#0B0E14] px-5 py-4 text-sm font-semibold text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                />
              </div>

              <div className="hidden md:flex pb-4 justify-center items-center">
                <div className="w-10 h-10 rounded-full bg-[#0A0D14] border border-white/10 flex items-center justify-center relative">
                  <span className="text-xs font-black italic text-slate-500">VS</span>
                  <div className="absolute inset-0 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.05)]" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Oponente
                </label>
                <input
                  value={opponentChamp}
                  onChange={(e) => {
                    setOpponentChamp(e.target.value);
                    setError(null);
                    setNotice(null);
                  }}
                  placeholder="Digite o oponente"
                  className="w-full rounded-xl border border-white/10 bg-[#0B0E14] px-5 py-4 text-sm font-semibold text-white focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isAnalyzing || yourChamp === opponentChamp}
                className="w-full md:w-auto h-[54px] px-8 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] disabled:shadow-none flex items-center justify-center gap-2"
              >
                {isAnalyzing ? 'Analisando...' : 'Gerar Análise'}
              </button>
            </form>
          </div>

          {analysis ? <MatchupResults data={analysis} /> : <EmptyState />}
        </div>
      </main>
    </div>
  );
}