import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { getMyItems } from "../services/itemService";
import IngredientCard from "./IngredientCard";

const imgChevronLeft =
  "https://www.figma.com/api/mcp/asset/8ce1394e-4eca-4355-95e9-fc4b89672ab2";

/**
 * SelectIngredientsPage ("식자재 확인하기")
 * 실제 로그인 유저의 items 데이터를 Supabase에서 가져와 그리드로 표시.
 */
export default function SelectIngredientsPage() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchItems = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (isMounted) {
          setError(new Error("로그인이 필요합니다."));
          setLoading(false);
        }
        return;
      }

      const { data, error: fetchError } = await getMyItems(user.id);

      if (isMounted) {
        if (fetchError) {
          setError(fetchError);
        } else {
          setItems(data ?? []);
        }
        setLoading(false);
      }
    };

    fetchItems();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 402,
        margin: "0 auto",
        background: "#FFFEFA",
        fontFamily: "'Pretendard', sans-serif",
        paddingBottom: 32,
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div style={{ position: "relative", height: 124 }}>
        <button
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
          style={{
            position: "absolute",
            left: 24,
            top: 76,
            width: 24,
            height: 24,
            padding: 0,
            border: "none",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          <img
            src={imgChevronLeft}
            alt=""
            style={{ width: "100%", height: "100%" }}
          />
        </button>

        <p
          style={{
            position: "absolute",
            left: "50%",
            top: 72,
            transform: "translateX(-50%)",
            margin: 0,
            whiteSpace: "nowrap",
            fontWeight: 500,
            fontSize: 20,
            lineHeight: "32px",
            letterSpacing: "-1px",
            color: "#383131",
          }}
        >
          식자재 확인하기
        </p>
      </div>

      {loading && (
        <p style={{ textAlign: "center", color: "#8a8a8a", marginTop: 60 }}>
          불러오는 중...
        </p>
      )}

      {!loading && error && (
        <p style={{ textAlign: "center", color: "#8a8a8a", marginTop: 60 }}>
          식자재 목록을 불러오지 못했어요.
        </p>
      )}

      {!loading && !error && items.length === 0 && (
        <p style={{ textAlign: "center", color: "#8a8a8a", marginTop: 60 }}>
          아직 등록된 식자재가 없어요.
        </p>
      )}

      {!loading && !error && items.length > 0 && (
        <div
          style={{
            padding: "0 24px",
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
            columnGap: 12,
          }}
        >
          {items.map((item) => (
            <IngredientCard
              key={item.id}
              image={item.img}
              label={item.name}
              onClick={() => navigate(`/myingredients/select/${item.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}