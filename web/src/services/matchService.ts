import { db } from '../firebase';
import { ref, get, set } from 'firebase/database';

const FIFA_API_URL = 'https://api.fifa.com/api/v3/calendar/matches';
const SEASON_ID = '285023'; // 2026 World Cup
const COMPETITION_ID = '17'; // FIFA World Cup

const teamTranslations: Record<string, string> = {
  Canada: 'Canadá',
  Mexico: 'México',
  USA: 'Estados Unidos',
  Argentina: 'Argentina',
  Brazil: 'Brasil',
  Colombia: 'Colômbia',
  Ecuador: 'Equador',
  Paraguay: 'Paraguai',
  Uruguay: 'Uruguai',
  Austria: 'Áustria',
  Belgium: 'Bélgica',
  'Bosnia and Herzegovina': 'Bósnia e Herzegovina',
  Croatia: 'Croácia',
  Czechia: 'República Tcheca',
  England: 'Inglaterra',
  France: 'França',
  Germany: 'Alemanha',
  Netherlands: 'Holanda',
  Norway: 'Noruega',
  Portugal: 'Portugal',
  Scotland: 'Escócia',
  Spain: 'Espanha',
  Sweden: 'Suécia',
  Switzerland: 'Suíça',
  Türkiye: 'Turquia',
  Algeria: 'Argélia',
  'Cape Verde': 'Cabo Verde',
  'Congo DR': 'Congo',
  "Côte d'Ivoire": 'Costa do Marfim',
  Egypt: 'Egito',
  Ghana: 'Gana',
  Morocco: 'Marrocos',
  Senegal: 'Senegal',
  'South Africa': 'África do Sul',
  Tunisia: 'Tunísia',
  Australia: 'Austrália',
  'IR Iran': 'Irã',
  Iraq: 'Iraque',
  Japan: 'Japão',
  Jordan: 'Jordânia',
  'Korea Republic': 'Coreia do Sul',
  Qatar: 'Catar',
  'Saudi Arabia': 'Arábia Saudita',
  Uzbekistan: 'Uzbequistão',
  Curaçao: 'Curaçau',
  Haiti: 'Haiti',
  Panama: 'Panamá',
  'New Zealand': 'Nova Zelândia',
};

const translateTeam = (name: string): string => {
  return teamTranslations[name] || name;
};

export interface Match {
  game: number;
  fifaId: string;
  round: string;
  group: string | null;
  date: string;
  timestamp: number;
  location: string;
  locationCity: string;
  locationCountry: string;
  home: string;
  homeName: string;
  homeScore: number;
  away: string;
  awayName: string;
  awayScore: number;
}

export interface MatchesData {
  [key: string]: Match;
}

interface FifaApiMatch {
  IdMatch: string;
  StageName: Array<{ Description: string }>;
  GroupName: Array<{ Description: string }> | null;
  Date: string;
  Stadium: {
    Name: Array<{ Description: string }>;
    CityName: Array<{ Description: string }>;
    IdCountry: string;
  };
  Home: {
    Abbreviation: string | null;
    ShortClubName: string | null;
    Score: number | null;
  };
  Away: {
    Abbreviation: string | null;
    ShortClubName: string | null;
    Score: number | null;
  };
  PlaceHolderA: string;
  PlaceHolderB: string;
}

interface FifaApiResponse {
  Results: FifaApiMatch[];
}

const fetchFromFifaApi = async (): Promise<MatchesData> => {
  const url = new URL(FIFA_API_URL);
  url.searchParams.set('idseason', SEASON_ID);
  url.searchParams.set('idcompetition', COMPETITION_ID);
  url.searchParams.set('count', '500');

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`FIFA API error: ${response.status}`);
  }

  const data = (await response.json()) as FifaApiResponse;
  return transformFifaData(data.Results);
};

const transformFifaData = (results: FifaApiMatch[]): MatchesData => {
  const matches: MatchesData = {};

  results.forEach((item, index) => {
    const game = index + 1;
    const round = item.StageName?.[0]?.Description ?? '';

    const group =
      item.GroupName?.[0]?.Description?.replace('Groupo ', '') ?? null;

    const home = item.Home?.Abbreviation ?? item.PlaceHolderA;

    const homeName = translateTeam(
      item.Home?.ShortClubName ?? item.PlaceHolderA
    );

    const away = item.Away?.Abbreviation ?? item.PlaceHolderB;

    const awayName = translateTeam(
      item.Away?.ShortClubName ?? item.PlaceHolderB
    );

    matches[game] = {
      game,
      fifaId: item.IdMatch,
      round,
      group,
      date: item.Date,
      timestamp: Math.floor(new Date(item.Date).getTime() / 1000),
      location: item.Stadium?.Name?.[0]?.Description ?? '',
      locationCity: item.Stadium?.CityName?.[0]?.Description ?? '',
      locationCountry: item.Stadium?.IdCountry ?? '',
      home,
      homeName,
      homeScore: item.Home?.Score ?? -1,
      away,
      awayName,
      awayScore: item.Away?.Score ?? -1,
    };
  });

  return matches;
};

export const fetchMatches = async (): Promise<MatchesData> => {
  const matchesRef = ref(db, 'matches');
  const snapshot = await get(matchesRef);

  if (!snapshot.exists()) {
    const matches = await fetchFromFifaApi();

    try {
      await set(matchesRef, matches);
    } catch (err) {
      console.warn('Could not save matches to database:', err);
    }

    return matches;
  }

  return snapshot.val() as MatchesData;
};

export const refreshMatches = async (): Promise<MatchesData> => {
  const matches = await fetchFromFifaApi();
  const matchesRef = ref(db, 'matches');
  await set(matchesRef, matches);
  return matches;
};

export const getMatch = async (
  gameNumber: string
): Promise<Match | null> => {
  const matchRef = ref(db, `matches/${gameNumber}`);
  const snapshot = await get(matchRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.val() as Match;
};