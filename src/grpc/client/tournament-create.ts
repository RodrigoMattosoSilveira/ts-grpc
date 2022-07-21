import { tournamentClient } from "./client";
import {TTournament} from "../../types/tournament-types";
import {MTournament, MTournamentPlayers, MTournamentRounds} from "../proto/tournament_pb";

// GRPC Client handler to create a Club Member
const tournamentCreate = (tTournament: TTournament): any => {
    console.log(`client/createTournament - Creating a record: ${JSON.stringify(tTournament)}`);
    return new Promise<MTournament>((resolve, reject) => {
        const mTournament: MTournament = new MTournament();
        mTournament.setId(tTournament.id);                                          // 1
        mTournament.setDirector(tTournament.director);   // 2
        mTournament.setName(tTournament.name);                      // 3
        mTournament.setStart(tTournament.start);                    // 4
        mTournament.setEnd(tTournament.end);                        // 5
        mTournament.setMaxPlayers(tTournament.maxPlayers);          // 6
        mTournament.setType(tTournament.type);                      // 7
        mTournament.setNumberOfRounds(tTournament.numberOfRounds);  // 8
        mTournament.setWinPoints(tTournament.winPoints);            // 9
        mTournament.setDrawPoints(tTournament.drawPoints);          // 10
        mTournament.setLossPoints(tTournament.lossPoints);          // 11
        mTournament.setPlayers(new MTournamentPlayers());           // 12
        mTournament.setRounds(new MTournamentRounds());             // 13
        mTournament.setStatus(tTournament.status);                  // 14
        tournamentClient.createTournament(mTournament, (err: any, createdTournament: any) => {
            if (err) reject(err);
            else resolve(createdTournament);
        });
    });
}

export default tournamentCreate;
