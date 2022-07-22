import {MClubMember, MClubMemberEmpty} from "../proto/club-member_pb";
import { clubMemberClient } from "./client";

const clubMembersRead = (): any => {
    return new Promise<MClubMember[]>((resolve, reject) => {
        const empty = new MClubMemberEmpty()
        const stream = clubMemberClient.readClubMembers(empty);
        const clubMembers: MClubMember[] = [];
        stream.on("data", (clubMember: MClubMember) => clubMembers.push(clubMember));
        stream.on("error", reject);
        stream.on("end", () => resolve(clubMembers));
    });
}

export default clubMembersRead;
