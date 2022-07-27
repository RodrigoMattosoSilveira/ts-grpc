

const config =  require('../../../config/config');
process.env.GRPC_PORT = config.GRPC_PORT
process.env.CLUB_MEMBERS_RAW_FN = config.CLUB_MEMBERS_RAW_FN;
process.env.CLUB_MEMBERS_EDITED_FN = config.CLUB_MEMBERS_EDITED_FN;
process.env.TOURNAMENTS_RAW_FN = config.TOURNAMENTS_RAW_FN;
process.env.TOURNAMENTS_EDITED_FN = config.TOURNAMENTS_EDITED_FN;
// console.log(`server/index-process.env.CLUB_MEMBERS_RAW_FN = ${process.env.CLUB_MEMBERS_RAW_FN }`);
// console.log(`server/index-process.env.CLUB_MEMBERS_EDITED_FN = ${process.env.CLUB_MEMBERS_EDITED_FN}`);
// console.log(`server/index-process.env.TOURNAMENTS_RAW_FN = ${process.env.TOURNAMENTS_RAW_FN}`);
// console.log(`server/index-process.env.TOURNAMENTS_EDITED_FN = ${process.env.TOURNAMENTS_EDITED_FN}`);

import { Server, ServerCredentials } from "@grpc/grpc-js";

import { SClubMemberService } from "../proto/club-member_grpc_pb";
import { ClubMemberServices } from "./club-member-services";

import {STournamentService} from "../proto/tournament_grpc_pb";
import {TournamentServices} from "./tournament-services";


const server = new Server();
// TODO Find a way to remove this ts-ignore
// @ts-ignore  TODO find a way to remove this
server.addService(SClubMemberService, new ClubMemberServices());
// @ts-ignore TODO find a way to remove this
server.addService(STournamentService, new TournamentServices());

const port = process.env.GRPC_PORT;
const uri = `localhost:${port}`;
console.log(`Listening on ${uri}`);
server.bindAsync(
    `127.0.0.1:${port}`,
    ServerCredentials.createInsecure(),
    (_error: any, _port: any) => {
        console.log(`Server running at http://127.0.0.1:${port}`);
        server.start();
    }
);

