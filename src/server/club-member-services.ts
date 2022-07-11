import {
    ServerUnaryCall,
    sendUnaryData,
    ServerWritableStream,
} from "@grpc/grpc-js";

import {ISClubMemberServer} from "../proto/club-member_grpc_pb";
import {MClubMember, MClubMemberId } from "../proto/club-member_pb";
import { TClubMember } from "../types/club-member-type";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";
import * as fs from "fs";
import * as shortid from "shortid";

const CLUB_MEMBER_RAW_FN = __dirname + '/../../data/club-members-raw.json';
const CLUB_MEMBER_EDITED_FN = __dirname + '/../../data/club-members-edited.json';

export class ClubMemberServices implements ISClubMemberServer {
    createClubMember(call: ServerUnaryCall<MClubMember, any>, callback: sendUnaryData<MClubMember>) {
        const clubMemberObject: TClubMember = this.fromClubMemberGrpcObjectToClubMemberObj(call.request)
        const errorMessage = this.clubMemberCreateValidate(clubMemberObject);
        // let callbackObj;
        if (errorMessage !== ``) {
            const error: {name: string, message: string} = {
                name: `INVALID_ARGUMENT`,
                message: errorMessage,
            };
            callback(error, null);
            return;
        }
        else {
            // we are good to go
            if (!clubMemberObject.hasOwnProperty('rating')) {
                clubMemberObject.rating = 1200;
            }

            const clubMember = {
                id: shortid.generate(),
                first: call.request.getFirst(),
                last: call.request.getLast(),
                email: call.request.getEmail(),
                password: call.request.getPassword(),
                cell: call.request.getCell(),
                rating: call.request.getRating(),
                status: true
            }
            const clubMembers = [...this.getClubMembers(CLUB_MEMBER_RAW_FN), clubMember];
            this.saveClubMembers(CLUB_MEMBER_EDITED_FN, clubMembers);
            const clubMemberGrpcObject = this.fromClubMemberObjToClubMemberGrpcObject(clubMember)
            callback(null, clubMemberGrpcObject);
            return
        }
    }
    readClubMember(call: ServerUnaryCall<MClubMemberId, any>, callback: sendUnaryData<MClubMember>) {
        const clubMemberId: string = call.request.getId();
        const clubMembers: TClubMember[] = this.getClubMembers(CLUB_MEMBER_RAW_FN)
        const clubMember = clubMembers.find((cm: TClubMember) => cm.id === clubMemberId);

        if (!clubMember) {
            const error: {name: string, message: string} = {
                name: "User Missing",
                message: `User with ID ${clubMemberId} does not exist.`,
            };
            callback(error, null);
            return;
        }
        const clubMemberGrpcObject = this.fromClubMemberObjToClubMemberGrpcObject(clubMember)
        console.log(`readClubMember: returning ${clubMemberGrpcObject.getFirst()} (id: ${clubMemberGrpcObject.getId()}).`);
        callback(null, clubMemberGrpcObject);
        // callback(null, clubMember);
    }
    readClubMembers(call: ServerWritableStream<Empty, any>) {
        const clubMembers: TClubMember[] = this.getClubMembers(CLUB_MEMBER_RAW_FN)

        clubMembers.forEach((clubMember: TClubMember) => {
            const clubMemberGrpcObject = this.fromClubMemberObjToClubMemberGrpcObject(clubMember)
            call.write(clubMemberGrpcObject)
        })
        console.log(`readClubMember: returning ${clubMembers.length} club members`);
        call.end();
    }
    updateClubMember(call: ServerUnaryCall<MClubMember, any>, callback: sendUnaryData<MClubMember>) {
        const clubMemberObject: TClubMember = this.fromClubMemberGrpcObjectToClubMemberObj(call.request)
        const errorMessage = this.clubMemberUpdateValidate(clubMemberObject);
        if (errorMessage !== ``) {
            const error: {name: string, message: string} = {
                name:`INVALID_ARGUMENT`,
                message: errorMessage
            };
            callback(error, null);
            return;
        }
        else {
            const clubMembers = this.getClubMembers(CLUB_MEMBER_RAW_FN);
            const cluMemberId = clubMembers.id
            const targetClubMemberIndex = clubMembers.findIndex((clubMember: TClubMember) => {
                return clubMember.id === cluMemberId;
            })
            if (targetClubMemberIndex === -1) {
                // send reply indicating we did not fund the target club member
                const error: {name: string, message: string} = {
                    name: `NOT_FOUND`,
                    message: `Unable to update club member. Club member id ${cluMemberId} not found`
                };
                callback(error, null);
                return;
            }
            else {
                // Update the target club member
                if (call.request.hasOwnProperty('first')) {
                    clubMembers[targetClubMemberIndex]['first'] = call.request.getFirst();
                }
                if (call.request.hasOwnProperty('last')) {
                    clubMembers[targetClubMemberIndex]['last'] = call.request.getLast();
                }
                if (call.request.hasOwnProperty('email')) {
                    clubMembers[targetClubMemberIndex]['email'] = call.request.getEmail();
                }
                if (call.request.hasOwnProperty('password')) {
                    clubMembers[targetClubMemberIndex]['password'] = call.request.getPassword();
                }
                if (call.request.hasOwnProperty('cell')) {
                    clubMembers[targetClubMemberIndex]['cell'] = call.request.getCell();
                }
                if (call.request.hasOwnProperty('rating')) {
                    clubMembers[targetClubMemberIndex]['rating'] = call.request.getRating();
                }
                if (call.request.hasOwnProperty('status')) {
                    clubMembers[targetClubMemberIndex]['status'] = call.request.getStatus();
                }
                // Save the updated club members
                this.saveClubMembers(CLUB_MEMBER_EDITED_FN, clubMembers)

                // send reply with updated club member
                const clubMemberGrpcObject = this.fromClubMemberObjToClubMemberGrpcObject(clubMembers[targetClubMemberIndex])
                console.log(`updateClubMember: returning ${clubMembers[targetClubMemberIndex].first} (id: ${clubMembers[targetClubMemberIndex].id}).`);
                callback(null, clubMemberGrpcObject);
            }
        }
    }
    deleteClubMember(call: ServerUnaryCall<MClubMemberId, any>, callback: sendUnaryData<MClubMember>) {
        const clubMemberId: string = call.request.getId();
        const clubMembers: TClubMember[] = this.getClubMembers(CLUB_MEMBER_RAW_FN)
        const targetClubMemberIndex = clubMembers.findIndex(clubMember => {
            return clubMember.id === clubMemberId;
        })
        if (targetClubMemberIndex === -1) {
             const error: {name: string, message: string} = {
                name: "Club Member not found",
                message: `Club Member with ID ${clubMemberId} does not exist.`,
            };
            callback(error, null);
            return;
        }
        // Delete the target club member; we do not delete a club member, but disable it
        clubMembers[targetClubMemberIndex][`status`] = false;

        // save the updated club members
        this.saveClubMembers(CLUB_MEMBER_EDITED_FN, clubMembers)

        const clubMemberGrpcObject = this.fromClubMemberObjToClubMemberGrpcObject(clubMembers[targetClubMemberIndex])
        console.log(`deleteClubMember: returning ${clubMemberGrpcObject.getFirst()} (id: ${clubMemberGrpcObject.getId()}).`);
        callback(null, clubMemberGrpcObject);
    }
    clubMemberCreateValidate = (clubMember: TClubMember) => {
        let errorMessage = ``;

        // Must have first name
        if (!clubMember.hasOwnProperty('first')) {
            const msg = `Missing first name`;
            errorMessage += errorMessage === "" ? msg : `\n` + msg;
        }

        // Must have last name
        if (!clubMember.hasOwnProperty('last')) {
            const msg = `Missing first name`;
            errorMessage += errorMessage === "" ? msg : `\n` + msg;
        }

        // Must have email address
        if (!clubMember.hasOwnProperty('email')) {
            const msg = `Missing first name`;
            errorMessage += errorMessage === "" ? msg : `\n` + msg;
        }

        // Must have password
        if (!clubMember.hasOwnProperty('password')) {
            const msg = `Missing first name`;
            errorMessage += errorMessage === "" ? msg : `\n` + msg;
        }

        // Must have cell phone
        if (!clubMember.hasOwnProperty('cell')) {
            const msg = `Missing first name`;
            errorMessage += errorMessage === "" ? msg : `\n` + msg;
        }
        return errorMessage;
    }

