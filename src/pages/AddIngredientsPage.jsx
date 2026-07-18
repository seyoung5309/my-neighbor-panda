import styled from "styled-components";
import IngredientsFormField from "../components/IngredientsFormField";
import ImageUpload from "../assets/ImageUpload.svg";
import PreviousButton from "../components/PreviousButton";
import PlusButton from "../assets/StepperButton_Plus.svg";
import MinusButton from "../assets/StepperButton_Minus.svg";
import Navigation from "../components/Navigation";
import CategorySelect from "../components/CategorySelect";
import BottomSheetModal from "../components/BottomSheet";
import { useState, useRef } from "react";

// 백엔드 기능 함수 임포트
import { uploadItemImage, registerItem } from "../services/itemService";

function AddIngredientsPage() {
    let [quantity, setQuantity] = useState(0);
    const [category, setCategory] = useState("");
    const [open, setOpen] = useState(false);

    // 식자재 등록 데이터를 위한 상태
    const [name, setName] = useState("");
    const [purchaseDate, setPurchaseDate] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [storageCondition, setStorageCondition] = useState("");

    // 이미지 파일 업로드를 위한 state 및 파일 input 레프
    const [imagePreview, setImagePreview] = useState(ImageUpload);
    const [imageFile, setImageFile] = useState(null);
    const fileInputRef = useRef(null);

    // 임시 테스트용 유저 ID (실제 서비스에서는 인증된 로그인 유저 ID가 들어갑니다)
    const currentUserId = "user-1234-5678";

    const PlusQuantity = () => {
        setQuantity((prev) => prev + 1);
    };
    const MinusQuantity = () => {
        if (quantity > 0) {
            setQuantity((prev) => prev - 1);
        }
    };

    // 이미지 파일이 선택되었을 때의 핸들러
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // 프리뷰 이미지 변경 (원래 자리에 사진이 들어감)
            };
            reader.readAsDataURL(file);
        }
    };

    // 폼 등록 전체 로직 (IT-001, IT-002, IT-003 연동)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            alert("식자재 이름을 입력해주세요.");
            return;
        }

        if (!category) {
            alert("카테고리를 선택해주세요.");
            return;
        }

        let uploadedImageUrl = null;

        // IT-001: 이미지가 존재하면 먼저 Supabase 스토리지에 업로드 진행
        if (imageFile) {
            const { data: uploadData, error: uploadError } =
                await uploadItemImage(currentUserId, imageFile);
            if (uploadError) {
                alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
                return;
            }
            uploadedImageUrl = uploadData.publicUrl;
        }

        // IT-002, IT-003: 식자재 정보 등록 객체 구성
        const fields = {
            name: name,
            count: quantity,
            storage: storageCondition,
            img: uploadedImageUrl, // 업로드 성공 시 publicUrl 저장, 없으면 null
            purchase_date: purchaseDate || null,
            expiration_date: expirationDate || null,
        };

        // 백엔드 함수 호출
        const { error: registerError } = await registerItem(
            currentUserId,
            fields,
            category,
        );

        if (registerError) {
            alert(
                `식자재 등록 중 문제가 발생했습니다: ${registerError.message}`,
            );
        } else {
            alert("식자재가 성공적으로 등록되었습니다!");
            // 등록 성공 후 상태 초기화
            setName("");
            setQuantity(0);
            setCategory("");
            setPurchaseDate("");
            setExpirationDate("");
            setStorageCondition("");
            setImagePreview(ImageUpload);
            setImageFile(null);
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
                <Form onSubmit={handleSubmit}>
                    {/* 식자재 이름 입력 필드 */}
                    <div style={{ width: "100%" }}>
                        <Label htmlFor="itemName">식자재 이름</Label>
                        <IngredientsFormField
                            id="itemName"
                            type="text"
                            placeholder="예) 유기농 상추"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* 식자재 사진 업로드 필드 */}
                    <ImageDiv>
                        <Label htmlFor="image">식자재 사진</Label>
                        <ImageUploadButtonWrapper
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <ImagePreviewSrc
                                src={imagePreview}
                                alt="사진 업로드"
                                isUploaded={imagePreview !== ImageUpload}
                            />
                        </ImageUploadButtonWrapper>
                        <input
                            type="file"
                            key={imageFile ? imageFile.name : "empty"} // 파일 재선택 가능하도록 key 추가
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleImageChange}
                        />
                    </ImageDiv>

                    {/* 카테고리 선택 */}
                    <div
                        style={{ width: "100%" }}
                        className="add-ingredients-page__categoryDiv"
                    >
                        <Label htmlFor="category">카테고리</Label>
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

                    {/* 날짜 입력 필드들 */}
                    <DateInputDiv className="dateInputDiv">
                        <div className="add-ingredients-page__purchaseDateDiv">
                            <Label htmlFor="purchaseDate">구매 날짜</Label>
                            <IngredientsFormField
                                id="purchaseDate"
                                type={"date"}
                                placeholder={"예) 2024년 6월 25일"}
                                value={purchaseDate}
                                onChange={(e) =>
                                    setPurchaseDate(e.target.value)
                                }
                            />
                        </div>
                        <UseByDateDiv>
                            <Label htmlFor="useByDate">
                                소비기한(유통기한)
                            </Label>
                            <IngredientsFormField
                                type={"date"}
                                id="useByDate"
                                name="useByDate"
                                placeholder={"예) 2029년 6월 25일"}
                                value={expirationDate}
                                onChange={(e) =>
                                    setExpirationDate(e.target.value)
                                }
                            />
                        </UseByDateDiv>
                    </DateInputDiv>

                    {/* 수량 조절 버튼 */}
                    <div
                        style={{ width: "100%" }}
                        className="add-ingredients-page__qantityDiv"
                    >
                        <Label htmlFor="quantity">식자재 수량</Label>
                        <QuantityInputForm>
                            <img
                                src={MinusButton}
                                alt="수량 감소"
                                onClick={MinusQuantity}
                                style={{ cursor: "pointer" }}
                            />
                            <QuantityInput
                                type="number"
                                name="quantity"
                                value={quantity}
                                onChange={(e) =>
                                    setQuantity(Number(e.target.value))
                                }
                            />
                            <img
                                src={PlusButton}
                                alt="수량 추가"
                                onClick={PlusQuantity}
                                style={{ cursor: "pointer" }}
                            />
                        </QuantityInputForm>
                    </div>

                    {/* 보관 상태 입력 필드 */}
                    <div
                        style={{ width: "100%" }}
                        className="add-ingredients-page__storageConditionDiv"
                    >
                        <IngredientsFormField
                            id={"storageCondition"}
                            label={"보관상태"}
                            type={"text"}
                            name="storageCondistion"
                            placeholder={"보관해야하는 상태를 알려주세요"}
                            value={storageCondition}
                            onChange={(e) =>
                                setStorageCondition(e.target.value)
                            }
                        />
                    </div>

                    <SubmitButton type="submit">등록하기</SubmitButton>
                </Form>
            </ContentDiv>
            <BottomSheetModal open={open} onClose={() => setOpen(false)} />
            <Navigation />
        </Root>
    );
}

