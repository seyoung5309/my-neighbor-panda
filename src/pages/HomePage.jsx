import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { getProfile } from "../services/profileService";
import { usePanda } from "../context/PandaContext";
import Panda from "../components/Panda";
import "../styles/HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const { colors } = usePanda();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await getProfile(user.id);
      if (isMounted) {
        setProfile(data);
        setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const level = profile?.level ?? 1;
  const levelLabel = profile?.level_label ?? "땅바닥";
  const progress = profile?.progress ?? 5;
  const currency = profile?.currency ?? 0;

  if (loading) {
    return <div className="homepage-status">불러오는 중...</div>;
  }

  return (
    <div className="homepage">
      <div className="homepage-top">
        <div className="homepage-level">
          <span className="homepage-level-text">
            Level {level}. {levelLabel}
          </span>
          <div className="homepage-progress-track">
            <div
              className="homepage-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          className="homepage-currency"
          onClick={() => navigate("/mypage")}
        >
          <span className="homepage-currency-icon">Ⓜ️</span>
          <span>{currency} M</span>
        </button>
      </div>

      <div className="homepage-stage">
        <div className="homepage-panda-wrapper">
          <Panda g={colors.g} b={colors.b} w={colors.w} />
        </div>

        <div className="homepage-fab-list">
          <button
            className="homepage-fab"
            aria-label="가방"
            onClick={() => navigate("/myingredients/select")}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
              <path
                d="M6 8h12l1 12H5L6 8Z"
                stroke="#2b2b2b"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="M9 8V6a3 3 0 0 1 6 0v2"
                stroke="#2b2b2b"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <button
            className="homepage-fab"
            aria-label="추가"
            onClick={() => navigate("/myingredients")}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
              <path
                d="M12 5v14M5 12h14"
                stroke="#2b2b2b"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
