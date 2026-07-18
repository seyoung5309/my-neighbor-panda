function AddIngredientsPage() {
    return (
        <div className="add-ingredients-page">
            <div className="add-ingredients-page_contents">
                <form action="" className="add-ingredients-page__form">
                    <label htmlFor="image">식자재 사진</label>
                    <input type="file" id="image" name="image" />

                    <label htmlFor="category">카테고리</label>
                    <select name="category" id="category">
                        <option value="fresh">신선식품</option>
                        <option value="seafood">수산식품</option>
                        <option value="processed">가공식품</option>
                        <option value="livestock">축산식품</option>
                        <option value="dairy">유제품</option>
                        <option value="others">기타</option>
                    </select>

                    <label htmlFor="purchaseDate">구매 날짜</label>
                    <input
                        type="date"
                        name="purchaseDate"
                        placeholder="예) 2024년 6월 25일"
                    />

                    <label htmlFor="useByDate">소비기한(유통기한)</label>
                    <input
                        type="date"
                        name="useByDate"
                        placeholder="예) 2029년 6월 25일"
                    />

                    <label htmlFor="quantity">식자재 수량</label>
                    <button type="button">
                        <img src="#" alt="수량 빼기" />
                    </button>
                    <input type="number" name="quantity" defaultValue={0} />
                    <button type="button">
                        <img src="#" alt="수량 더하기" />
                    </button>

                    <label htmlFor="storageCondition">보관상태</label>
                    <input
                        type="text"
                        name="storageCondistion"
                        placeholder="보관해야하는 상태를 알려주세요"
                    />
                    <button type="submit">등록하기</button>
                </form>
                {/*식자재 등록__입력 폼*/}
            </div>
            {/*식자재 등록_콘텐츠*/}
        </div>
    );
}

export default AddIngredientsPage;
