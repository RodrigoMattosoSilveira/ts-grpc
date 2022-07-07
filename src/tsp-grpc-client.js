const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const CLUB_MEMBER_PROTO = __dirname + '/./proto/club-member.proto';
const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};

const packageDefinition = protoLoader.loadSync(CLUB_MEMBER_PROTO, options);
const ClubMemberService = grpc.loadPackageDefinition(packageDefinition).ClubMemberService;
const clubMemberClient = new ClubMemberService(
    "localhost:50051",
    grpc.credentials.createInsecure()
    );



function runCreateClubMember(callback) {
    function featureCallback(error, feature) {
        if (error) {
            callback(error);
        }
        else {
            console.log(`Created ${JSON.stringify(feature)}`)
        }
    }
    const clubMember = {
        first: `,Sergio`,
        last: `Craque`,
        email: `Sergio.Craque@yahoo.com`,
        password: `P4yUK9wYUzKZ`,
        cell: `4082345678`,
        rating: 1974
    }
    clubMemberClient.createClubMember(clubMember, featureCallback);
}

function runReadClubMember() {
    const clubMemberId = `ZasAIJcZQLR`;
    clubMemberClient.readClubMember({id: clubMemberId}, (error, clubMember) => {
        if (error) throw error;
        console.log(`Read club member: ${JSON.stringify(clubMember)}`)
    });
}

function runReadClubMembers() {
    clubMemberClient.readClubMembers({}, (error, clubMembers) => {
        if (error) throw error;
        console.log(`Read all club members: ${JSON.stringify(clubMembers)}`)
    });
}

function runUpdateClubMember(callback) {
    function featureCallback(error, feature) {
        if (error) {
            callback(error);
        }
        else {
            console.log(`Created ${JSON.stringify(feature)}`)
        }
    }
    const clubMember = {
        id: `SCnr4kjwS-7`,
        rating: 1609
    }
    clubMemberClient.updateClubMember(clubMember, featureCallback);
}

function runDeleteClubMember(callback) {
    function featureCallback(error, feature) {
        if (error) {
            callback(error);
        }
        else {
            console.log(`Deleted club member: ${JSON.stringify(feature)}`)
        }
    }
    const clubMemberId = `ZasAIJcZQLR`;
    clubMemberClient.deleteClubMember(clubMemberId, featureCallback);
}

/**
 * Run all of the demos in order
 */
function main() {
    const myArgs = process.argv.slice(2);
    console.log('Function to Run: ', myArgs);

    switch (myArgs[0]) {
        case 'create':
            console.log(`Creating a record`);
            // runCreateClubMember();
            break;
        case 'readOne':
            console.log(`Reading one record`);
            runReadClubMember();
            break;
        case 'readAll':
            console.log(`Reading all records`);
            runReadClubMembers();
            break;
        case 'update':
            console.log(`Updating a record`);
            // runUpdateClubMember();
            break;
        case 'delete':
            console.log(`Deleting a record`);
            // runDeleteClubMember();
            break;
        default:
            console.log('Sorry, that is not something I know how to do.');
    }
}

if (require.main === module) {
    main();
}

exports.main = main;
exports.runCreateClubMember = runCreateClubMember;
exports.runReadClubMember = runReadClubMember;
exports.runReadClubMembers = runReadClubMembers;
exports.runUpdateClubMember = runUpdateClubMember;
exports.runDeleteClubMember = runDeleteClubMember;
