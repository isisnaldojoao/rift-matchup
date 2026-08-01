import fs from "fs/promises";

interface RiotChampion {
  id: string;
  name: string;
  tags: string[];
}

const ROLE_MAP: Record<string, string> = {
  Aatrox: "Top",
  Ahri: "Mid",
  Akali: "Mid",
  Akshan: "Mid",
  Alistar: "Support",
  Amumu: "Jungle",
  Anivia: "Mid",
  Annie: "Mid",
  Aphelios: "ADC",
  Ashe: "ADC",
  Aurora: "Mid",
  Azir: "Mid",
  Bard: "Support",
  "Bel'Veth": "Jungle",
  Blitzcrank: "Support",
  Brand: "Support",
  Braum: "Support",
  Briar: "Jungle",
  Caitlyn: "ADC",
  Camille: "Top",
  Cassiopeia: "Mid",
  "Cho'Gath": "Top",
  Corki: "Mid",
  Darius: "Top",
  Diana: "Jungle",
  "Dr. Mundo": "Top",
  Draven: "ADC",
  Ekko: "Jungle",
  Elise: "Jungle",
  Evelynn: "Jungle",
  Ezreal: "ADC",
  Fiddlesticks: "Jungle",
  Fiora: "Top",
  Fizz: "Mid",
  Galio: "Mid",
  Gangplank: "Top",
  Garen: "Top",
  Gnar: "Top",
  Gragas: "Jungle",
  Graves: "Jungle",
  Gwen: "Top",
  Hecarim: "Jungle",
  Heimerdinger: "Mid",
  Hwei: "Mid",
  Illaoi: "Top",
  Irelia: "Top",
  Ivern: "Jungle",
  Janna: "Support",
  "Jarvan IV": "Jungle",
  Jax: "Top",
  Jayce: "Top",
  Jhin: "ADC",
  Jinx: "ADC",
  "Kai'Sa": "ADC",
  Kalista: "ADC",
  Karma: "Support",
  Karthus: "Jungle",
  Kassadin: "Mid",
  Katarina: "Mid",
  Kayle: "Top",
  Kayn: "Jungle",
  Kennen: "Top",
  "Kha'Zix": "Jungle",
  Kindred: "Jungle",
  Kled: "Top",
  "Kog'Maw": "ADC",
  "K'Sante": "Top",
  "LeBlanc": "Mid",
  "Lee Sin": "Jungle",
  Leona: "Support",
  Lillia: "Jungle",
  Lissandra: "Mid",
  Lucian: "ADC",
  Lulu: "Support",
  Lux: "Support",
  Malphite: "Top",
  Malzahar: "Mid",
  Maokai: "Support",
  "Master Yi": "Jungle",
  Milio: "Support",
  "Miss Fortune": "ADC",
  Mordekaiser: "Top",
  Morgana: "Support",
  Naafiri: "Jungle",
  Nami: "Support",
  Nasus: "Top",
  Nautilus: "Support",
  Neeko: "Mid",
  Nidalee: "Jungle",
  Nilah: "ADC",
  Nocturne: "Jungle",
  "Nunu & Willump": "Jungle",
  Olaf: "Top",
  Orianna: "Mid",
  Ornn: "Top",
  Pantheon: "Top",
  Poppy: "Jungle",
  Pyke: "Support",
  Qiyana: "Mid",
  Quinn: "Top",
  Rakan: "Support",
  Rammus: "Jungle",
  "Rek'Sai": "Jungle",
  Rell: "Support",
  "Renata Glasc": "Support",
  Renekton: "Top",
  Rengar: "Jungle",
  Riven: "Top",
  Rumble: "Top",
  Ryze: "Mid",
  Samira: "ADC",
  Sejuani: "Jungle",
  Senna: "Support",
  Seraphine: "Support",
  Sett: "Top",
  Shaco: "Jungle",
  Shen: "Top",
  Shyvana: "Jungle",
  Singed: "Top",
  Sion: "Top",
  Sivir: "ADC",
  Skarner: "Jungle",
  Smolder: "ADC",
  Sona: "Support",
  Soraka: "Support",
  Swain: "Support",
  Sylas: "Mid",
  Syndra: "Mid",
  "Tahm Kench": "Support",
  Taliyah: "Mid",
  Talon: "Mid",
  Taric: "Support",
  Teemo: "Top",
  Thresh: "Support",
  Tristana: "ADC",
  Trundle: "Jungle",
  Tryndamere: "Top",
  "Twisted Fate": "Mid",
  Twitch: "ADC",
  Udyr: "Jungle",
  Urgot: "Top",
  Varus: "ADC",
  Vayne: "ADC",
  Veigar: "Mid",
  "Vel'Koz": "Support",
  Vex: "Mid",
  Vi: "Jungle",
  Viego: "Jungle",
  Viktor: "Mid",
  Vladimir: "Mid",
  Volibear: "Top",
  Warwick: "Jungle",
  Wukong: "Jungle",
  Xayah: "ADC",
  Xerath: "Support",
  "Xin Zhao": "Jungle",
  Yasuo: "Mid",
  Yone: "Mid",
  Yorick: "Top",
  Yuumi: "Support",
  Zac: "Jungle",
  Zed: "Mid",
  Zeri: "ADC",
  Ziggs: "ADC",
  Zilean: "Support",
  Zoe: "Mid",
  Zyra: "Support",
};

function getPrimaryType(tags: string[]) {
  if (tags.includes("Tank")) return "Tank";
  if (tags.includes("Mage")) return "AP Magic";
  if (tags.includes("Marksman")) return "AD Physical";
  if (tags.includes("Assassin")) return "AD Physical";
  if (tags.includes("Fighter")) return "AD Physical";
  return "AP Magic";
}

async function main() {
  const versions = await fetch(
    "https://ddragon.leagueoflegends.com/api/versions.json"
  ).then(r => r.json());

  const version = versions[0];

  const data = await fetch(
    `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`
  ).then(r => r.json());

  const champions = Object.values(data.data)
    .map((champ: any) => ({
      name: champ.name,
      role: ROLE_MAP[champ.name] ?? "Mid",
      primaryType: getPrimaryType(champ.tags),
      icon: `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champ.id}.png`,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const output =
`export interface Champion {
  name: string;
  role: string;
  primaryType: string;
  icon: string;
}

export const champions: Champion[] = ${JSON.stringify(champions, null, 2)};
`;

  await fs.writeFile("champions.ts", output);

  console.log(`✅ ${champions.length} campeões gerados!`);
}

main();