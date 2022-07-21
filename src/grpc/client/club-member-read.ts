import { MClubMember, MClubMemberId } from "../proto/club-member_pb";
import { clubMemberClient } from "./client";

// export const runCreateClubMember = (): void => {
const clubMemberRead = (id: string): any => {
    return new Promise<MClubMember>((resolve, reject) => {
        const request = new MClubMemberId();
        request.setId(id);

        clubMemberClient.readClubMember(request, (err: any, clubMember: any) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(clubMember);
            }
        });
    });
}

export default clubMemberRead;

