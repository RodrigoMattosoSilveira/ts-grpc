import { Server, ServerCredentials } from "@grpc/grpc-js";
import { SClubMemberService } from "../proto/club-member_grpc_pb";
import { ClubMemberServices } from "./club-member-services";


const server = new Server();
// TODO Find a way to remove this ts-ignore
// @ts-ignore
server.addService(SClubMemberService, new ClubMemberServices());

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

