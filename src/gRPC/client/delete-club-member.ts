import { MClubMember, MClubMemberId } from "../proto/club-member_pb";
import { client } from "./utils";

// export const runCreateClubMember = (): void => {
const deleteClubMember = (id: string): any => {
    return new Promise<MClubMember>((resolve, reject) => {
        const deleteClubMember = new MClubMemberId();
        deleteClubMember.setId(id);

        client.deleteClubMember(deleteClubMember, (err: any, deletedClubMember: any) => {
            if (err) reject(err);
            else resolve(deletedClubMember);
        });
    });
}

export default deleteClubMember;
