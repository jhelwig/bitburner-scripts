import { NS } from "@ns";

export async function main(ns: NS) {
  ns.disableLog("sleep");
  ns.disableLog("getPurchasedServers");
  ns.disableLog("getPurchasedServerMaxRam");
  ns.disableLog("getServerMaxRam");
  ns.disableLog("getPurchasedServerUpgradeCost");

  const delayTime = Number.parseInt(`${ns.args[0] || 5000}`);
  const thresholdMultiplier = Number.parseInt(`${ns.args[1] || 1.5}`); //Bigger threshold, the less it spends

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const ownedNodes = ns.hacknet.numNodes();
    let minValue = ns.hacknet.getPurchaseNodeCost();
    let nodeIndex = ownedNodes;
    let upgradeType = -1; //-1 -> purchase, 0 -> level, 1 -> ram, 2 -> core

    // ns.print("Checking for hacknet node upgrades");
    for (let i = 0; i < ownedNodes; i++) {
      const upgrades = [
        ns.hacknet.getLevelUpgradeCost(i, 1),
        ns.hacknet.getRamUpgradeCost(i, 1),
        ns.hacknet.getCoreUpgradeCost(i, 1)
      ];

      const value = Math.min(...upgrades);
      if (value < minValue) {
        minValue = value;
        nodeIndex = i;
        upgradeType = upgrades.indexOf(value);
      }
    }

    if (ns.getPlayer().money / thresholdMultiplier > minValue) {
      switch (upgradeType) {
        case -1:
          ns.hacknet.purchaseNode();
          ns.print(`Purchased node.`);
          break;
        case 0:
          ns.hacknet.upgradeLevel(nodeIndex, 1);
          ns.print(`Upgraded node ${nodeIndex} level.`);
          break;
        case 1:
          ns.hacknet.upgradeRam(nodeIndex, 1);
          ns.print(`Upgraded node ${nodeIndex} RAM.`);
          break;
        case 2:
          ns.hacknet.upgradeCore(nodeIndex, 1);
          ns.print(`Upgraded node ${nodeIndex} core count.`);
          break;
      }
    }

    // ns.print("Checking for owned server upgrades");
    const maxRam = ns.getPurchasedServerMaxRam();
    const startingPurchasedServerRam = 16;
    let serverName;
    let upgradeAmount;
    let serverUpgradeType = ServerUpgradeType.None;
    let minCost = ns.getPlayer().money / thresholdMultiplier;

    const ownedServers = ns.getPurchasedServers();


    if (ownedServers.length < ns.getPurchasedServerLimit()) {
      const purchaseCost = ns.getPurchasedServerCost(startingPurchasedServerRam);
      if (minCost > purchaseCost) {
        upgradeAmount = startingPurchasedServerRam;
        minCost = purchaseCost;
        serverUpgradeType = ServerUpgradeType.Purchase;
      }
    }

    for (const i in ownedServers) {
      const server = ownedServers[i];
      // ns.print(`Checking for upgrades to ${server}`);

      const currentRam = ns.getServerMaxRam(server);
      if (currentRam < maxRam) {
        const ramExponent = Math.pow(currentRam, 1 / 2);
        const ramUpgradeAmount = Math.pow(2, ramExponent + 1);
        const upgradeCost = ns.getPurchasedServerUpgradeCost(server, ramUpgradeAmount);
        if (upgradeCost < minCost) {
          minCost = upgradeCost;
          serverName = server;
          upgradeAmount = ramUpgradeAmount;
          serverUpgradeType = ServerUpgradeType.Ram;
        }
      }
    }

    switch (serverUpgradeType) {
      case ServerUpgradeType.Ram:
        if (serverName !== undefined && upgradeAmount !== undefined) {
          ns.upgradePurchasedServer(serverName, upgradeAmount);
          ns.print(`Upgraded server ${serverName} RAM to ${ns.formatRam(upgradeAmount)} / ${maxRam}`);
        }
        break;
      case ServerUpgradeType.Purchase:
        if (upgradeAmount !== undefined) {
          ns.purchaseServer("purchased", upgradeAmount);
          ns.print(`Purchased new server`);
        }
        break;
    }

    await ns.sleep(delayTime);
  }
}

enum ServerUpgradeType {
  None,
  Ram,
  Purchase,
}
