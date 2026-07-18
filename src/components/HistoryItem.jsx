import styled from "styled-components";

const HistoryItem = ({ imageUrl, title }) => {
    return (
        <ItemWrapper>
            <ImageBox>
                <Image src={imageUrl} alt={title} />
            </ImageBox>
            <ItemTitle>{title}</ItemTitle>
        </ItemWrapper>
    );
};

export default HistoryItem;

/* Styled Components */
const ItemWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    cursor: pointer;

    &:active {
        opacity: 0.8;
    }
`;

const ImageBox = styled.div`
    width: 100%;
    /* 너비에 맞게 정비율로 높이가 설정되도록 처리하고 내부 요소를 중앙에 정렬합니다 */
    position: relative;
    background-color: #fbf9f6;
    border: 1px solid #f3efea;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;

    /* 가로 세로 1:1 비율을 안전하게 유지하기 위한 패딩 기법 */
    &::after {
        content: "";
        display: block;
        padding-bottom: 100%;
    }
`;

const Image = styled.img`
    position: absolute;
    width: 70%;
    height: 70%;
    /* 이미지가 찌그러지지 않고 비율을 유지하며 상자 안에 들어가도록 설정 */
    object-fit: contain;
`;

const ItemTitle = styled.p`
    margin: 8px 0 0 4px;
    font-size: 16px;
    font-weight: 500;
    color: #1a1a1a;
`;
