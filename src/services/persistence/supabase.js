import { supabase } from "../../supabaseClient";

const loadSprites = async () => {
  const { data, error } = await supabase
    .from("sprites")
    .select("*")
    .order("sort_order", { ascending: true });

  return { data, error };
};

const loadUserSprites = async (userId) => {
  const { data, error } = await supabase
    .from("user_sprites")
    .select("*")
    .eq("user_id", userId);

  return { data, error };
};

const updateUserSprite = async (userId, spriteId, updated) => {
  await supabase.from("user_sprites").upsert({
    user_id: userId,
    sprite_id: spriteId,
    captured: updated.captured,
    level: updated.level,
    updated_at: new Date().toISOString(),
  });
};

export const SupabasePersistenceService = {
  loadSprites,
  loadUserSprites,
  updateUserSprite,
};
