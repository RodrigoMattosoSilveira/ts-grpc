import { MClubMember } from "../proto/club-member_pb";
import { TClubMember } from "../../types/club-member-type"
import { clubMemberClient } from "./client";
import {t_to_m} from "../../utils/club-member-utils";

// GRPC Client handler to create a Club Member
const createClubMember = (tClubMember: TClubMember): any => {
    console.log(`client/createClubMember - Creating a record`);
    return new Promise<MClubMember>((resolve, reject) => {
        const mClubMember: MClubMember = t_to_m(tClubMember)
        clubMemberClient.createClubMember(mClubMember, (err: any, createdClubMember: any) => {
            if (err) reject(err);
            else resolve(createdClubMember);
        });
    });
}

export default createClubMember;
