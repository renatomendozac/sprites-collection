const localStorageKey = "myspritecollection";

const loadUserSprites = () => {
  const localstorage = localStorage.getItem(localStorageKey);
  const data = localstorage ? JSON.parse(localstorage) : [];

  return { data };
};

const updateUserSprite = (spriteId, updated) => {
  const { data: userSprites } = loadUserSprites();

  const existingIndex = userSprites.findIndex(
    (sprite) => sprite.sprite_id === spriteId,
  );

  if (existingIndex === -1) {
    userSprites.push({ sprite_id: spriteId, ...updated });
  } else {
    userSprites[existingIndex] = { ...userSprites[existingIndex], ...updated };
  }

  localStorage.setItem(localStorageKey, JSON.stringify(userSprites));
};

export const LocalStoragePersistenceService = {
  loadUserSprites,
  updateUserSprite,
};
