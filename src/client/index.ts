import createClubMember from "./create-club-member";
import readClubMember from "./read-club-member";
import readClubMembers from "./read-club-members";
import updateClubMember from "./update-club-member";
import deleteClubMember from "./delete-club-member";
import {TClubMember, TClubMemberUpdate} from "../types/club-member-type";
import {MClubMember, MClubMemberEmpty} from "../proto/club-member_pb";
import {m_to_t, tUpdate_to_mUpdate} from "../utils/utils";
import shortid from "shortid";

function runCreateClubMember(tClubMember: TClubMember) {
    console.log(`client/runCreateClubMember - Creating a record`);
    createClubMember(tClubMember).
        then((newClubMember: MClubMember) => {
            console.log(`created club member: ${JSON.stringify(m_to_t(newClubMember))}`)
        }).
        catch((error: any) => {
            console.log(`error reading club member: ${error}`)
        })
}

function runReadClubMember(clubMemberId: string) {
    readClubMember(clubMemberId).
        then((clubMember: any) => {
            console.log(`read club member: ${JSON.stringify(m_to_t(clubMember))}`)
        }).
        catch((error: any) => {
            console.log(`error reading club member: ${error}`)
        })
    }

function runReadClubMembers(empty: MClubMemberEmpty): any {
    readClubMembers(empty).
        then((clubMembers: any) => {
            clubMembers.forEach((clubMember: MClubMember) => {
                console.log(`read club members: ${JSON.stringify(m_to_t(clubMember))}`)
            })
        }).
        catch((error: any) => {
            console.log(`error reading club members: ${error}`)
        });
}

function runUpdateClubMember(updateClubMemberU: TClubMemberUpdate) {
    // console.log(`client - runUpdateClubMember - 1: ${JSON.stringify(clubMember)}`);
    const mClubMember = tUpdate_to_mUpdate(updateClubMemberU)
    // console.log(`client - runUpdateClubMember 2: ${mClubMember.toString()}`);

    updateClubMember(mClubMember).
        then((updatedClubMember: MClubMember) => {
            console.log(`updated club member: ${JSON.stringify(m_to_t(updatedClubMember))}`)
        }).
        catch((error: any) => {
            console.log(`error updating club member: ${error}`)
        })
}

function runDeleteClubMember(clubMemberId: string) {
    deleteClubMember(clubMemberId).
        then((deletedClubMember: MClubMember) => {
            console.log(`deactivated club member: ${JSON.stringify(m_to_t(deletedClubMember))}`)
        }).
        catch((error: any) => {
            console.log(`error deactivaating club member: ${error}`)
        })
}

// TODO re-integrate them into the flow, as close to the flow start as possible
// const clubMemberCreateValidate = (clubMember: TClubMember) => {
//     let errorMessage = ``;
//
//     // Must have first name
//     if (!clubMember.hasOwnProperty('first')) {
//         const msg = `Missing first name`;
//         errorMessage += errorMessage === "" ? msg : `\n` + msg;
//     }
//
//     // Must have last name
//     if (!clubMember.hasOwnProperty('last')) {
//         const msg = `Missing first name`;
//         errorMessage += errorMessage === "" ? msg : `\n` + msg;
//     }
//
//     // Must have email address
//     if (!clubMember.hasOwnProperty('email')) {
//         const msg = `Missing first name`;
//         errorMessage += errorMessage === "" ? msg : `\n` + msg;
//     }
//
//     // Must have password
//     if (!clubMember.hasOwnProperty('password')) {
//         const msg = `Missing first name`;
//         errorMessage += errorMessage === "" ? msg : `\n` + msg;
//     }
//
//     // Must have cell phone
//     if (!clubMember.hasOwnProperty('cell')) {
//         const msg = `Missing first name`;
//         errorMessage += errorMessage === "" ? msg : `\n` + msg;
//     }
//     return errorMessage;
// }
//
// const clubMemberUpdateValidate = (clubMember: TClubMember) => {
//     let errorMessage = ``;
//
//     // Must have id
//     if (!clubMember.hasOwnProperty('id')) {
//         const msg = `Missing id`;
//         errorMessage += errorMessage === "" ? msg : `\n` + msg;
//     }
//     return errorMessage;
// }


/**
 * Run a demo based on the argument
 */
function main() {
    const myArgs = process.argv.slice(2);
    console.log('Function to Run: ', myArgs);

    switch (myArgs[0]) {
        case 'create':
            console.log(`client/main - Creating a record`);
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
            // TODO find the best place to validate the input
            runCreateClubMember(tClubMember);
            break;
        case 'readOne':
            console.log(`Reading one record`);
            // TODO find the best place to validate the input
            runReadClubMember(`ZasAIJcZQLR`);
            break;
        case 'readAll':
            console.log(`Reading all records`);
            runReadClubMembers(new MClubMemberEmpty());
            break;
        case 'update':
            console.log(`Updating a record`);
            // TODO find the best place to validate the input
            const updateClubMemberU: TClubMemberUpdate = {
                "id": "SCnr4kjwS-7",
                "rating": 1953
            }
            runUpdateClubMember(updateClubMemberU);
            break;
        case 'delete':
            console.log(`Deleting a record`);
            // TODO find the best place to validate the input
            runDeleteClubMember(`ZasAIJcZQLR`);
            break;
        default:
            console.log('Sorry, that is not something I know how to do.');
    }
}

if (require.main === module) {
    main();
}