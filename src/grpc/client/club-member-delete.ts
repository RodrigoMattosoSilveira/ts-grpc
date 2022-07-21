import { MClubMember, MClubMemberId } from "../proto/club-member_pb";
import { clubMemberClient } from "./client";

// export const runCreateClubMember = (): void => {
const clubMemberDelete = (id: string): any => {
    return new Promise<MClubMember>((resolve, reject) => {
        const deleteClubMember = new MClubMemberId();
        deleteClubMember.setId(id);

        clubMemberClient.deleteClubMember(deleteClubMember, (err: any, deletedClubMember: any) => {
            if (err) reject(err);
            else resolve(deletedClubMember);
        });
    });
}

export default clubMemberDelete;
