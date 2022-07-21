import { MTournament, MTournamentId } from "../proto/tournament_pb";
import {tournamentClient} from "./client";

export const tournamentRead = (tournamentId: string): any => {
    console.log(`client/tournamentRead - reading a record: ${tournamentId}/n`);
    return new Promise<MTournament>((resolve, reject) => {
        const mTournamentId = new MTournamentId().setId(tournamentId);

       tournamentClient.readTournament(mTournamentId, (err: any, tournament: any) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(tournament);
            }
        });
    });
}


