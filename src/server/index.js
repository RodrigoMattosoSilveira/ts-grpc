"use strict";
exports.__esModule = true;
var grpc_js_1 = require("@grpc/grpc-js");
var club_member_grpc_pb_1 = require("../proto/club-member_grpc_pb");
var club_member_services_1 = require("./club-member-services");
var server = new grpc_js_1.Server();
// TODO Find a way to remove this ts-ignore
// @ts-ignore
server.addService(club_member_grpc_pb_1.SClubMemberService, new club_member_services_1.ClubMemberServices());
var port = 3000;
var uri = "localhost:".concat(port);
console.log("Listening on ".concat(uri));
server.bind(uri, grpc_js_1.ServerCredentials.createInsecure());
server.start();
