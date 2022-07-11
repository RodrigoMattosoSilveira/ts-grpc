import {MClubMember} from "../proto/club-member_pb";
import {TClubMember} from "../types/club-member-type";

/**
 * Returns a Club Member object
 * @param m, a GRPC Club Member object
 */
export const m_to_t = (m: MClubMember): TClubMember => {
    return {
        id: m.getId(),
        first: m.getFirst(),
        last: m.getLast(),
        password: m.getPassword(),
        cell: m.getCell(),
        email: m.getEmail(),
        rating: m.getRating(),
        status: m.getStatus(),
    }
}

/**
 * Returns a GRPC Club Member object
 * @param t, a Club Member object
 */
export const t_to_m = (t: TClubMember): MClubMember => {
    const m: MClubMember = new MClubMember();
    m.setId(t.id);
    m.setFirst(t.first);
    m.setLast(t.last);
    m.setPassword(t.password);
    m.setCell(t.cell);
    m.setEmail(t.email);
    m.setRating(t.rating);
    m.setStatus(t.status);
    return m;
}