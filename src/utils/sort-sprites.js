const nameOrder = [
  "John Wick",
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
  "Ironmouse",
  "Pollo",
  "Llama",
  "Peely",
];

const typeOrder = [
  "Cube",
  "",
  "Gold",
  "Quack",
  "Gummy",
  "Galaxy",
  "Holofoil",
  "Gem",
];

export const sortSprites = (sprites) => {
  const spritesDataSorted = (sprites || []).sort((a, b) => {
    const type =
      nameOrder.findIndex((v) => a.name.includes(v)) -
      nameOrder.findIndex((v) => b.name.includes(v));

    if (type !== 0) return type;

    return (
      typeOrder.findIndex((r) => a.name.includes(r)) -
      typeOrder.findIndex((r) => b.name.includes(r))
    );
  });

  return spritesDataSorted;
};
