const nameOrder = [
  "Water",
  "Earth",
  "Fire",
  "Duck",
  "Demon",
  "Ghost",
  "King",
  "Punk",
  "Dream",
  "Zero Point",
  "Burnt Peanut",
  "Fishy",
  "Striker",
  "Aura",
  "Boss",
  "Grim",
];

const typeOrder = ["Gold", "Gummy", "Galaxy"];

export const sortSprites = (sprites) => {
  const spritesDataSorted = (sprites || []).sort((a, b) => {
    const type =
      nameOrder.findIndex((v) => a.name.includes(v)) -
      nameOrder.findIndex((v) => b.name.includes(v));

    if (type !== 0) return type;

    return (
      typeOrder.findIndex((r) => a.rarity.includes(r)) -
      typeOrder.findIndex((r) => b.rarity.includes(r))
    );
  });

  return spritesDataSorted;
};
