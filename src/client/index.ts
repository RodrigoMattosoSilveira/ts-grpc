import createClubMember from "./create-club-member";
import readClubMember from "./read-club-member";
import readClubMembers from "./read-club-members";
import updateClubMember from "./update-club-member";
import deleteClubMember from "./delete-club-member";
import {TClubMember, TClubMemberUpdate} from "../types/club-member-type";
import {MClubMember} from "../proto/club-member_pb";
import {m_to_t} from "../utils/utils";

function runCreateClubMember() {
    const mClubMember = new MClubMember();
    mClubMember.setFirst(`Sergio`);
    mClubMember.setLast(`Craque`);
    mClubMember.setPassword(`P4yUK9wYUzKZ`);
    mClubMember.setEmail(`Sergio.Craque@yahoo.com`);
    mClubMember.setCell(`4082345678`);
    mClubMember.setRating(1974);
    createClubMember(mClubMember).then((newClubMember: MClubMember) => {
        console.log(`created club member: ${JSON.stringify(newClubMember)}`)
    })
    // const newClubMember: MClubMember = createClubMember(mClubMember);
    // const newClubMemberT: TClubMember = {
    //     id: newClubMember.getId(),
    //     first: newClubMember.getFirst(),
    //     last: newClubMember.getLast(),
    //     email: newClubMember.getEmail(),
    //     password: newClubMember.getPassword(),
    //     cell: newClubMember.getCell(),
    //     rating: newClubMember.getRating(),
    //     status: newClubMember.getStatus()
    // }
    // console.log(`created club member: ${JSON.stringify(newClubMemberT)}`)
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

function runReadClubMembers() {
    const clubMembers = readClubMembers()
    console.log(`read ${clubMembers.length}`);
}

function runUpdateClubMember(MUpdateClubMember: any) {
    const mClubMember = new MClubMember();

    mClubMember.setId(MUpdateClubMember.id);
    MUpdateClubMember.hasOwnProperty('first') ? mClubMember.setFirst(MUpdateClubMember.fist) : false;
    MUpdateClubMember.hasOwnProperty('last') ? mClubMember.setLast(MUpdateClubMember.last) : false;
    MUpdateClubMember.hasOwnProperty('password') ? mClubMember.setPassword(MUpdateClubMember.password) : false;
    MUpdateClubMember.hasOwnProperty('email') ? mClubMember.setEmail(MUpdateClubMember.email) : false;
    MUpdateClubMember.hasOwnProperty('cell') ? mClubMember.setCell(MUpdateClubMember.cell) : false;
    MUpdateClubMember.hasOwnProperty('rating') ? mClubMember.setRating(MUpdateClubMember.rating) : false;
    MUpdateClubMember.hasOwnProperty('status') ? mClubMember.setStatus(MUpdateClubMember.status) : false;

    const updatedClubMember: MClubMember = updateClubMember(mClubMember);
    const updatedClubMemberT: TClubMember = {
        id: updatedClubMember.getId(),
        first: updatedClubMember.getFirst(),
        last: updatedClubMember.getLast(),
        email: updatedClubMember.getEmail(),
        password: updatedClubMember.getPassword(),
        cell: updatedClubMember.getCell(),
        rating: updatedClubMember.getRating(),
        status: updatedClubMember.getStatus()
    }

    console.log(`updated club member: ${JSON.stringify(updatedClubMemberT)}`)
}

function runDeleteClubMember(clubMemberId: string) {
    const clubMember: MClubMember = deleteClubMember(clubMemberId);
    const deletedClubMemberT: TClubMember = {
        id: clubMember.getId(),
        first: clubMember.getFirst(),
        last: clubMember.getLast(),
        email: clubMember.getEmail(),
        password: clubMember.getPassword(),
        cell: clubMember.getCell(),
        rating: clubMember.getRating(),
        status: clubMember.getStatus()
    }
    console.log(`deleted club member: ${JSON.stringify(deletedClubMemberT)}`)
}


/**
 * Run a demo based on the argument
 */
function main() {
    const myArgs = process.argv.slice(2);
    console.log('Function to Run: ', myArgs);

    switch (myArgs[0]) {
        case 'create':
            console.log(`Creating a record`);
            runCreateClubMember();
            break;
        case 'readOne':
            console.log(`Reading one record`);
            runReadClubMember(`ZasAIJcZQLR`);
            break;
        case 'readAll':
            console.log(`Reading all records`);
            runReadClubMembers();
            break;
        case 'update':
            console.log(`Updating a record`);
            const updateClubMember: TClubMemberUpdate = {
                id: `SCnr4kjwS`,
                rating: 1609
            }
            runUpdateClubMember(updateClubMember);
            break;
        case 'delete':
            console.log(`Deleting a record`);
            runDeleteClubMember(`ZasAIJcZQLR`);
            break;
        default:
            console.log('Sorry, that is not something I know how to do.');
    }
}

if (require.main === module) {
    main();
}