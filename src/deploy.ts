import { NS } from "@ns";

/** @param {NS} ns **/
export async function main(ns: NS) {
  const args = ns.flags([["help", false]]);
  if (args.help || ns.args.length < 2) {
    ns.tprint("This script deploys another script on a server with maximum threads possible.");
    ns.tprint(`Usage: run ${ns.getScriptName()} HOST SCRIPT ARGUMENTS`);
    ns.tprint("Example:");
    ns.tprint(`> run ${ns.getScriptName()} n00dles basic_hack.js`);
    return;
  }

  const host = ns.args[0].toString();
  const script = ns.args[1].toString();
  const script_args = ns.args.slice(2);

  if (!ns.serverExists(host)) {
    ns.tprint(`Server '${host}' does not exist. Aborting.`);
    return;
  }
  if (!ns.ls(ns.getHostname()).find(f => f === script)) {
    ns.tprint(`Script '${script}' does not exist. Aborting.`);
    return;
  }

  const threads = Math.floor((ns.getServerMaxRam(host) - ns.getServerUsedRam(host)) / ns.getScriptRam(script));
  ns.tprint(`Launching script '${script}' on server '${host}' with ${threads} threads and the following arguments: ${script_args}`);
  await ns.scp(script, host);
  ns.exec(script, host, threads, ...script_args);
}
