import {MClubMember, MClubMemberUpdate} from "../proto/club-member_pb";
import { clubMemberClient } from "./client";
import {tUpdate_to_mUpdate} from "../../utils/club-member-utils";
import {TClubMemberUpdate} from "../../types/club-member-type";

const clubMemberUpdate = (tClubMemberU: TClubMemberUpdate): any => {
    console.log(`client/clubMemberUpdate - Updating ClubMember - ${tClubMemberU.toString()}`)
    const mClubMember: MClubMemberUpdate = tUpdate_to_mUpdate(tClubMemberU)
    return new Promise<MClubMember>((resolve, reject) => {
        clubMemberClient.updateClubMember(mClubMember, (err: any, updatedClubMember: MClubMember) => {
            if (err) reject(err);
            else resolve(updatedClubMember);
        });
    });
}
export default clubMemberUpdate;
