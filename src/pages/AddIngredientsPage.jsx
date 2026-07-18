import styled from "styled-components";

import CategoryDropdown from "../components/CategoryDropdown";
import IngredientsFormField from "../components/IngredientsFormField";
import ImageUpload from "../assets/ImageUpload.svg";
import PreviousButton from "../components/PreviousButton";

function AddIngredientsPage() {
    return (
        <Root>
            <Header className="add-ingredients-page_header">
                <PreviousButton alt="이전 버튼" to="/" />
                <Title id="add-ingredients-page__title">식자재 등록</Title>
            </Header>

            <ContentDiv>
                <form action="" className="add-ingredients-page__form">
                    <div className="add-ingredients-page__imageDiv">
                        <label htmlFor="image">식자재 사진</label>
                        <img src={ImageUpload} alt="사진 업로드" />
                    </div>

                    <div className="add-ingredients-page__categoryDiv">
                        <label htmlFor="category">카테고리</label>
                        <CategoryDropdown name="product_category" />
                    </div>
                    <div className="add-ingredients-page__purchaseDateDiv">
                        <label htmlFor="purchaseDate">구매 날짜</label>
                        <IngredientsFormField
                            id="purchaseDate"
                            type={"date"}
                            placeholder={"예) 2024년 6월 25일"}
                        />
                    </div>
                    <div className="add-ingredients-page__useByDateDiv">
                        <label htmlFor="useByDate">소비기한(유통기한)</label>
                        <IngredientsFormField
                            type={"date"}
                            name="useByDate"
                            placeholder={"예) 2029년 6월 25일"}
                        />
                    </div>
                    <div className="add-ingredients-page__qantityDiv">
                        <label htmlFor="quantity">식자재 수량</label>
                        <div>
                            <button type="button">
                                <img src="#" alt="수량 빼기" />
                            </button>
                            <input
                                type="number"
                                name="quantity"
                                defaultValue={0}
                            />
                            <button type="button">
                                <img src="#" alt="수량 더하기" />
                            </button>
                        </div>
                    </div>
                    <div className="add-ingredients-page__storageConditionDiv">
                        <label htmlFor="storageCondition">보관상태</label>
                        id, label, type = "text", placeholder, value, onChange
                        <IngredientsFormField
                            id={"storageCondition"}
                            label={"보관상태"}
                            type={"text"}
                            name="storageCondistion"
                            placeholder={"보관해야하는 상태를 알려주세요"}
                        />
                    </div>
                    <button type="submit">등록하기</button>
                </form>
                {/*식자재 등록__입력 폼*/}
            </ContentDiv>
            {/*식자재 등록_콘텐츠*/}
        </Root>
    );
}

const ContentDiv = styled.div`
    max-width: 354px;
`;

const Header = styled.header`
    width: 100%;
    height: 104px;

    display: flex;
    justify-content: center;
    align-items: end;
`;

const Title = styled.span`
    font-size: 24px;
`;

const Root = styled.div`
    max-width: 402px;

    display: flex;
    flex-direction: column;
    justify-content: center;
`;
export default AddIngredientsPage;
