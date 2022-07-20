import { credentials } from "@grpc/grpc-js";
import { SClubMemberClient } from "../proto/club-member_grpc_pb";
import {STournamentClient} from "../proto/tournament_grpc_pb";

const port = 50051;

export const clubMemberClient = new SClubMemberClient(
    `127.0.0.1:${port}`,
    credentials.createInsecure()
);

export const tournamentClient = new STournamentClient (
    `127.0.0.1:${port}`,
    credentials.createInsecure()
);

export const noop = () => {};

