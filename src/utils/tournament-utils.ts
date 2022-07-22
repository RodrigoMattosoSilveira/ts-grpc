import {
    MTournament, MTournamentGame, MTournamentGameColors, MTournamentGames,
    MTournamentPlayer,
    MTournamentPlayerOpponents,
    MTournamentPlayers, MTournamentRound, MTournamentRounds, MTournamentUpdate
} from "../grpc/proto/tournament_pb";
import {
    TTournament,
    TTournamentGame,
    TTournamentPlayer,
    TTournamentRound,
    TTournamentUpdate
} from "../types/tournament-types";

/**
 * Returns a Tournament object
 * @param m, a GRPC Tournament object
 */
export const tournament_m_to_t = (m: MTournament): TTournament => {
    return <TTournament>{
        id: m.getId(),
        director: m.getDirector(),
        name: m.getName(),
        start: m.getStart(),
        end: m.getEnd(),
        maxPlayers: m.getMaxPlayers(),
        type: m.getType(),
        numberOfRounds: m.getNumberOfRounds(),
        winPoints: m.getWinPoints(),
        drawPoints: m.getDrawPoints(),
        lossPoints: m.getLossPoints(),
        players: tournamentPlayer_m_to_t(m.getPlayers()),
        rounds: [],
        status: m.getStatus(),
    }
}
const tournamentPlayer_m_to_t = (mPlayers: MTournamentPlayers | undefined): TTournamentPlayer[] => {
    const tPlayers: TTournamentPlayer[] = [];
    if (mPlayers) {
        mPlayers.getTournamentPlayersList().forEach((mPlayer: MTournamentPlayer) => {
            // id: string; // Club Member Id
            // name: string; // Last, First
            // score: number // tournament score, updated after each game
            // clubRating: number; // club rate, set at the start of the tournament
            // opponents: string[];
            // lastTwoGamesColors: COLOR[] // last two game colors
            // byeOrForfeit: number;
            // status: boolean;
            const tPlayer: TTournamentPlayer = {
                id: mPlayer.getId(),
                name: mPlayer.getName(),
                score: mPlayer.getScore(),
                clubRating: mPlayer.getClubMemberRating(),
                opponents: oppponents_m_to_t(mPlayer.getOpponents()),
                lastTwoGamesColors: colors_m_to_t(mPlayer.getGameColors()),
                byeOrForfeit: mPlayer.getByeOrForfeit(),
                status: mPlayer.getStatus()
            }
            tPlayers.push(tPlayer);
        })
    }
    return tPlayers;
};
const oppponents_m_to_t = (mOpponents: MTournamentPlayerOpponents | undefined): string[] => {
    const tOpponents: string[] = [];
    mOpponents?.getDataList().forEach((mOpponent: string) => {
        tOpponents.push(mOpponent)
    });
    return tOpponents;
}
const colors_m_to_t = (mColors: MTournamentGameColors | undefined): string[] => {
    const tColors: string[] = [];
    mColors?.getColorsList().forEach((mColor: string) => {
        tColors.push(mColor)
    });
    return tColors;
}

export const tournament_t_to_m = (t: TTournament): MTournament => {
    console.log(`server/tournament_t_to_m - ${JSON.stringify(t)}`);
    const m: MTournament = new MTournament();
    m.setId(t.id);
    m.setDirector(t.director);
    m.setName(t.name);
    m.setStart(t.start);
    m.setEnd(t.end);
    m.setMaxPlayers(t.maxPlayers);
    m.setType(t.type);
    m.setNumberOfRounds(t.numberOfRounds);
    m.setWinPoints(t.winPoints);
    m.setDrawPoints(t.drawPoints);
    m.setLossPoints(t.lossPoints);
    m.setPlayers(tournamentPlayers_t_to_m(t.players));
    m.setRounds(tournamentRounds_t_to_m(t.rounds))
    m.setStatus(t.status)
    return m;
}

