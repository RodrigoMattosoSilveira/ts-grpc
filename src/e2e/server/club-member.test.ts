// @ts-ignore
import config from "../../../config/config";
import {
    MClubMember,
    MClubMemberEmpty,
    MClubMemberId
} from "../../grpc/proto/club-member_pb";
import shortid from "shortid";
import clubMemberCreate from "../../grpc/client/club-member-create";
import {TClubMember} from "../../types/club-member-type";
// import {clubMemberClient} from "../../grpc/client/client";
import {SClubMemberClient} from "../../grpc/proto/club-member_grpc_pb";
import {credentials} from "@grpc/grpc-js";

describe('Club Member',  () => {
    let clubMemberClient: any;
    beforeAll((done) => {
        clubMemberClient = new SClubMemberClient(
            `127.0.0.1:${config.GRPC_PORT}`,
            credentials.createInsecure()
        );
        done();
    });
    afterAll(done => {
        clubMemberClient = null;
        done();
    });
    describe('Read a Club Member', () => {
        it('using existing id', async () => {
            const id = "ZasAIJcZQLR"
            const mClubMemberId = new MClubMemberId().setId(id);
           await  clubMemberClient.readClubMember(mClubMemberId, (err: Error, clubMember: MClubMember) => {
                expect(err).toBeNull();
                expect(clubMember.getId()).toEqual(id);
            });
        });
        it('using non existing id', async () => {
            const id = "ZasAIJcZQLS"
            const mClubMemberId = new MClubMemberId();
            mClubMemberId.setId(id);
            // clubMemberClient.readClubMember(mClubMemberId, (err: Error, clubMember: MClubMember) => {
            await clubMemberClient.readClubMember(mClubMemberId, (err: Error) => {
                // expect(clubMember).toBeNull();
                // expect(err).not.toBeNull();
                const errorMessage: string = `2 UNKNOWN: User with ID ${id} does not exist.`
                expect(err.message).toBe(errorMessage)
            });
        });
    });
    describe('Read Club Members', () => {
        it('works', () => {
            // clubMembersRead().
            //     then((mClubMembers: MClubMember[]) => {
            //         expect(mClubMembers.length).toEqual(2)
            //     }).
            //     catch((error: any) => {
            //         fail(`error reading club member: ${error}`)
            //     })
            const empty = new MClubMemberEmpty()
            const stream = clubMemberClient.readClubMembers(empty);
            const clubMembers: MClubMember[] = [];
            stream.on("data", (clubMember: MClubMember) => clubMembers.push(clubMember));
            stream.on("error", (result: any) => {
                expect(result).toBeNull()
            });
            stream.on("end", () => {
                expect(clubMembers.length).toEqual(2)
            });
        });
    });
    xdescribe('Create a Club Member', () => {
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
        it('works', async () => {
            await clubMemberCreate(tClubMember).
                then((mClubMember: MClubMember) => {
                    expect(mClubMember.getId()).toEqual(tClubMember.id);
                }).
                catch((error: any) => {
                    expect(error).toBeNull();
                });
        });
    });
});