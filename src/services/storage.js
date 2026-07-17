import { LocalStoragePersistenceService } from "./persistence/localstorage";
import { SupabasePersistenceService } from "./persistence/supabase";

const loadSprites = async (isLogged) => {
  return await SupabasePersistenceService.loadSprites();
};

const loadUserSprites = async (userId) => {
  if (userId) {
    return await SupabasePersistenceService.loadUserSprites(userId);
  }

  return LocalStoragePersistenceService.loadUserSprites();
};

const updateUserSprite = async (userId, spriteId, updated) => {
  if (userId) {
    await SupabasePersistenceService.updateUserSprite(
      userId,
      spriteId,
      updated,
    );

    return;
  }

  LocalStoragePersistenceService.updateUserSprite(spriteId, updated);
};

export const StorageService = {
  loadSprites,
  loadUserSprites,
  updateUserSprite,
};
