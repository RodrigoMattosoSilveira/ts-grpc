const CLUB_MEMBER_PROTO = __dirname + '/./proto/club-member.proto';
const CLUB_MEMBER_FN = __dirname + '/../data/club-members.json';

const fs = require('fs');
const parseArgs = require('minimist');
const path = require('path');
const _ = require('lodash');
var shortid = require("shortid");
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(
    CLUB_MEMBER_PROTO,
    {keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
const routeGuide = grpc.loadPackageDefinition(packageDefinition).routeguide;

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
        const clubMembers = [...getClubMembers(CLUB_MEMBER_FN), clubMember];
        saveClubMembers(CLUB_MEMBER_FN, clubMembers);
        callbackObj = {
            code: null,
            message: clubMember,
        }
    }
    return callback(callbackObj);
}

/**
 *
 * @param call
 * @param callback Called to end the method's execution
 */
const readClubMember = (call, callback) => {
    const cluMemberId = call.request;
    let callbackObj;
    const clubMembers = getClubMembers(CLUB_MEMBER_FN);
    const clubMember = clubMembers.filter((clubMember) => {
        return clubMember.id === cluMemberId;
    });
    if (clubMember.length === 0) {
        callbackObj = {
            code: grpc.status.NOT_FOUND,
            message: `Unable to read club member. Club member id ${cluMemberId} not found`
        }
    }
    else {
        callbackObj = {
            code: null,
            message: clubMember[0],
        }
    }
    callback(callbackObj);
}

const readClubMembers = (call, callback) => {
    const clubMembers = getClubMembers(CLUB_MEMBER_FN);
    callback(null, clubMembers);
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
        const clubMembers = getClubMembers(CLUB_MEMBER_FN);
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
            saveClubMembers(CLUB_MEMBER_FN, clubMembers)

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
        const clubMembers = getClubMembers(CLUB_MEMBER_FN);
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
            saveClubMembers(CLUB_MEMBER_FN, clubMembers)

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
const getClubMembers = (CLUB_MEMBER_FN) => {
    let data = '';
    try {
        const fd = fs.openSync(CLUB_MEMBER_FN, 'r', 0o666)
        data = fs.readFileSync(fd, { encoding: 'utf8' });
        fs.closeSync(fd);
    }
    catch (err) {
        console.log(err);
        process.exit(1)
    }
    // const clubMembers = JSON.parse(data)
    // return clubMembers;
    return JSON.parse(data);
}

// Save club members
const saveClubMembers = (CLUB_MEMBER_FN, newClubMembers) => {
    try {
        const fd = fs.openSync(CLUB_MEMBER_FN, 'w+', 0o666)
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
function getServer() {
    const server = new grpc.Server();
    server.addService(routeGuide.RouteGuide.service, {
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
    const routeServer = getServer();
    routeServer.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
        const argv = parseArgs(process.argv, {
            string: 'db_path'
        });
        fs.readFile(path.resolve(argv.db_path), function(err, data) {
            if (err) throw err;
            feature_list = JSON.parse(data);
            routeServer.start();
        });
    });
}

exports.getServer = getServer;