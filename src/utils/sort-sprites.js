const nameOrder = [
  "Batman",
  "Water",
  "Earth",
  "Fire",
  "Duck",
  "Ghost",
  "Dream",
  "Demon",
  "Punk",
  "King",
  "Vini Jr",
  "Burnt Peanut",
  "Zero Point",
  "Fishy",
  "Striker",
  "Aura",
  "Boss",
  "Grim",
  "Air",
  "Seven",
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