    clubMemberUpdateValidate = (clubMember: TClubMember) => {
        let errorMessage = ``;

        // Must have id
        if (!clubMember.hasOwnProperty('id')) {
            const msg = `Missing id`;
            errorMessage += errorMessage === "" ? msg : `\n` + msg;
        }
        return errorMessage;
    }

    /**
     * Returns a CLub Member GRPC object from a Club Member object
     * @param clubMember
     */
    fromClubMemberObjToClubMemberGrpcObject = (clubMember: TClubMember): MClubMember => {
        const clubMemberGrpcObject: MClubMember = new MClubMember();
        clubMemberGrpcObject.setId(clubMember.id);
        clubMemberGrpcObject.setFirst(clubMember.first);
        clubMemberGrpcObject.setLast(clubMember.last);
        clubMemberGrpcObject.setPassword(clubMember.password);
        clubMemberGrpcObject.setCell(clubMember.cell);
        clubMemberGrpcObject.setEmail(clubMember.email);
        clubMemberGrpcObject.setRating(clubMember.rating);
        clubMemberGrpcObject.setStatus(clubMember.status);
        return clubMemberGrpcObject;
    }
    /**
     * Returns a Club Member Object from a CLub Member GRPC Object
     * @param clubMember
     */
    fromClubMemberGrpcObjectToClubMemberObj = (clubMember: MClubMember): TClubMember => {
        return {
            id: clubMember.getId(),
            first: clubMember.getFirst(),
            last: clubMember.getLast(),
            password: clubMember.getPassword(),
            cell: clubMember.getCell(),
            email: clubMember.getEmail(),
            rating: clubMember.getRating(),
            status: clubMember.getStatus(),
        }
    }
    getClubMembers = (clubMemberFn: string) => {
        let data = '';
        try {
            const fd = fs.openSync(clubMemberFn, 'r', 0o666)
            data = fs.readFileSync(fd, { encoding: 'utf8' });
            fs.closeSync(fd);
        }
        catch (err) {
            console.log(err);
            process.exit(1)
        }
        return JSON.parse(data);
}

    // Save club members
    saveClubMembers = (clubMemberFn: string, newClubMembers: TClubMember[]) => {
        try {
            const fd = fs.openSync(clubMemberFn, 'w+', 0o666)
            fs.writeSync(fd, JSON.stringify(newClubMembers));
            fs.closeSync(fd);
        } catch (err) {
            console.log(err);
            process.exit(1)
        }
    }

}