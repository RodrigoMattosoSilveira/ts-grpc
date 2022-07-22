import {tournamentClient} from "./client";
import {MTournament, MTournamentUpdate} from "../proto/tournament_pb";

export const tournamentUpdate = (mTournament: MTournamentUpdate): any => {
    return new Promise<MTournament>((resolve, reject) => {
        console.log(`client/tournamentUpdate -Updating ${mTournament.toString()}\n`)
        tournamentClient.updateTournament(mTournament, (err: any, mTournament: MTournament) => {
            if (err) reject(err);
            else resolve(mTournament);
        });
    });
}
