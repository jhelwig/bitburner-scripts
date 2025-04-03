import { NS } from "@ns";

export async function main(ns: NS) {
  const targetServer = ns.args[0].toString();

  ns.run("prepare_server.js", 1, targetServer);
  ns.run("deploy.js", 1, targetServer, "localhack.js");
}
