// import {resolve} from "path";

const dotenv = require('dotenv');
const path = require('path');

process.env.NODE_ENV = process.env.NODE_ENV === 'test' ? "e2e" : process.env.NODE_ENV
const configFile = `env-${process.env.NODE_ENV}`
console.log(`config - configFile: ${configFile}`)
const configFileAbsolute =  path.resolve(__dirname, configFile)
console.log(`config - configFileAbsolute: ${configFileAbsolute}`)
dotenv.config({
    path: configFileAbsolute
});

console.log(`config - process.env.NODE_ENV: ${process.env.NODE_ENV}`)
console.log(`config - process.env.GRPC_PORT: ${ process.env.GRPC_PORT}`)
console.log(`config - CLUB_MEMBERS_RAW_FN: ${process.cwd() + process.env.CLUB_MEMBERS_RAW_FN}`)
console.log(`config - CLUB_MEMBERS_EDITED_FN: ${process.cwd() + process.env.CLUB_MEMBERS_EDITED_FN}`)
console.log(`config - TOURNAMENTS_RAW_FN: ${process.cwd() + process.env.TOURNAMENTS_RAW_FN}`)
console.log(`config - TOURNAMENTS_EDITED_FN: ${process.cwd() + process.env.TOURNAMENTS_EDITED_FN}`)
module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'dev',
    GRPC_PORT: process.env.GRPC_PORT || 50051,
    CLUB_MEMBERS_RAW_FN: process.cwd() + process.env.CLUB_MEMBERS_RAW_FN || process.cwd() + '/data/dev/club-members-raw.json',
    CLUB_MEMBERS_EDITED_FN: process.cwd() + process.env.CLUB_MEMBERS_EDITED_FN || process.cwd() + '/data/dev/club-members-edited.json',
    TOURNAMENTS_RAW_FN:  process.cwd() + process.env.CLUB_MEMBERS_RAW_FN || process.cwd() + '/data/dev/tournaments-raw.json',
    TOURNAMENTS_EDITED_FN:  process.cwd() + process.env.CLUB_MEMBERS_EDITED_FN || process.cwd() + '/data/dev/tournaments-edited.json'
}