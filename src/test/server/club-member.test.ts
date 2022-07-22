import clubMemberRead from "../../grpc/client/club-member-read";
import {MClubMember} from "../../grpc/proto/club-member_pb";
import clubMembersRead from "../../grpc/client/club-members-read";
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
    })
})