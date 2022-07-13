import {MClubMember, MClubMemberUpdate} from "../proto/club-member_pb";
import { client } from "./utils";

const updateClubMember = (clubMemberU: MClubMemberUpdate): any => {
    return new Promise<MClubMember>((resolve, reject) => {
        console.log(`client - Calling updateClubMember - ${clubMemberU.toString()}`)
        client.updateClubMember(clubMemberU, (err: any, updatedClubMember: MClubMember) => {
            if (err) reject(err);
            else resolve(updatedClubMember);
        });
    });
}
export default updateClubMember;
