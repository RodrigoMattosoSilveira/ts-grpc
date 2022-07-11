import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { MClubMember } from "../proto/club-member_pb";
import { client } from "./utils";

const readClubMembers = (): any => {
    return new Promise<MClubMember[]>((resolve, reject) => {
        const stream = client.readClubMembers(new Empty());
        const clubMembers: MClubMember[] = [];
        stream.on("data", (clubMember: MClubMember) => clubMembers.push(clubMember));
        stream.on("error", reject);
        stream.on("end", () => resolve(clubMembers));
    });
}

export default readClubMembers;
