import { NS } from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {
  const hostname = ns.getHostname();
  const moneyThreshold = ns.getServerMaxMoney(hostname);
  const securityThreshold = ns.getServerMinSecurityLevel(hostname);

  if (ns.fileExists("BruteSSH.exe", "home")) {
    ns.brutessh(hostname);
  }

  // Only attempt to nuke if we don't already have root access to the server.
  if (!ns.hasRootAccess(hostname)) {
    ns.nuke(hostname);
  }

  while (true) {
    if (ns.getServerSecurityLevel(hostname) > securityThreshold) {
      await ns.weaken(hostname);
    } else if (ns.getServerMoneyAvailable(hostname) < moneyThreshold) {
      await ns.grow(hostname);
    } else {
      await ns.hack(hostname);
    }
  }
}
