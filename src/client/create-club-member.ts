import { MClubMember } from "../proto/club-member_pb";
import { client } from "./utils";

// export const runCreateClubMember = (): void => {
const createClubMember = (clubMember: MClubMember): any => {
    return new Promise<MClubMember>((resolve, reject) => {
        const request = new MClubMember();
        request.setId(clubMember.getId());
        request.setFirst(clubMember.getFirst());
        request.setLast(clubMember.getLast());
        request.setPassword(clubMember.getPassword());
        request.setCell(clubMember.getCell());
        request.setRating(clubMember.getRating());

        client.createClubMember(request, (err: any, clubMember: any) => {
            if (err) reject(err);
            else resolve(clubMember);
        });
    });
}

export default createClubMember;
