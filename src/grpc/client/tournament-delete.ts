import { tournamentClient} from "./client";
import {MTournament, MTournamentId} from "../proto/tournament_pb";

// export const runCreateClubMember = (): void => {
export const tournamentDelete = (id: string): any => {
    return new Promise<MTournament>((resolve, reject) => {
        const mDelete = new MTournamentId().setId(id);

        tournamentClient.deleteTournament(mDelete, (err: any, mDeleted: MTournament) => {
            if (err) reject(err);
            else resolve(mDeleted);
        });
    });
}
