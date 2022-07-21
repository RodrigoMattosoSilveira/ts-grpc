import shortid from "shortid";

import {TClubMember, TClubMemberUpdate} from "../../types/club-member-type";
import {MClubMember, MClubMemberEmpty} from "../proto/club-member_pb";
import clubMemberCreate from "./club-member-create";
import clubMemberRead from "./club-member-read";
import clubMembersRead from "./club-members-read";
import clubMemberUpdate from "./club-member-update";
import clubMemberDelete from "./club-member-delete";

import {STATUS_PLANNED} from "../../types/other";

import tournamentCreate from "./tournament-create";
import {tournament_m_to_t} from "../../utils/tournament-utils";

import {
    TOURNAMENT_SCORE_DRAW, TOURNAMENT_SCORE_LOSS,
    TOURNAMENT_SCORE_WIN,
    TOURNAMENT_TYPE_SWISS,
    TTournament
} from "../../types/tournament-types";
import {MTournament} from "../proto/tournament_pb";
import {m_to_t, tUpdate_to_mUpdate} from "../../utils/club-member-utils";
import {tournamentRead} from "./tournament-read";


// Club Member Operations
function runCreateClubMember(tClubMember: TClubMember) {
    console.log(`client/runCreateClubMember - Creating a record`);
    clubMemberCreate(tClubMember).
        then((newClubMember: MClubMember) => {
            console.log(`created club member: ${JSON.stringify(m_to_t(newClubMember))}`)
        }).
        catch((error: any) => {
            console.log(`error creating club member: ${error}`)
        })
}

function runReadClubMember(clubMemberId: string) {
    clubMemberRead(clubMemberId).
        then((clubMember: any) => {
            console.log(`read club member: ${JSON.stringify(m_to_t(clubMember))}`)
        }).
        catch((error: any) => {
            console.log(`error reading club member: ${error}`)
        })
    }

function runReadClubMembers(empty: MClubMemberEmpty): any {
    clubMembersRead(empty).
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

    clubMemberUpdate(mClubMember).
        then((updatedClubMember: MClubMember) => {
            console.log(`updated club member: ${JSON.stringify(m_to_t(updatedClubMember))}`)
        }).
        catch((error: any) => {
            console.log(`error updating club member: ${error}`)
        })
}

function runDeleteClubMember(clubMemberId: string) {
    clubMemberDelete(clubMemberId).
        then((deletedClubMember: MClubMember) => {
            console.log(`deactivated club member: ${JSON.stringify(m_to_t(deletedClubMember))}`)
        }).
        catch((error: any) => {
            console.log(`error deactivaating club member: ${error}`)
        })
}

// Tournament Operations
function runCreateTournament(tTournament: TTournament) {
    console.log(`client/runCreateTournament - Creating a record: ${JSON.stringify(tTournament)}`);
    tournamentCreate(tTournament).
        then((newTournament: MTournament) => {
            console.log(`created tournament: ${JSON.stringify(tournament_m_to_t(newTournament))}`)
        }).
        catch((error: any) => {
            console.log(`error creating tournament: ${error}`)
        })
}

function runReadTournament(tournamentId: string) {
    tournamentRead(tournamentId).
        then((tournament: any) => {
            console.log(`read tournament: ${JSON.stringify(tournament_m_to_t(tournament))}`)
        }).
        catch((error: any) => {
            console.log(`error reading tournament: ${error}`)
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
        // Club Member Operations
        case 'createCM':
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
        case 'readOneCM':
            console.log(`Reading one record`);
            // TODO find the best place to validate the input
            runReadClubMember(`ZasAIJcZQLR`);
            break;
        case 'readAllCM':
            console.log(`Reading all records`);
            runReadClubMembers(new MClubMemberEmpty());
            break;
        case 'updateCM':
            console.log(`Updating a record`);
            // TODO find the best place to validate the input
            const updateClubMemberU: TClubMemberUpdate = {
                "id": "SCnr4kjwS-7",
                "rating": 1953
            }
            runUpdateClubMember(updateClubMemberU);
            break;
        case 'deleteCM':
            console.log(`Deleting a record`);
            // TODO find the best place to validate the input
            runDeleteClubMember(`ZasAIJcZQLR`);
            break;
        // Tournament Operations
        case 'createT':
            console.log(`client/main - Creating a record`);
            const tTournament: TTournament = {
                id: shortid.generate(),                 // 1
                director: "gP1cgfAhA8",                 // 2
                name: "Laclede Rounds",                 // 3
                start: "1667610000000",                   // 4
                end: "1667786400",                        // 5
                maxPlayers: 36,                         // 6
                type: TOURNAMENT_TYPE_SWISS,            // 7
                numberOfRounds: 6,                      // 8
                winPoints: TOURNAMENT_SCORE_WIN,        // 9
                drawPoints: TOURNAMENT_SCORE_DRAW,      // 10
                lossPoints: TOURNAMENT_SCORE_LOSS,      // 11
                players: [],                            // 12
                rounds: [],                             // 13
                status: STATUS_PLANNED                  // 14
            }
            // TODO find the best place to validate the input
            runCreateTournament(tTournament);
            break;
        case 'readOneT':
            const tournamentId = "Fmrg6J81A";
            console.log(`Reading one tournament record ${tournamentId}`);
            // TODO find the best place to validate the input
            runReadTournament(tournamentId);
            break;
        default:
            console.log('Sorry, that is not something I know how to do.');
    }
}

if (require.main === module) {
    main();
}