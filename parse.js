// Imports
const fs = require("fs");

(async () => {
  // Load loot data
  const data = await fs.readFileSync("./output/loot.json");
  const loot = JSON.parse(data);

  // Calculate attribute rarities
  let rarityIndex = {};
  for (let i = 0; i < loot.length; i++) {
    const attributes = loot[i][(i + 1).toString()];

    // Add up number of occurences of attributes
    for (const attribute of Object.values(attributes)) {
      rarityIndex[attribute] = rarityIndex[attribute]
        ? rarityIndex[attribute] + 1
        : 1;
    }
  }

  // Output occurences
  await fs.writeFileSync(
    "./output/occurences.json",
    JSON.stringify(rarityIndex)
  );

  // Calculate occurence of mythics in each bag
  let mythicCounts = [];
  let mythicStats = {};
  for (let i = 0; i < loot.length; i++) {
    let mythic = 0;
    const attributes = loot[i][(i + 1).toString()];

    for (const attribute of Object.values(attributes)) {
      if (rarityIndex[attribute] == 1) {
        // only add mythics to score
        mythic++;
      }
    }
    
    mythicCounts.push({ lootId: i + 1, mythic });

    mythicStats[mythic.toString()] = mythicStats[mythic.toString()] ? mythicStats[mythic.toString()] + 1 : 1;
  }

  // Sort by score
  mythicCounts = mythicCounts.sort((a, b) => b.mythic - a.mythic);
  // Sort by index of score
  mythicCounts = mythicCounts.map((loot, i) => ({
    ...loot
  }));

  // Print loot rarity
  await fs.writeFileSync("./output/mostMythical.json", JSON.stringify(mythicCounts));
  await fs.writeFileSync("./output/mythicalStats.json", JSON.stringify(mythicStats));
})();
