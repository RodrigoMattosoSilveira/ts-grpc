import { MClubMember, MClubMemberRequest } from "../proto/club-member_pb";
import { client } from "./utils";

// export const runCreateClubMember = (): void => {
const readClubMember = (id: string): any => {
    return new Promise<MClubMember>((resolve, reject) => {
        const request = new MClubMemberRequest();
        request.setId(id);

        client.readClubMember(request, (err, clubMember) => {
            if (err) reject(err);
            else resolve(clubMember);
        });
    });
}

export default readClubMember;

