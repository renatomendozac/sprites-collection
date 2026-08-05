import { SPRITES } from "../constant/sprites";
import { TYPES } from "../constant/types";

const TYPE_INDEX = new Map(TYPES.map((type, index) => [type, index]));

export const groupBySprite = (sprites) => {
  const grouped = Object.fromEntries(
    SPRITES.map((spriteName) => [
      spriteName,
      new Array(TYPES.length).fill(null),
    ]),
  );

  for (const sprite of sprites) {
    for (const spriteName of SPRITES) {
      if (!sprite.name.includes(spriteName)) continue;

      const group = grouped[spriteName];

      for (const type of TYPES) {
        const index = TYPE_INDEX.get(type);
        if (group[index] !== null) continue;
        if (!sprite.name.includes(type)) continue;

        group[index] = sprite;
        break;
      }
    }
  }

  return grouped;
};
