import {MTournament} from "../grpc/proto/tournament_pb";
import {TTournament} from "../types/tournament-types";

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
        players: [],
        rounds: [],
        status: m.getStatus(),
    }
}