const tournamentPlayers_t_to_m = (players: TTournamentPlayer[]): MTournamentPlayers => {
    const mTournamentPlayers: MTournamentPlayers = new MTournamentPlayers();
    players.forEach((player: TTournamentPlayer) => {
        const mTournamentPlayer: MTournamentPlayer = new MTournamentPlayer()
        mTournamentPlayer.setId(player.id);
        mTournamentPlayer.setName(player.name);
        mTournamentPlayer.setScore(player.score);
        mTournamentPlayer.setClubMemberRating(player.clubRating)
        mTournamentPlayer.setOpponents(tournamentPlayerOpponents_t_to_m(player.opponents));
        mTournamentPlayer.setGameColors(tournamentGameColors_t_to_m(player.lastTwoGamesColors));
        mTournamentPlayer.setByeOrForfeit(player.byeOrForfeit);
        mTournamentPlayer.setStatus(player.status);
        mTournamentPlayers.addTournamentPlayers(mTournamentPlayer);
    })
    return mTournamentPlayers;
}

const tournamentPlayerOpponents_t_to_m = (opponents: string[]): MTournamentPlayerOpponents => {
    const mOpponents: MTournamentPlayerOpponents = new MTournamentPlayerOpponents();
    opponents.forEach((opponent: string) => {
        mOpponents.addData(opponent);
    })
    return mOpponents;
}

const tournamentGameColors_t_to_m = (lastTwoGamesColors: string[]): MTournamentGameColors => {
    const mColors: MTournamentGameColors = new MTournamentGameColors()
    lastTwoGamesColors.forEach((color: string) => {
        mColors.addColors(color);
    });
    return mColors;
}

const tournamentRounds_t_to_m = (rounds: TTournamentRound[]): MTournamentRounds => {
    const mRounds: MTournamentRounds = new MTournamentRounds()
    rounds.forEach((round: TTournamentRound) => {
        const mRound: MTournamentRound = new MTournamentRound();
        mRound.setId(round.id);
        mRound.setStatus(round.status)
        mRound.setGames(tournamentGames_t_to_m(round.games));
        mRounds.addRound(mRound);
    });
    return mRounds;
}

const tournamentGames_t_to_m = (games: TTournamentGame[]): MTournamentGames => {
    const mGames: MTournamentGames = new MTournamentGames()
    games.forEach((game: TTournamentGame) => {
        const mGame: MTournamentGame = new MTournamentGame();
        mGame.setId(game.id);
        mGame.setTournamentId(game.tournamentId);
        mGame.setTournamentRoundId(game.roundId);
        mGame.setWhitePiecesPlayerId(game.whitePiecesPlayerId)
        mGame.setWhitePiecesPlayerScore(game.whitePiecesPlayerScore);
        mGame.setBlackPiecesPlayerId(game.blackPiecesPlayerId);
        mGame.setBlackPiecesPlayerScore(game.blackPiecesPlayerScore);
        mGame.setStatus(game.status)
        mGames.addGames(mGame)
    })
    return mGames;
}

/**
 * Returns a GRPC Tournament Update object
 * @param t, a Tournament object, with optional attributes
 */
export const tournamentUpdate_t_to_m = (t: TTournamentUpdate): MTournamentUpdate => {
    const m: MTournamentUpdate = new MTournamentUpdate();
    m.setId(t.id);
    if (t['director']) {
        m.setDirector(t.director);
    }
    if (t['name']) {
        m.setName(t.name);
    }
    if (t['start']) {
        m.setStart(t.start);
    }
    if (t['end']) {
        m.setEnd(t.end);
    }
    if (t['maxPlayers']) {
        m.setMaxPlayers(t.maxPlayers);
    }
    if (t['type']) {
        m.setType(t.type);
    }
    if (t['numberOfRounds']) {
        m.setNumberOfRounds(t.numberOfRounds);
    }
    if (t['winPoints']) {
        m.setWinPoints(t.winPoints);
    }
    if (t['drawPoints']) {
        m.setDrawPoints(t.drawPoints);
    }
    if (t['lossPoints']) {
        m.setLossPoints(t.lossPoints);
    }
    if (t['status']) {
        m.setStatus(t.status);
    }
    return m;
}