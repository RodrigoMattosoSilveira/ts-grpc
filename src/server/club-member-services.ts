import {
    ServerUnaryCall,
    sendUnaryData,
    ServerWritableStream,
} from "@grpc/grpc-js";

import {ISClubMemberServer} from "../proto/club-member_grpc_pb";
import {MClubMember, MClubMemberId, MClubMemberUpdate} from "../proto/club-member_pb";
import { TClubMember } from "../types/club-member-type";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";
import * as fs from "fs";
import {m_to_t, t_to_m} from "../utils/utils";

const CLUB_MEMBER_RAW_FN = __dirname + '/../../data/club-members-raw.json';
const CLUB_MEMBER_EDITED_FN = __dirname + '/../../data/club-members-edited.json';

export class ClubMemberServices implements ISClubMemberServer {
    createClubMember(call: ServerUnaryCall<MClubMember, any>, callback: sendUnaryData<MClubMember>) {
        console.log(`server/createClubMember - Creating a record`);
        const clubMemberT: TClubMember = m_to_t(call.request)
        const clubMembers = [...this.getClubMembers(CLUB_MEMBER_RAW_FN), clubMemberT];
        this.saveClubMembers(CLUB_MEMBER_EDITED_FN, clubMembers);
        const clubMemberGrpcObject = t_to_m(clubMemberT);
        callback(null, clubMemberGrpcObject);
        return
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
        // const clubMemberGrpcObject = this.fromClubMemberObjToClubMemberGrpcObject(clubMember)
        const clubMemberGrpcObject = t_to_m(clubMember)
        console.log(`readClubMember: returning ${clubMemberGrpcObject.getFirst()} (id: ${clubMemberGrpcObject.getId()}).`);
        callback(null, clubMemberGrpcObject);
        return
    }
    readClubMembers(call: ServerWritableStream<Empty, any>) {
        console.log(`readClubMembers: streaming all club members.`);

        const clubMembers: TClubMember[] = this.getClubMembers(CLUB_MEMBER_RAW_FN)
        clubMembers.forEach((clubMember: TClubMember) => {

            const clubMemberGrpcObject = t_to_m(clubMember)
            call.write(clubMemberGrpcObject)
        })
        console.log(`readClubMembers: returning ${clubMembers.length} club members`);
        call.end();
        return;
    }
    updateClubMember(call: ServerUnaryCall<MClubMemberUpdate, any>, callback: sendUnaryData<MClubMember>) {
        console.log(`server - updateClubMember: ${call.request.toString()}`);
        const clubMembers = this.getClubMembers(CLUB_MEMBER_RAW_FN);

        const targetClubMemberId: string = call.request.getId();
        // const targetClubMemberIndex = clubMembers.findIndex((clubMember: TClubMember) => {
        //     return clubMember.id === targetClubMemberId;
        // })
        // if (targetClubMemberIndex === -1) {
        //     // send reply indicating we did not fund the target club member
        //     const error: {name: string, message: string} = {
        //         name: `NOT_FOUND`,
        //         message: `server/updateClubMember - club member id ${targetClubMemberId} not found`
        //     };
        //     callback(error, null);
        //     return;
        // }
        // else {
        //     // Update the target club member
        //     if (call.request.hasFirst()) {
        //         clubMembers[targetClubMemberIndex]['first'] = call.request.getFirst();
        //     }
        //     if (call.request.hasLast()) {
        //         clubMembers[targetClubMemberIndex]['last'] = call.request.getLast();
        //     }
        //     if (call.request.hasEmail()) {
        //         clubMembers[targetClubMemberIndex]['email'] = call.request.getEmail();
        //     }
        //     if (call.request.hasPassword()) {
        //         clubMembers[targetClubMemberIndex]['password'] = call.request.getPassword();
        //     }
        //     if (call.request.hasCell()) {
        //         clubMembers[targetClubMemberIndex]['cell'] = call.request.getCell();
        //     }
        //     if (call.request.hasRating()) {
        //         clubMembers[targetClubMemberIndex]['rating'] = call.request.getRating();
        //     }
        //     if (call.request.hasStatus()) {
        //         clubMembers[targetClubMemberIndex]['status'] = call.request.getStatus();
        //     }
        //     // Save the updated club members
        //     this.saveClubMembers(CLUB_MEMBER_EDITED_FN, clubMembers)
        //
        //     // send reply with updated club member
        //     const clubMemberGrpcObject = t_to_m(clubMembers[targetClubMemberIndex]);
        //     console.log(`updateClubMember: returning ${clubMembers[targetClubMemberIndex].first} (id: ${clubMembers[targetClubMemberIndex].id}).`);
        //     callback(null, clubMemberGrpcObject);
        // }
        const targetClubMember = clubMembers.find((clubMember: TClubMember) => {
            return clubMember.id === targetClubMemberId;
        })
        if (!targetClubMember) {
            // send reply indicating we did not fund the target club member
            const error: {name: string, message: string} = {
                name: `NOT_FOUND`,
                message: `server/updateClubMember - club member id ${targetClubMemberId} not found`
            };
            callback(error, null);
            return;
        }
        else {
            // Update the target club member
            if (call.request.hasFirst()) {
                targetClubMember['first'] = call.request.getFirst();
            }
            if (call.request.hasLast()) {
                targetClubMember['last'] = call.request.getLast();
            }
            if (call.request.hasEmail()) {
                targetClubMember['email'] = call.request.getEmail();
            }
            if (call.request.hasPassword()) {
                targetClubMember['password'] = call.request.getPassword();
            }
            if (call.request.hasCell()) {
                targetClubMember['cell'] = call.request.getCell();
            }
            if (call.request.hasRating()) {
                targetClubMember['rating'] = call.request.getRating();
            }
            if (call.request.hasStatus()) {
                targetClubMember['status'] = call.request.getStatus();
            }
            // Save the updated club members
            this.saveClubMembers(CLUB_MEMBER_EDITED_FN, clubMembers)

            // send reply with updated club member
            const clubMemberGrpcObject = t_to_m(targetClubMember);
            console.log(`updateClubMember: returning ${targetClubMember.first} (id: ${targetClubMember.id}).`);
            callback(null, clubMemberGrpcObject);
        }
    }
    deleteClubMember(call: ServerUnaryCall<MClubMemberId, any>, callback: sendUnaryData<MClubMember>) {
        const targetClubMemberId: string = call.request.getId();
        const clubMembers: TClubMember[] = this.getClubMembers(CLUB_MEMBER_RAW_FN)
        const targetClubMemberIndex = clubMembers.findIndex(clubMember => {
            return clubMember.id === targetClubMemberId;
        })
        if (targetClubMemberIndex === -1) {
             const error: {name: string, message: string} = {
                name: "Club Member not found",
                message: `server/updateClubMember - club Member ID ${targetClubMemberId} does not exist.`,
            };
            callback(error, null);
            return;
        }
        // Delete the target club member; we do not delete a club member, but disable it
        clubMembers[targetClubMemberIndex][`status`] = false;

        // save the updated club members
        this.saveClubMembers(CLUB_MEMBER_EDITED_FN, clubMembers)

        const clubMemberGrpcObject = t_to_m(clubMembers[targetClubMemberIndex])
            console.log(`deleteClubMember: returning ${clubMemberGrpcObject.getFirst()} (id: ${clubMemberGrpcObject.getId()}).`);
        callback(null, clubMemberGrpcObject);
    }

    // Retrieve club members
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