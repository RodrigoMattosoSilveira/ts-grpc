import { SClubMemberClient } from "../proto/club-member_grpc_pb";
import { credentials } from "@grpc/grpc-js";


const port = 50051;

export const client = new SClubMemberClient(
    `127.0.0.1:${port}`,
    credentials.createInsecure()
);

export const noop = () => {};

