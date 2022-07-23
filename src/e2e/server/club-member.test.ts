import clubMemberRead from "../../grpc/client/club-member-read";
import {MClubMember} from "../../grpc/proto/club-member_pb";
import clubMembersRead from "../../grpc/client/club-members-read";
import shortid from "shortid";
import clubMemberCreate from "../../grpc/client/club-member-create";
import {TClubMember} from "../../types/club-member-type";
describe('Club Member', () => {
    describe('Read a Club Member', () => {
        it('using existing id', () => {
            const id = "ZasAIJcZQLR"
            clubMemberRead(id).
                then((mClubMember: MClubMember) => {
                   expect(mClubMember.getId()).toEqual(id);
                }).
                catch((error: any) => {
                    fail(`error reading club member: ${error}`)
                })
        });
        it('using non existing id', () => {
            const id = "ZasAIJcZQLS"
            clubMemberRead(id).
                then(() => {
                    fail(`id doest not exist, should not have found club member: ${id}`)
                }).
                catch((error: any) => {
                    expect(error).not.toBeNull();
                })
        });
    });
    describe('Read Club Members', () => {
        it('works', () => {
            clubMembersRead().
                then((mClubMembers: MClubMember[]) => {
                    expect(mClubMembers.length).toEqual(2)
                }).
                catch((error: any) => {
                    fail(`error reading club member: ${error}`)
                })
        });
    });
    describe('Create Club Member', () => {
        const tClubMember: TClubMember = {
            id: shortid.generate(),
            first: "Sergio",
            last: "Craque",
            password: "P4yUK9wYUzKZ",
            email: "Sergio.Craque@yahoo.com",
            cell: "4082345678",
            rating: 1974,
            status: true
        }
        // TODO add tests to validate the error handling
        it('works', () => {
            clubMemberCreate(tClubMember).
                then((mClubMember: MClubMember) => {
                    expect(mClubMember.getId()).toEqual(tClubMember.id);
                }).
                catch((error: any) => {
                    fail(`error creating club member: ${error}`)
                });
        });
    });
});