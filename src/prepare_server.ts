import { NS } from "@ns";

export async function main(ns: NS) {
  const targetServer = ns.args[0].toString();

  try {
    if (ns.fileExists("BruteSSH.exe")) {
      ns.brutessh(targetServer);
    }
    if (ns.fileExists("FTPCrack.exe")) {
      ns.ftpcrack(targetServer);
    }
    if (ns.fileExists("relaySMTP.exe")) {
      ns.relaysmtp(targetServer);
    }
    if (ns.fileExists("HTTPWorm.exe")) {
      ns.httpworm(targetServer);
    }
    if (ns.fileExists("SQLInject.exe")) {
      ns.sqlinject(targetServer);
    }
  } catch (err) {
    ns.print(`Cannot crack port for ${targetServer}: ${err}`);
  }

  try {
    ns.nuke(targetServer);
  } catch (err) {
    ns.print(`Cannot nuke ${targetServer}: ${err}`);
  }
}
