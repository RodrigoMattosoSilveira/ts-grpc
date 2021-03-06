import {MClubMember, MClubMemberUpdate} from "../grpc/proto/club-member_pb"
import {TClubMember, TClubMemberUpdate} from "../types/club-member-type";

/**
 * Returns a Club Member object
 * @param m, a GRPC Club Member object
 */
export const m_to_t = (m: MClubMember): TClubMember => {
    return <TClubMember>{
        id: <string>m.getId(),
        first: <string>m.getFirst(),
        last: <string>m.getLast(),
        password: <string>m.getPassword(),
        cell: <string>m.getCell(),
        email: <string>m.getEmail(),
        rating: <number>m.getRating(),
        status: <boolean>m.getStatus(),
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
    m.setEmail(t.email);
    m.setCell(t.cell);
    m.setRating(t.rating);
    m.setStatus(t.status);
    return m;
}
/**
 * Returns a GRPC Club Member object
 * @param t, a Club Member object, with optional attributes
 */
export const tUpdate_to_mUpdate = (t: TClubMemberUpdate): MClubMemberUpdate => {
    const m: MClubMemberUpdate = new MClubMemberUpdate();
    if (t['id']) {
        m.setId(t.id);
    }
    if (t['first']) {
        m.setFirst(t.first);
    }
    if (t['last']) {
        m.setLast(t.last);
    }
    if (t['password']) {
        m.setPassword(t.password);
    }
    if (t['email']) {
        m.setEmail(t.email);
    }
    if (t['cell']) {
        m.setCell(t.cell);
    }
    if (t['rating']) {
        m.setRating(t.rating);
    }
    if (t['status']) {
        m.setStatus(t.status);
    }
    return m;
}