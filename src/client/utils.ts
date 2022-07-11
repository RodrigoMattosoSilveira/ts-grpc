import { SvcClubMemberClient } from "../proto/club-member_grpc_pb";
import { credentials } from "@grpc/grpc-js";

const port = 3000;

export const client = new SvcClubMemberClient(
    `localhost:${port}`,
    credentials.createInsecure()
);

export const noop = () => {};