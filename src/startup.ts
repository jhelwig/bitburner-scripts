import { NS } from "@ns";

export async function main(ns: NS) {
  ns.tprint("Startup executing...");
  ns.disableLog("ALL");

  ns.tprint("Startup finished...");
}
