import { supabase } from "../supabaseClient";

function UserHeaderActions({ user }) {
  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  };

  if (user) {
    return (
      <div className="user-header-actions">
        <div className="user-chip">
          {user.user_metadata?.avatar_url && (
            <img src={user.user_metadata.avatar_url} alt={user.email} />
          )}
          <span>{user.user_metadata?.full_name || user.email}</span>
        </div>
        <button className="logout-btn" onClick={() => supabase.auth.signOut()}>
          Salir
        </button>
      </div>
    );
  }

  return (
    <div>
      <button className="google-btn" onClick={signIn}>
        <svg viewBox="0 0 48 48">
          <path
            fill="#FFC107"
            d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 3l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
          />
          <path
            fill="#FF3D00"
            d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.1 8.1 3l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
          />
          <path
            fill="#4CAF50"
            d="M24 44c5.5 0 10.4-1.8 14.3-5l-6.6-5.4C29.5 35.3 26.9 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.6 5.1C9.6 39.6 16.2 44 24 44z"
          />
          <path
            fill="#1976D2"
            d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.6 5.4C41.6 36 44 30.7 44 24c0-1.3-.1-2.7-.4-3.5z"
          />
        </svg>
        Iniciar sesión
      </button>
    </div>
  );
}

export default UserHeaderActions;
