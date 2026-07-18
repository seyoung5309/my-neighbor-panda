import styled from "styled-components";

function AddIngredientsPage() {
    return (
        <div className="add-ingredients-page">
            <header className="add-ingredients-page_header">
                <button id="add-ingredients-page__previousButton"></button>
                <span id="add-ingredients-page__title">식자재 등록</span>
            </header>

            <div className="add-ingredients-page_contents">
                <form action="" className="add-ingredients-page__form">
                    <div className="add-ingredients-page__imageDiv">
                        <label htmlFor="image">식자재 사진</label>
                        <input type="file" id="image" name="image" />
                    </div>

                    <div className="add-ingredients-page__categoryDiv">
                        <label htmlFor="category">카테고리</label>
                        <Category name="category" id="category">
                            <CategoryOpiton value="fresh">
                                🥬신선식품
                            </CategoryOpiton>
                            <CategoryOpiton value="seafood">
                                🐟수산식품
                            </CategoryOpiton>
                            <CategoryOpiton value="processed">
                                📦가공식품
                            </CategoryOpiton>
                            <CategoryOpiton value="livestock">
                                🥩축산식품
                            </CategoryOpiton>
                            <CategoryOpiton value="dairy">
                                🥛유제품
                            </CategoryOpiton>
                            <CategoryOpiton value="others">기타</CategoryOpiton>
                        </Category>
                    </div>

                    <div className="add-ingredients-page__purchaseDateDiv">
                        <label htmlFor="purchaseDate">구매 날짜</label>
                        <input
                            type="date"
                            name="purchaseDate"
                            placeholder="예) 2024년 6월 25일"
                        />
                    </div>

                    <div className="add-ingredients-page__useByDateDiv">
                        <label htmlFor="useByDate">소비기한(유통기한)</label>
                        <input
                            type="date"
                            name="useByDate"
                            placeholder="예) 2029년 6월 25일"
                        />
                    </div>

                    <div className="add-ingredients-page__qantityDiv">
                        <label htmlFor="quantity">식자재 수량</label>
                        <button type="button">
                            <img src="#" alt="수량 빼기" />
                        </button>
                        <input type="number" name="quantity" defaultValue={0} />
                        <button type="button">
                            <img src="#" alt="수량 더하기" />
                        </button>
                    </div>

                    <div className="add-ingredients-page__storageConditionDiv">
                        <label htmlFor="storageCondition">보관상태</label>
                        <input
                            type="text"
                            name="storageCondistion"
                            placeholder="보관해야하는 상태를 알려주세요"
                        />
                    </div>

                    <button type="submit">등록하기</button>
                </form>
                {/*식자재 등록__입력 폼*/}
            </div>
            {/*식자재 등록_콘텐츠*/}
        </div>
    );
}

const Category = styled.select`
    width: 354px;
    height: 48px;
`;

const CategoryOpiton = styled.option`
    width: 354px;
    height: 48px;
`;

export default AddIngredientsPage;
