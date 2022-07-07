const CLUB_MEMBER_PROTO = __dirname + '/proto/club-member.proto';
const CLUB_MEMBER_RAW_FN = __dirname + '/../data/club-members-raw.json';
const CLUB_MEMBER_EDITED_FN = __dirname + '/../data/club-members-edited.json';

const fs = require('fs');
const shortid = require("shortid");
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync(
    CLUB_MEMBER_PROTO,
    {keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
const clubMemberProto = grpc.loadPackageDefinition(packageDef);

/**
 *
 * @param clubMember
 */
const clubMemberCreateValidate = (clubMember) => {
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

const clubMemberUpdateValidate = (clubMember) => {
    let errorMessage = ``;

    // Must have id
    if (!clubMember.hasOwnProperty('id')) {
        const msg = `Missing id`;
        errorMessage += errorMessage === "" ? msg : `\n` + msg;
    }
    return errorMessage;
}

const clubMemberDeleteValidate = (clubMember) => {
    let errorMessage = ``;

    // Must have id
    if (!clubMember.hasOwnProperty('id')) {
        const msg = `Missing id`;
        errorMessage += errorMessage === "" ? msg : `\n` + msg;
    }
    return errorMessage;
}

/**
 *
 * @param call
 * @param callback
 */
const createClubMember = (call, callback) => {
    const errorMessage = clubMemberCreateValidate(call.request);
    let callbackObj;
    if (errorMessage !== ``) {
        // We have an error
        callbackObj = {
            code: grpc.status.INVALID_ARGUMENT,
            message: errorMessage,
        }
    }
    else {
        // we are good to go
        if (!call.request.hasOwnProperty('rating')) {
            call.request.rating = 1200;
         }

        const clubMember = {
            id: shortid.generate(),
            first: call.request.first,
            last: call.request.last,
            email: call.request.email,
            password: call.request.password,
            cell: call.request.cell,
            rating: call.request.rating,
            status: "active"
        }
        const clubMembers = [...getClubMembers(CLUB_MEMBER_RAW_FN), clubMember];
        saveClubMembers(CLUB_MEMBER_EDITED_FN, clubMembers);
        callbackObj = {
            code: null,
            message: clubMember,
        }
    }
    callback(callbackObj.code, callbackObj.message);
}

/**
 *
 * @param call
 * @param callback Called to end the method's execution
 */
const readClubMember = (call, callback) => {
    const cluMemberId = call.request.id;
    let callbackObj;
    const clubMembers = getClubMembers(CLUB_MEMBER_RAW_FN);
    const clubMemberFiltered = clubMembers.filter((clubMember) => {
        return clubMember.id === cluMemberId;
    });
    if (clubMemberFiltered.length === 0) {
        callbackObj = {
            code: grpc.status.NOT_FOUND,
            message: `Unable to read club member. Club member id ${cluMemberId} not found`
        }
    }
    else {
        callbackObj = {
            code: null,
            message: clubMemberFiltered[0],
        }
    }
    callback(callbackObj.code, callbackObj.message);
}

const readClubMembers = (call, callback) => {
    const clubMembers = [...getClubMembers(CLUB_MEMBER_RAW_FN)];
    // console.log(`Sending all club members: ${JSON.stringify(clubMembers)}`)
    callback(null, {data: clubMembers});
}

const updateClubMember = (call, callback) => {
    let callbackObj;
    const errorMessage = clubMemberUpdateValidate(call.request);
    if (errorMessage !== ``) {
        // Must have the club member id to update it
        callbackObj = {
            code: grpc.status.INVALID_ARGUMENT,
            message: errorMessage,
        }
    }
    else {
        const clubMembers = getClubMembers(CLUB_MEMBER_RAW_FN);
        const cluMemberId = call.request.id
        const targetClubMemberIndex = clubMembers.findIndex(clubMember => {
            return clubMember.id === cluMemberId;
        })
        if (targetClubMemberIndex === -1) {
            // send reply indicating we did not fund the target club member
            callbackObj = {
                code: grpc.status.NOT_FOUND,
                message: `Unable to update club member. Club member id ${cluMemberId} not found`
            }
        }
        else {
            // Update the target club member
            const keys = ['first', 'last', 'email', 'email', 'password', 'cell', 'rating', 'status'];
            keys.forEach((key) => {
                if (call.request.hasOwnProperty(key)) {
                    clubMembers[targetClubMemberIndex][key] = call.request[key];
                }
            })
            // Save the updated club members
            saveClubMembers(CLUB_MEMBER_EDITED_FN, clubMembers)

            // send reply with updated club member
            callbackObj = {
                code: null,
                message: clubMembers[targetClubMemberIndex]
            }
        }
    }
    callback(callbackObj);
}

const deleteClubMember = (call, callback) => {
    let callbackObj;
    const errorMessage = clubMemberDeleteValidate(call.request);
    let deletedClubMember;
    if (errorMessage !== ``) {
        // Must have the club member id to update it
        callbackObj = {
            code: grpc.status.INVALID_ARGUMENT,
            message: errorMessage,
        }
    }
    else {
        const clubMembers = getClubMembers(CLUB_MEMBER_RAW_FN);
        const cluMemberId = call.request.id
        const targetClubMemberIndex = clubMembers.findIndex(clubMember => {
            return clubMember.id === cluMemberId;
        })
        if (targetClubMemberIndex === -1) {
            // send reply indicating we did not fund the target club member
            callbackObj = {
                code: grpc.status.NOT_FOUND,
                message: `Unable to delete club member. Club member id ${cluMemberId} not found`
            }
        }
        else {
            // Delete the target club member
            deletedClubMember = clubMembers[targetClubMemberIndex];
            clubMembers.splice(targetClubMemberIndex, 1); // 2nd parameter means remove one item only

            // save the updated club members
            saveClubMembers(CLUB_MEMBER_EDITED_FN, clubMembers)

            // send reply with deleted club member
            callbackObj = {
                code: null,
                message: deletedClubMember
            }
        }
    }
    callback(callbackObj);
}

// Read Club Members
const getClubMembers = (clubMemberFn) => {
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
const saveClubMembers = (clubMemberFn, newClubMembers) => {
    try {
        const fd = fs.openSync(clubMemberFn, 'w+', 0o666)
        fs.writeSync(fd, JSON.stringify(newClubMembers));
        fs.closeSync(fd);
    }
    catch (err) {
        console.log(err);
        process.exit(1)
    }
}
/**
 * Get a new server with the handler functions in this file bound to the methods
 * it serves.
 * @return {Server} The new server object
 */
function getServer(cmProto) {
    const server = new grpc.Server();
    // server.addService(clubMemberProto.RouteGuide.service, {
    //     createClubMember: createClubMember,
    //     readClubMember: readClubMember,
    //     readClubMembers: readClubMembers,
    //     updateClubMember: updateClubMember,
    //     deleteClubMember: deleteClubMember
    // });
    server.addService(cmProto.ClubMemberService.service, {
        createClubMember: createClubMember,
        readClubMember: readClubMember,
        readClubMembers: readClubMembers,
        updateClubMember: updateClubMember,
        deleteClubMember: deleteClubMember
    });
    return server;
}

if (require.main === module) {
    // If this is run as a script, start a server on an unused port
    const server = getServer(clubMemberProto);
    server.bindAsync(
        "127.0.0.1:50051",
        grpc.ServerCredentials.createInsecure(),
        (error, port) => {
            console.log("Server running at http://127.0.0.1:50051");
            server.start();
        }
    );
}

exports.getServer = getServer;