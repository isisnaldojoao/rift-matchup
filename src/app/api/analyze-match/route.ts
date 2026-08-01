import { openai } from '@/lib/openai';
import { champions, getMatchup, MatchupDetails } from '../../data/championsData';

type AIResponse = {
  'ta pedindo'?: string;
  dificuldade?: string;
  'win rate'?: string;
  setup?: string;
  'toda a build'?: string[] | string;
  games?: string[] | string;
  dicas?: string[] | string;
};

function normalizeStringArray(value: string[] | string | undefined): string[] | undefined {
  if (!value) return undefined;
  if (Array.isArray(value)) return value.map(item => item?.toString().trim()).filter(Boolean);
  return value
    .toString()
    .split(/\n|\r|\,|\;|\-/)
    .map(item => item.trim())
    .filter(Boolean);
}

function normalizeChampionName(name: string): string {
  return name.trim().replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}

function findChampionName(name: string): string | null {
  const normalizedName = normalizeChampionName(name);
  const champion = champions.find((champ) => normalizeChampionName(champ.name) === normalizedName);
  return champion ? champion.name : null;
}

export async function POST(request: Request) {
  try {
    const { champion, opponent } = await request.json();

    if (!champion || !opponent) {
      return Response.json({ success: false, error: 'Missing champion or opponent parameters' }, { status: 400 });
    }

    const championName = findChampionName(champion);
    const opponentName = findChampionName(opponent);

    if (!championName) {
      return Response.json({ success: false, error: `O campeão "${champion}" não existe no League of Legends.` }, { status: 400 });
    }

    if (!opponentName) {
      return Response.json({ success: false, error: `O campeão "${opponent}" não existe no League of Legends.` }, { status: 400 });
    }

    if (championName === opponentName) {
      return Response.json({ success: false, error: 'Escolha um campeão diferente do oponente.' }, { status: 400 });
    }

    const prompt = `Você é um analista de League of Legends. Responda apenas com JSON válido e use estas chaves exatas: "ta pedindo", "dificuldade", "win rate", "setup", "toda a build", "games" e "dicas". ` +
      `Os valores devem ser úteis para um matchup de League of Legends entre ${championName} e ${opponentName}. ` +
      `Não adicione texto extra fora do JSON. Use a forma de valor mais direta possível. ` +
      `Exemplo de resposta válida:\n` +
      `{"ta pedindo":"Análise do matchup Ahri vs Zed","dificuldade":"Hard","win rate":"48.2%","setup":"Domination / Electrocute / Sorcery (Transcendence)","toda a build":["Youmuu's Ghostblade","Black Cleaver","Serylda's Grudge","Edge of Night"],"games":["Bait out Charm antes de entrar","Controle a wave antes do nível 6"],"dicas":["Use o W para reposicionamento","Não perca trades se ele tiver Death Mark pronto"]}`;

    let content = '{}';
    let notice: string | null = null;

    try {
      const completion = await openai.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      });

      content = completion.choices?.[0]?.message?.content || '{}';
    } catch (error: any) {
      console.error('Erro IA Groq:', error);
      notice = `IA indisponível, usando dados locais. Motivo: ${error?.message ?? 'Erro desconhecido'}`;
    }

    let parsedData: AIResponse;
    try {
      parsedData = JSON.parse(content);
    } catch (e) {
      console.error('Erro ao fazer parse do JSON da IA:', content);
      parsedData = {
        'ta pedindo': `Análise de ${champion} vs ${opponent}`,
        dificuldade: 'Medium',
        'win rate': '50.0%',
        setup: 'Use o matchup padrão',
        'toda a build': ['Doran Blade', 'Health Potion', 'Core Item', 'Defensive Item'],
        games: ['Use a wave control', 'Procure trades curtos'],
        dicas: ['Ajuste seu posicionamento', 'Não force lutas sem visão']
      };
    }

    const fallbackData = getMatchup(champion, opponent);
    const build = normalizeStringArray(parsedData['toda a build']) ?? fallbackData.coreBuild;
    const games = normalizeStringArray(parsedData.games) ?? [];
    const dicas = normalizeStringArray(parsedData.dicas) ?? fallbackData.tips;

    return Response.json({
      success: true,
      notice,
      data: {
        champion,
        opponent,
        difficulty: parsedData.dificuldade ?? fallbackData.difficulty,
        'win rate': parsedData['win rate'] ?? fallbackData.winRate,
        winRate: parsedData['win rate'] ?? fallbackData.winRate,
        runes: fallbackData.runes,
        startingItems: fallbackData.startingItems,
        coreBuild: build,
        defensiveOption: fallbackData.defensiveOption,
        tips: dicas.map(text => ({ type: 'info' as const, text })),
        taPedindo: parsedData['ta pedindo'] ?? `Análise de ${champion} vs ${opponent}`,
        setup: parsedData.setup,
        todaABuild: build,
        games,
        dicas
      }
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to analyze match' }, { status: 500 });
  }
}
