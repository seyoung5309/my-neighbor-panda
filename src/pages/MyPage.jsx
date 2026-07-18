import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { getProfile } from "../services/profileService";
import { usePanda } from "../context/PandaContext";
import Panda from "../components/Panda";
import "../styles/MyPage.css";

const MENU_ITEMS = [
  {
    key: "ingredients",
    label: "내 식자재 확인하기",
    path: "/myingredients/select",
  },
  {
    key: "transactions",
    label: "내 거래내역 보기",
    path: "/mypage/transactions",
  },
  { key: "settings", label: "판다 설정", path: "/register/step4" },
];

export default function MyPage() {
  const navigate = useNavigate();
  const { colors } = usePanda();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      setLoading(true);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        if (isMounted) {
          setError(authError ?? new Error("로그인 정보가 없습니다."));
          setLoading(false);
        }
        return;
      }

      const { data, error: profileError } = await getProfile(user.id);

      if (isMounted) {
        if (profileError) {
          setError(profileError);
        } else {
          setProfile(data);
        }
        setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <div className="mypage-status">불러오는 중...</div>;
  }

  if (error) {
    return <div className="mypage-status">프로필을 불러오지 못했어요.</div>;
  }

  // TODO: level / level_label / progress 컬럼명은 실제 DB 스키마에 맞춰 조정
  const nickname = profile?.nickname ?? "닉네임 없음";
  const level = profile?.level ?? 1;
  const levelLabel = profile?.level_label ?? "땅바닥";
  const progress = profile?.progress ?? 0;

  return (
    <div className="mypage">
      <div className="mypage-hero">
        <h1 className="mypage-nickname">{nickname}</h1>
        <div className="mypage-panda-wrapper">
          <Panda g={colors.g} b={colors.b} w={colors.w} />
        </div>
      </div>

      <button
        className="mypage-level-card"
        onClick={() => navigate("/mypage/level")}
      >
        <div className="mypage-level-info">
          <span className="mypage-level-text">
            Level {level}. {levelLabel}
          </span>
          <span className="mypage-level-arrow">›</span>
        </div>
        <div className="mypage-progress-track">
          <div
            className="mypage-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </button>

      <div className="mypage-menu-list">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.key}
            className="mypage-menu-item"
            onClick={() => navigate(item.path)}
          >
            <span>{item.label}</span>
            <span className="mypage-menu-arrow">›</span>
          </button>
        ))}
      </div>
    </div>
  );
}
