import styled from "styled-components";

import IngredientsFormField from "../components/IngredientsFormField";
import ImageUpload from "../assets/ImageUpload.svg";
import PreviousButton from "../components/PreviousButton";
import PlusButton from "../assets/StepperButton_Plus.svg";
import MinusButton from "../assets/StepperButton_Minus.svg";
import Navigation from "../components/Navigation";
import CategorySelect from "../components/CategorySelect";
import BottomSheetModal from "../components/BottomSheet";
import { useState } from "react";

function AddIngredientsPage() {
    let [quantity, setQuantity] = useState(0);
    const [category, setCategory] = useState("");
    const [open, setOpen] = useState(false);

    const PlusQuantity = () => {
        setQuantity((prev) => prev + 1);
    };
    const MinusQuantity = () => {
        if (quantity > 0) {
            setQuantity((prev) => prev - 1);
        }
    };

    return (
        <Root>
            <Header className="add-ingredients-page_header">
                <HeaderContent>
                    <PreviousButton alt="이전 버튼" to="/" />
                    <Title id="add-ingredients-page__title">식자재 등록</Title>
                </HeaderContent>
            </Header>
            <ContentDiv>
                <Form>
                    <ImageDiv>
                        <label htmlFor="image">식자재 사진</label>
                        <ImageUploadButton
                            src={ImageUpload}
                            alt="사진 업로드"
                            onClick={() => setOpen(true)}
                        />
                    </ImageDiv>
                    <div className="add-ingredients-page__categoryDiv">
                        <label htmlFor="category">카테고리</label>
                        <CategorySelect
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="카테고리"
                        >
                            <CategorySelect.Option value="fresh" icon="🥬">
                                신선식품
                            </CategorySelect.Option>
                            <CategorySelect.Option value="seafood" icon="🐟">
                                수산식품
                            </CategorySelect.Option>
                            <CategorySelect.Option value="processed" icon="🥫">
                                가공식품
                            </CategorySelect.Option>
                            <CategorySelect.Option value="livestock" icon="🥩">
                                축산식품
                            </CategorySelect.Option>
                            <CategorySelect.Option value="dairy" icon="🥛">
                                유제품
                            </CategorySelect.Option>
                            <CategorySelect.Option value="etc" icon="⋯">
                                기타
                            </CategorySelect.Option>
                        </CategorySelect>
                    </div>
                    <DateInputDiv className="dateInputDiv">
                        <div className="add-ingredients-page__purchaseDateDiv">
                            <label htmlFor="purchaseDate">구매 날짜</label>
                            <IngredientsFormField
                                id="purchaseDate"
                                type={"date"}
                                placeholder={"예) 2024년 6월 25일"}
                            />
                        </div>
                        <UseByDateDiv>
                            <label htmlFor="useByDate">
                                소비기한(유통기한)
                            </label>
                            <IngredientsFormField
                                type={"date"}
                                name="useByDate"
                                placeholder={"예) 2029년 6월 25일"}
                            />
                        </UseByDateDiv>
                    </DateInputDiv>
                    <div className="add-ingredients-page__qantityDiv">
                        <label htmlFor="quantity">식자재 수량</label>
                        <QuantityInputForm>
                            <img
                                src={MinusButton}
                                alt="수량 감소"
                                onClick={MinusQuantity}
                            />
                            <QuantityInput
                                type="number"
                                name="quantity"
                                value={quantity}
                                defaultValue={0}
                                onChange={setQuantity}
                            />
                            <img
                                src={PlusButton}
                                alt="수량 추가"
                                onClick={PlusQuantity}
                            />
                        </QuantityInputForm>
                    </div>
                    <div className="add-ingredients-page__storageConditionDiv">
                        <IngredientsFormField
                            id={"storageCondition"}
                            label={"보관상태"}
                            type={"text"}
                            name="storageCondistion"
                            placeholder={"보관해야하는 상태를 알려주세요"}
                        />
                    </div>
                    <SubmitButton type="submit">등록하기</SubmitButton>
                </Form>
                {/*식자재 등록__입력 폼*/}
            </ContentDiv>
            {/*식자재 등록_콘텐츠*/}
            <BottomSheetModal open={open} onClose={() => setOpen(false)} />
            <Navigation />/
        </Root>
    );
}

const Header = styled.header`
    box-sizing: border-box;
    max-width: 100%;
    width: 100%;
    height: 104px;

    padding: 0 24px;

    display: flex;
    justify-content: center;
    align-items: end;
`;

const HeaderContent = styled.div`
    display: flex;

    width: 402px;
    height: 32px;

    flex-direction: row;
    align-items: center;
`;
const ContentDiv = styled.div`
    display: flex;
    max-width: 354px;
    margin-bottom: 70px;
    flex-direction: column;
    gap: 40px;
    align-items: center; /* 추가 */
`;

const Form = styled.form`
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    gap: 40px;
    align-items: center; /* 추가 */
`;

const Title = styled.span`
    font-size: 20px;
    color: #383131;
    margin-left: 109px;
`;

const Root = styled.div`
    box-sizing: border-box;
    max-width: 402px;
    max-height: 1130px;
    margin: auto;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background-color: ##fffefa;

    gap: 40px;
`;

const ImageDiv = styled.div`
    width: 354px;
    height: 196px;
`;

const ImageUploadButton = styled.img`
    margin-top: 12px;
`;

const QuantityInputForm = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 12px;
`;

const QuantityInput = styled.input`
    border-style: none;
    text-align: center;

    font-size: 20px;

    max-width: 96px;
    max-height: 32px;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        appearance: none;
        -webkit-appearance: none;
        margin: 0;
    }
    &[type="number"] {
        appearance: textfield;
        -moz-appearance: textfield;
    }
`;

const SubmitButton = styled.button`
    box-sizing: border-box;

    max-width: 354px;
    width: 100%;
    max-height: 60px;
    padding: 8px 16px;

    background-color: #f6f1ed;
    border: none;
    border-radius: 6px;

    font-size: 20px;
    letter-spacing: -1px;
    line-height: 32px;
    font-family: Pretendard;
    color: #383131;
    text-align: center;
`;

const DateInputDiv = styled.div`
    width: 354px;
    height: 168px;
`;

const UseByDateDiv = styled.div`
    margin-top: 24px;
`;
export default AddIngredientsPage;
