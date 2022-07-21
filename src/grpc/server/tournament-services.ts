import {ISTournamentServer} from "../proto/tournament_grpc_pb";
import {sendUnaryData, ServerUnaryCall, ServerWritableStream} from "@grpc/grpc-js";
import {
    MTournament, MTournamentId,
} from "../proto/tournament_pb";
import {TTournament} from "../../types/tournament-types";
import {TClubMember} from "../../types/club-member-type";
import fs from "fs";
import {tournament_t_to_m} from "../../utils/tournament-utils";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";

const TOURNAMENT_RAW_FN    = __dirname + '/../../../data/tournaments-raw.json';
const TOURNAMENT_EDITED_FN = __dirname + '/../../../data/tournaments-edited.json';

export class TournamentServices implements ISTournamentServer {
     /**
     * Tournament operations
     */

     // Create a tournament
    createTournament (call: ServerUnaryCall<MTournament, any>, callback: sendUnaryData<MTournament>): void {
        console.log(`server/createTournament - Creating a record`);
        const mTournament: MTournament = call.request;
        const tTournament: TTournament = {
            id: mTournament.getId(),
            director: mTournament.getDirector(),
            name: mTournament.getName(),
            start: mTournament.getStart(),
            end: mTournament.getEnd(),
            maxPlayers: mTournament.getMaxPlayers(),
            type: mTournament.getType(),
            numberOfRounds: mTournament.getNumberOfRounds(),
            winPoints: mTournament.getWinPoints(),
            drawPoints: mTournament.getDrawPoints(),
            lossPoints: mTournament.getLossPoints(),
            players:[],
            rounds: [],
            status: mTournament.getStatus()
        }
        const tournaments = [...this.getTournaments(TOURNAMENT_RAW_FN), tTournament];
        this.saveTournaments(TOURNAMENT_EDITED_FN, tournaments);
        callback(null, mTournament);
        return
    };
    // reads a tournament
    readTournament (call: ServerUnaryCall<MTournamentId, any>, callback: sendUnaryData<MTournament>) {
        console.log(`server/readTournament - reading a record: ${call.request.getId()}\n`);
        const tournamentId: string = call.request.getId();
        const tournaments: TTournament[] = this.getTournaments(TOURNAMENT_RAW_FN)
        const tournament = tournaments.find((t: TTournament) => t.id === tournamentId);

        if (!tournament) {
            const error: {name: string, message: string} = {
                name: "Tournament not found",
                message: `Tournament with ID ${tournamentId} does not exist.`,
            };
            callback(error, null);
            return;
        }
        const mTournament = tournament_t_to_m(tournament)
        console.log(`readTournament: returning ${mTournament.toString()}\n`);

        callback(null, mTournament);
        return
    }
    // reads all tournaments
    readTournaments(call: ServerWritableStream<Empty, any>) {
        console.log(`server/readTournaments: streaming all tournaments.`);

        const tournaments: TTournament[] = this.getTournaments(TOURNAMENT_RAW_FN)
        console.log(`readTournaments: returning tournament ${tournaments.length} tournamnets`);
        tournaments.forEach((tournament: TTournament) => {

            console.log(`readTournaments: returning tournament ${tournament.id}`);
            const mTournament: MTournament = tournament_t_to_m(tournament)
            call.write(mTournament)
        })
        call.end();
        return;
    }
    // // Update a tournament
    // uUpdateTournament (call: ServerUnaryCall<MTournamentUpdate, any>, callback: sendUnaryData<MTournament>) {};
    // // Delete a tournament
    // deleteTournament (call: ServerUnaryCall<MTournamentId, any>, callback: sendUnaryData<MTournament>) {};
    // // Start tournament
    // startTournament (call: ServerUnaryCall<MTournamentId, any>, callback: sendUnaryData<MTournament>);
    // // Complete tournament
    // completeTournament (call: ServerUnaryCall<MTournamentId, any>, callback: sendUnaryData<MTournament>);
    // /**
    //  * Tournament Player operations
    //  */
    // rpc CreateTournamentPlayer (MTournamentPlayer) returns (MTournamentPlayer);
    // // reads a tournament round
    // rpc ReadTournamentPlayer (MTournamentPlayerId) returns (MTournamentPlayer);
    // // reads all tournament rounds
    // rpc ReadTournamentPlayers (MTournamentPlayerEmpty) returns (stream MTournamentPlayer);
    // // Update a tournament round
    // rpc UpdateTournamentPlayer (MTournamentPlayerUpdate) returns (MTournamentPlayer);
    // // Delete a tournament round
    // rpc DeleteTournamentPlayer (MTournamentPlayerId) returns (MTournamentPlayer);
    // /**
    //  * Tournament Round operations
    //  */
    //     // creates a tournament round
    // rpc CreateTournamentRound (MTournamentRound) returns (MTournamentRound);
    // // reads a tournament round
    // rpc ReadTournamentRound (MTournamentRoundId) returns (MTournamentRound);
    // // reads all tournament rounds
    // rpc ReadTournamentRounds (MTournamentRoundEmpty) returns (stream MTournamentRound);
    // // Update a tournament round
    // rpc UpdateTournamentRound (MTournamentRoundUpdate) returns (MTournamentRound);
    // // Delete a tournament round
    // rpc DeleteTournamentRound (MTournamentRoundId) returns (MTournamentRound);
    // // Plan the next round
    // rpc PlanNextTournamentRound (MTournamentId) returns (MTournamentRound);
    // // Start the next round
    // rpc StartNextTournamentRound (MTournamentId) returns (MTournamentRound);
    // // Complete the next round
    // rpc CompleteNextTournamentRound (MTournamentId) returns (MTournamentRound);
    // /**
    //  * Tournament Game operations
    //  */
    //     // creates a tournament game
    // rpc CreateTournamentGame (MTournamentGame) returns (MTournamentGame);
    // // reads a tournament game
    // rpc ReadTournamentGame (MTournamentGameId) returns (MTournamentGame);
    // // reads all tournament game
    // rpc ReadTournamentGames (MTournamentGameEmpty) returns (stream MTournamentGame);
    // // Update a tournament game score
    // rpc UpdateTournamentScoreGame (MTournamentGameScoreUpdate) returns (MTournamentGame);
    // // Update a tournament status
    // rpc UpdateTournamentStatusGame (MTournamentGameStatusUpdate) returns (MTournamentGame);
    // // Delete a tournament game
    // rpc DeleteTournamentGame (MTournamentGameId) returns (MTournamentGame);

    // Retrieve club members
    getTournaments = (tournamentFn: string) => {
        let data = '';
        try {
            const fd = fs.openSync(tournamentFn, 'r', 0o666)
            data = fs.readFileSync(fd, { encoding: 'utf8' });
            fs.closeSync(fd);
        }
        catch (err) {
            console.log(err);
            process.exit(1)
        }
        return JSON.parse(data);
    }

    // Save club members
    saveTournaments = (tournamentFn: string, newClubMembers: TClubMember[]) => {
        try {
            const fd = fs.openSync(tournamentFn, 'w+', 0o666)
            fs.writeSync(fd, JSON.stringify(newClubMembers));
            fs.closeSync(fd);
        } catch (err) {
            console.log(err);
            process.exit(1)
        }
    }
}