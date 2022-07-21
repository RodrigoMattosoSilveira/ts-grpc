import {tournamentClient} from "./client";
import {MTournament, MTournamentEmpty} from "../proto/tournament_pb";

export const tournamentsRead = (empty: MTournamentEmpty): any => {
    return new Promise<MTournament[]>((resolve, reject) => {
        const stream = tournamentClient.readTournaments(empty);
        const mTournaments: MTournament[] = [];
        stream.on("data", (mTournament: MTournament) => mTournaments.push(mTournament));
        stream.on("error", reject);
        stream.on("end", () => resolve(mTournaments));
    });
}

