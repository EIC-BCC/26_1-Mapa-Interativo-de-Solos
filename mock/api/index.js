const jsonServer = require("json-server");
const buildDb = require("../db.js");

const server = jsonServer.create();
const router = jsonServer.router(buildDb());

server.use(jsonServer.defaults());
server.use(router);

module.exports = server;
