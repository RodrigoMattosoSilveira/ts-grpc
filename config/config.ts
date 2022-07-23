const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`)
});

module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'dev',
    GRPC_PORT: process.env.GRPC_PORT || 50051,
    CLUB_MEMBERS_RAW_FN: process.env.CLUB_MEMBERS_RAW_FN || '/../data/dev/club-members-raw.json',
    CLUB_MEMBERS_EDITED_FN: process.env.CLUB_MEMBERS_EDITED_FN || '/../data/dev/club-members-edited.json',
    TOURNAMENTS_RAW_FN: process.env.CLUB_MEMBERS_RAW_FN || '/../data/dev/tournaments-raw.json',
    TOURNAMENTS_EDITED_FN: process.env.CLUB_MEMBERS_EDITED_FN || '/../data/dev/tournaments-edited.json'
}