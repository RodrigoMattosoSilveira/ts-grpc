import { MClubMember, MClubMemberId } from "../proto/club-member_pb";
import { client } from "./utils";

// export const runCreateClubMember = (): void => {
const readClubMember = (id: string): any => {
    return new Promise<MClubMember>((resolve, reject) => {
        const request = new MClubMemberId();
        request.setId(id);

        client.readClubMember(request, (err: any, clubMember: any) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(clubMember);
            }
        });
    });
}

export default readClubMember;

