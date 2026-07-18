import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AuthCallback() {
  useEffect(() => {
    const handleAuth = async () => {
      const hash = window.location.hash;

      console.log("hash:", hash);

      const params = new URLSearchParams(
        hash.substring(1)
      );

      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      console.log({
        access_token,
        refresh_token,
      });

      if (access_token && refresh_token) {
        const { data, error } =
          await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

        console.log("session result:", data);
        console.log("session error:", error);

        if (!error) {
          window.location.href = "/";
        }
      }
    };

    handleAuth();
  }, []);

  return <div>로그인 처리 중...</div>;
}