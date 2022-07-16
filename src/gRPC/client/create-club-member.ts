import { MClubMember } from "../proto/club-member_pb";
import { TClubMember } from "../../types/club-member-type"
import { client } from "./utils";
import { t_to_m } from "../../utils/utils"

// GRPC Client handler to create a Club Member
const createClubMember = (tClubMember: TClubMember): any => {
    console.log(`client/createClubMember - Creating a record`);
    return new Promise<MClubMember>((resolve, reject) => {
        const mClubMember: MClubMember = t_to_m(tClubMember)
        client.createClubMember(mClubMember, (err: any, createdClubMember: any) => {
            if (err) reject(err);
            else resolve(createdClubMember);
        });
    });
}

export default createClubMember;
