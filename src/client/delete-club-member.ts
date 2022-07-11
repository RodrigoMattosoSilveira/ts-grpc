import { MClubMember, MClubMemberId } from "../proto/club-member_pb";
import { client } from "./utils";

// export const runCreateClubMember = (): void => {
const deleteClubMember = (id: string): any => {
    return new Promise<MClubMember>((resolve, reject) => {
        const request = new MClubMemberId();
        request.setId(id);

        client.deleteClubMember(request, (err: any, clubMember: any) => {
            if (err) reject(err);
            else resolve(clubMember);
        });
    });
}

export default deleteClubMember;