// 스타일 컴포넌트 수정 및 추가
const Root = styled.div`
    box-sizing: border-box;
    max-width: 402px;
    width: 100%;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fffefa;
    gap: 40px;
    padding-bottom: 100px;
`;

const Header = styled.header`
    box-sizing: border-box;
    width: 100%;
    height: 104px;
    padding: 0 24px;
    display: flex;
    justify-content: center;
    align-items: end;
`;

const HeaderContent = styled.div`
    display: flex;
    width: 100%;
    height: 32px;
    flex-direction: row;
    align-items: center;
`;

const Title = styled.span`
    font-size: 20px;
    color: #383131;
    margin-left: auto;
    margin-right: auto;
    transform: translateX(-16px); /* 버튼 두께만큼 보정하여 중앙정렬 */
`;

const ContentDiv = styled.div`
    display: flex;
    width: 100%;
    padding: 0 24px;
    box-sizing: border-box;
    flex-direction: column;
    gap: 40px;
`;

const Form = styled.form`
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 32px;
`;

const Label = styled.label`
    font-size: 14px;
    color: #383131;
    font-weight: 600;
    display: block;
    margin-bottom: 8px;
`;

const ImageDiv = styled.div`
    width: 100%;
`;

// 기존 SVG 버튼 모양 크기와 업로드 된 사진의 배치를 유지해줄 래퍼 추가
const ImageUploadButtonWrapper = styled.div`
    width: 100%;
    height: 196px;
    border: 1px dashed #d1c7bd;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    overflow: hidden;
    background-color: #faf8f5;
`;

// 이미지 종류(기본 SVG vs 업로드 사진)에 따라 스타일 분기 처리
const ImagePreviewSrc = styled.img`
    width: ${(props) => (props.isUploaded ? "100%" : "auto")};
    height: ${(props) => (props.isUploaded ? "100%" : "auto")};
    object-fit: ${(props) => (props.isUploaded ? "cover" : "none")};
`;

const DateInputDiv = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const UseByDateDiv = styled.div``;

const QuantityInputForm = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-top: 8px;
`;

const QuantityInput = styled.input`
    border-style: none;
    text-align: center;
    font-size: 20px;
    width: 60px;
    background: transparent;
    font-weight: bold;

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
    width: 100%;
    height: 60px;
    padding: 8px 16px;
    background-color: #f6f1ed;
    border: 1px solid #e1d7ce;
    border-radius: 6px;
    font-size: 20px;
    font-weight: 600;
    color: #383131;
    text-align: center;
    cursor: pointer;
    margin-top: 16px;
    transition: background 0.2s;

    &:hover {
        background-color: #ece3dc;
    }
`;

export default AddIngredientsPage;
