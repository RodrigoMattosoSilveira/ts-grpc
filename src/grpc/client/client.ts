import { credentials } from "@grpc/grpc-js";
import { SClubMemberClient } from "../proto/club-member_grpc_pb";
import {STournamentClient} from "../proto/tournament_grpc_pb";

const config =  require('../../../config/config');
process.env.GRPC_PORT = config.GRPC_PORT
const port = process.env.GRPC_PORT;

export const clubMemberClient = new SClubMemberClient(
    `127.0.0.1:${port}`,
    credentials.createInsecure()
);

export const tournamentClient = new STournamentClient (
    `127.0.0.1:${port}`,
    credentials.createInsecure()
);


export const noop = () => {};

