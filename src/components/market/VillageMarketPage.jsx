import { useEffect, useState } from "react";
import { getCurrentUser } from "../../services/authService";
import { getMyLocation } from "../../services/locationService";
import { getVillageMarketProducts } from "../../services/marketService";
import FilterBottomSheet from "../components/market/FilterBottomSheet";
import ProductDetailModal from "../components/market/ProductDetailModal";
import "../styles/VillageMarket.css";

function ProductThumbnail({ product, onSelect }) {
  const item = product.item;
  return (
    <button
      type="button"
      className="market-thumb"
      onClick={() => onSelect(product)}
    >
      <div className="market-thumb__image-wrapper">
        {item.img ? (
          <img src={item.img} alt={item.name} className="market-thumb__image" />
        ) : (
          <div className="market-thumb__fallback" />
        )}
      </div>
      <span className="market-thumb__label">{item.name}</span>
    </button>
  );
}

function ProductSection({ title, products, onSelect }) {
  if (products.length === 0) return null;
  return (
    <section className="market-section">
      <h2 className="market-section__title">{title}</h2>
      <div className="market-section__row">
        {products.map((p) => (
          <ProductThumbnail key={p.id} product={p} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
}

function ProductGrid({ products, onSelect }) {
  if (products.length === 0) {
    return <p className="market-empty">조건에 맞는 상품이 없습니다.</p>;
  }
  return (
    <div className="market-grid">
      {products.map((p) => (
        <ProductThumbnail key={p.id} product={p} onSelect={onSelect} />
      ))}
    </div>
  );
}

export default function VillageMarketPage() {
  const [user, setUser] = useState(null);
  const [regionKey, setRegionKey] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedCategories, setAppliedCategories] = useState([]);
  const [sortBy, setSortBy] = useState("expiration");

  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function init() {
    setLoading(true);
    const { user, error: userError } = await getCurrentUser();
    if (userError || !user) {
      setError("로그인이 필요한 서비스입니다.");
      setLoading(false);
      return;
    }
    setUser(user);

    const { data: locationData, error: locError } = await getMyLocation(user.id);
    if (locError || !locationData) {
      setError("지역 정보를 찾을 수 없습니다.");
      setLoading(false);
      return;
    }
    setRegionKey(locationData.region_key);

    await loadProducts(locationData.region_key, [], "expiration");
    setLoading(false);
  }

  async function loadProducts(rk, categoryNames, sort) {
    const { data, error: fetchError } = await getVillageMarketProducts(rk, {
      categoryNames,
      sortBy: sort,
    });
    if (fetchError) {
      setError("상품을 불러오는 중 오류가 발생했습니다.");
      return;
    }
    setProducts(data || []);
  }

  const handleApplyFilter = async (categories, sort) => {
    setAppliedCategories(categories);
    setSortBy(sort);
    setIsFilterOpen(false);
    await loadProducts(regionKey, categories, sort);
  };

  const handlePicked = async () => {
    setSelectedProduct(null);
    await loadProducts(regionKey, appliedCategories, sortBy); // PK-005: 거래된 상품 목록에서 제외
  };

  const isFiltering = searchText.trim().length > 0 || appliedCategories.length > 0;

  const searchedProducts = products.filter((p) =>
    (p.item?.name || "").toLowerCase().includes(searchText.trim().toLowerCase())
  );

  const recommended = products.slice(0, 3);
  const popular = products.slice(3, 6);

  return (
    <div className="village-market">
      <div className="village-market__searchbar">
        <div className="village-market__search-input-wrapper">
          <span className="village-market__search-icon" aria-hidden>
            🔍
          </span>
          <input
            className="village-market__search-input"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="텍스트를 입력해주세요"
          />
        </div>
        <button
          type="button"
          className="village-market__filter-btn"
          onClick={() => setIsFilterOpen(true)}
          aria-label="정렬 및 카테고리 필터"
        >
          ☰
        </button>
      </div>

      {loading && <p className="market-loading">불러오는 중...</p>}
      {error && <p className="market-error">{error}</p>}

      {!loading &&
        !error &&
        (isFiltering ? (
          <ProductGrid products={searchedProducts} onSelect={setSelectedProduct} />
        ) : (
          <>
            <ProductSection
              title="이런 식자재들은 어떠세요?"
              products={recommended}
              onSelect={setSelectedProduct}
            />
            <ProductSection
              title="다른 사람들이 많이 팔고있어요!"
              products={popular}
              onSelect={setSelectedProduct}
            />
          </>
        ))}

      {isFilterOpen && (
        <FilterBottomSheet
          initialCategories={appliedCategories}
          initialSortBy={sortBy}
          onClose={() => setIsFilterOpen(false)}
          onApply={handleApplyFilter}
        />
      )}

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          currentUserId={user?.id}
          onClose={() => setSelectedProduct(null)}
          onPicked={handlePicked}
        />
      )}
    </div>
  );
}