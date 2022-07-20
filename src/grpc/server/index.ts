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

const port = 50051;
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

