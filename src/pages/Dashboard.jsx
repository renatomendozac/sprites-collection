import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../supabaseClient";
import html2canvas from "html2canvas";
import { RARITIES } from "../constant/rarities";
import { sortSprites } from "../utils/sort-sprites";
import { downloadImage } from "../utils/download-image";

const rarityColor = (rarity) => {
  const map = {
    Common: "#9AA5BD",
    Uncommon: "#5FD16B",
    Rare: "#4FA3FF",
    Epic: "#B14FFF",
    Legendary: "#FF8A3D",
    Mythic: "#2FE6E0",
  };

  return map[rarity] || "#9AA5BD";
};

const placeholderSvg = () => {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#0A0F1E"/><text x="50" y="55" font-size="12" fill="#3a4a70" text-anchor="middle" font-family="monospace">sin foto</text></svg>`;
};

const showFilterRarity = false;

function Dashboard({ session }) {
  const user = session.user;
  const [sprites, setsprites] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rarityFilter, setRarityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const topRef = useRef(0);
  const summaryRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const { data: spritesData, error: spritesError } = await supabase
        .from("sprites")
        .select("*")
        .order("sort_order", { ascending: true });

      const { data: progressData, error: progressError } = await supabase
        .from("user_sprites")
        .select("*")
        .eq("user_id", user.id);

      if (spritesError) console.error(spritesError);
      if (progressError) console.error(progressError);

      const progressMap = {};
      (progressData || []).forEach((p) => {
        progressMap[p.sprite_id] = { captured: p.captured, level: p.level };
      });

      setsprites(sortSprites(spritesData || []));
      setProgress(progressMap);
      setLoading(false);
    };

    loadData();
  }, []);

  const toggleCaptured = async (spriteId) => {
    const current = progress[spriteId] || { captured: false, level: 1 };
    const updated = { captured: !current.captured, level: current.level || 1 };
    setProgress((p) => ({ ...p, [spriteId]: updated }));

    await supabase.from("user_sprites").upsert({
      user_id: user.id,
      sprite_id: spriteId,
      captured: updated.captured,
      level: updated.level,
      updated_at: new Date().toISOString(),
    });
  };

  const setLevel = async (spriteId, level) => {
    const current = progress[spriteId] || { captured: true, level: 1 };
    if (!current.captured) {
      return;
    }

    const updated = { ...current, level };
    setProgress((p) => ({ ...p, [spriteId]: updated }));

    await supabase.from("user_sprites").upsert({
      user_id: user.id,
      sprite_id: spriteId,
      captured: updated.captured,
      level: updated.level,
      updated_at: new Date().toISOString(),
    });
  };

  const filtered = useMemo(() => {
    return sprites.filter((s) => {
      const p = progress[s.id] || { captured: false, level: 1 };
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (rarityFilter !== "all" && s.rarity !== rarityFilter) return false;
      if (statusFilter === "captured" && !p.captured) return false;
      if (statusFilter === "missing" && p.captured) return false;
      if (statusFilter === "leveling" && !(p.captured && p.level < 5))
        return false;
      return true;
    });
  }, [sprites, progress, search, rarityFilter, statusFilter]);

  const total = sprites.length;
  const capturedCount = sprites.filter((s) => progress[s.id]?.captured).length;
  const maxedCount = sprites.filter(
    (s) => progress[s.id]?.captured && progress[s.id]?.level >= 5,
  ).length;
  const pct = total ? Math.round((capturedCount / total) * 100) : 0;

  const downloadSummary = async () => {
    const node = summaryRef.current;
    node.style.display = "block";

    await new Promise((resolve) => requestAnimationFrame(resolve));
    await downloadImage(node);

    node.style.display = "none";
  };

  return (
    <div className="app-shell">
      <div className="topbar">
        <div className="brand">
          <div className="eyebrow">// Registro de espíritus</div>
          <h1>My Sprite Collection</h1>
          <p>
            My Sprite Collection helps Fortnite players track every Sprite, mark
            collected Sprites and discover missing ones.
          </p>
        </div>
        <div className="user-chip">
          {user.user_metadata?.avatar_url && (
            <img src={user.user_metadata.avatar_url} alt={user.email} />
          )}
          <span>{user.user_metadata?.full_name || user.email}</span>
          <button
            className="logout-btn"
            onClick={() => supabase.auth.signOut()}
          >
            Salir
          </button>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <b>{total}</b>
          <span>Total</span>
        </div>
        <div className="stat">
          <b>{capturedCount}</b>
          <span>Conseguidos</span>
        </div>
        <div className="stat">
          <b>{total - capturedCount}</b>
          <span>Me faltan</span>
        </div>
        <div className="stat">
          <b>{maxedCount}</b>
          <span>Nivel 5</span>
        </div>
        <div className="stat">
          <b>{pct}%</b>
          <span>Avance</span>
        </div>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Buscar espíritu…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="chip-row">
          <button
            className={`chip ${statusFilter === "all" ? "active" : ""}`}
            onClick={() => setStatusFilter("all")}
          >
            Todos
          </button>
          <button
            className={`chip ${statusFilter === "captured" ? "active" : ""}`}
            onClick={() => setStatusFilter("captured")}
          >
            Conseguidos
          </button>
          <button
            className={`chip ${statusFilter === "missing" ? "active" : ""}`}
            onClick={() => setStatusFilter("missing")}
          >
            Me faltan
          </button>
          <button
            className={`chip ${statusFilter === "leveling" ? "active" : ""}`}
            onClick={() => setStatusFilter("leveling")}
          >
            Por subir nivel
          </button>
        </div>
        <button className="download-btn" onClick={downloadSummary}>
          ⬇ Descargar resumen
        </button>
      </div>

      {showFilterRarity && (
        <div className="chip-row" style={{ marginBottom: 18 }}>
          <button
            className={`chip ${rarityFilter === "all" ? "active" : ""}`}
            onClick={() => setRarityFilter("all")}
          >
            Toda rareza
          </button>
          {RARITIES.map((r) => (
            <button
              key={r.id}
              className={`chip ${rarityFilter === r.id ? "active" : ""}`}
              onClick={() => setRarityFilter(r.id)}
            >
              {r.label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="loading-msg mono">// Cargando catálogo…</div>
      ) : sprites.length === 0 ? (
        <div className="empty-msg">
          // Aún no hay espíritus cargados en el catálogo. Súbelos desde
          Supabase (tabla "sprites").
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-msg">
          // Ningún espíritu coincide con este filtro.
        </div>
      ) : (
        <div className="grid">
          {filtered.map((s) => {
            const p = progress[s.id] || { captured: false, level: 1 };
            return (
              <div
                key={s.id}
                className={`card ${s.rarity} ${p.captured ? "captured" : ""}`}
              >
                <div className="imgbox">
                  <span
                    className="rarity-tag"
                    style={{ background: rarityColor(s.rarity) }}
                  >
                    {RARITIES.find((r) => r.id === s.rarity)?.label || s.rarity}
                  </span>
                  {p.captured && <span className="captured-badge">✓</span>}
                  {s.image_url ? (
                    <img src={s.image_url} alt={s.name} />
                  ) : (
                    <img
                      src={`data:image/svg+xml;utf8,${encodeURIComponent(placeholderSvg())}`}
                      alt={s.name}
                    />
                  )}
                </div>
                <div className="info">
                  <h3>{s.name}</h3>
                  <div className="toggle-row">
                    <div
                      className={`capture-toggle ${p.captured ? "on" : ""}`}
                      onClick={() => toggleCaptured(s.id)}
                    >
                      <span className="box" />{" "}
                      {p.captured ? "Conseguido" : "Sin conseguir"}
                    </div>
                  </div>
                  <div className="levels">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        key={lvl}
                        className={p.captured && lvl <= p.level ? "filled" : ""}
                        disabled={!p.captured}
                        onClick={() => setLevel(s.id, lvl)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div id="summary-export" ref={summaryRef} style={{ display: "none" }}>
        <h2>myspritecollection.com</h2>
        <div className="sub">
          {user.user_metadata?.full_name || user.email} · {capturedCount}/
          {total} espíritus · {new Date().toLocaleDateString("es-ES")}
        </div>
        <div className="sgrid">
          {sprites.map((s) => {
            const p = progress[s.id] || { captured: false, level: 1 };
            return (
              <div key={s.id} className={`scard ${p.captured ? "" : "miss"}`}>
                <div className="si">
                  {s.image_url ? <img src={s.image_url} /> : null}
                </div>
                <div className="sn">{s.name}</div>
                <div className="sbar">
                  <i
                    style={{
                      width: p.captured ? `${(p.level / 5) * 100}%` : "0%",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
