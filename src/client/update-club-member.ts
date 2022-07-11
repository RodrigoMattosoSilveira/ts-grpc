import { MClubMember } from "../proto/club-member_pb";
import { client } from "./utils";

// export const runCreateClubMember = (): void => {
const updateClubMember = (clubMember: MClubMember): any => {
    return new Promise<MClubMember>((resolve, reject) => {
        const requestUpdate = new MClubMember();
        requestUpdate.setId(clubMember.getId());
        requestUpdate.setFirst(clubMember.getFirst());
        requestUpdate.setLast(clubMember.getLast());
        requestUpdate.setPassword(clubMember.getPassword());
        requestUpdate.setCell(clubMember.getCell());
        requestUpdate.setRating(clubMember.getRating());
        requestUpdate.setStatus(clubMember.getStatus());

        client.updateClubMember(requestUpdate, (err, clubMember) => {
            if (err) reject(err);
            else resolve(clubMember);
        });
    });
}

export default updateClubMember;
