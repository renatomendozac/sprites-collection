import { SPRITES } from "../constant/sprites";
import { TYPES } from "../constant/types";

export const sortSprites = (sprites) => {
  const spritesDataSorted = (sprites || []).sort((a, b) => {
    const type =
      SPRITES.findIndex((v) => a.name.includes(v)) -
      SPRITES.findIndex((v) => b.name.includes(v));

    if (type !== 0) return type;

    return (
      TYPES.findIndex((r) => a.name.includes(r)) -
      TYPES.findIndex((r) => b.name.includes(r))
    );
  });

  return spritesDataSorted;
};
