import {COLOR, STATUS} from "./other";

export type TTournamentPlayer = {
    id: string; // Club Member Id
    name: string; // Last, First
    score: number // tournament score, updated after each game
    clubRating: number; // club rate, set at the start of the tournament
    opponents: string[];
    lastTwoGamesColors: COLOR[] // last two game colors
    byeOrForfeit: number;
    status: boolean;
}
export const BYE_PLAYER: string = `BYE PLAYER`
export const ROUND_BYE_PLAYER: TTournamentPlayer = {
    id: BYE_PLAYER,
    name: BYE_PLAYER,
    score: 0,
    clubRating: 0,
    opponents: [],
    lastTwoGamesColors: [],
    byeOrForfeit: 0,
    status: true
}

export type TTournamentGame = {
    id: string; // 8 chars, random string
    tournamentId: string;
    roundId: string;
    whitePiecesPlayerId: string;
    whitePiecesPlayerScore: TOURNAMENT_SCORE;
    blackPiecesPlayerId: string;
    blackPiecesPlayerScore: TOURNAMENT_SCORE;
    status: STATUS; // (p)lanned(default), (u)nderway, (c)ompleted
}


export type TTournamentRound = {
    id: string;
    games: TTournamentGame[];
    status: STATUS;
}
export type TTournament = {
    id: string; // 8 chars, random string
    director: string; // Club Member ID
    name: string;
    start: string; // required since gRPC int64 are strings
    end: string; // required since gRPC int64 are strings
    maxPlayers: number;
    type: string;
    numberOfRounds: number;
    winPoints: number;
    drawPoints: number;
    lossPoints: number;
    players: TTournamentPlayer[];
    rounds: TTournamentRound[];
    status: STATUS
}

export type TOURNAMENT_SCORE = number;
export const TOURNAMENT_SCORE_WIN: TOURNAMENT_SCORE = 3;
export const TOURNAMENT_SCORE_BYE: TOURNAMENT_SCORE = 3;
export const TOURNAMENT_SCORE_FORFEIT: TOURNAMENT_SCORE = 3;
export const TOURNAMENT_SCORE_DRAW: TOURNAMENT_SCORE = 1;
export const TOURNAMENT_SCORE_LOSS: TOURNAMENT_SCORE = 0;

export type ITournamentType = string;
export const TOURNAMENT_TYPE_SWISS: ITournamentType = "swiss"