import styled from "styled-components";
import PreviousButton from "../components/PreviousButton";
import Navigation from "../components/Navigation";
import HistoryItem from "../components/HistoryItem";

const MyHistory = () => {
    // 화면에서 이미지가 즉시 보이도록 임시로 고화질 음식 아이콘 주소를 넣었습니다.
    // 실제 프로젝트 개발 시에는 public 폴더 내부의 이미지 경로로 변경해 주세요!
    const historyData = [
        {
            id: 1,
            title: "치즈",
            imageUrl: "../assets/cheeseImage.svg",
        },
        {
            id: 2,
            title: "돼지 고기",
            imageUrl: "../assets/meatImage.svg",
        },
        {
            id: 3,
            title: "소고기",
            imageUrl: "../assets/meatImage.svg",
        },
        {
            id: 4,
            title: "우유",
            imageUrl: "../assets/milkImage.svg",
        },
        {
            id: 5,
            title: "달걀",
            imageUrl: "../assets/eggImage.svg",
        },
    ];

    return (
        <PageContainer>
            {/* 요청하신 헤더 스타일 구조 완벽 적용 */}
            <Header>
                <HeaderContent>
                    <PreviousButton to="/" />
                    <Title>내 거래내역 보기</Title>
                </HeaderContent>
            </Header>

            {/* 본문 콘텐츠 영역 */}
            <MainContent>
                <GridContainer>
                    {historyData.map((item) => (
                        <HistoryItem
                            key={item.id}
                            imageUrl={item.imageUrl}
                            title={item.title}
                        />
                    ))}
                </GridContainer>
            </MainContent>

            {/* 하단 내비게이션 바 */}
            <Footer>
                <Navigation />
            </Footer>
        </PageContainer>
    );
};

export default MyHistory;

/* Styled Components */
const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #ffffff;
`;

// 보낸 스타일시트 적용
const Header = styled.header`
    box-sizing: border-box;
    width: 100%;
    height: 104px;
    padding: 0 24px;
    display: flex;
    justify-content: center;
    align-items: end;
    position: sticky;
    top: 0;
    background-color: #ffffff;
    z-index: 10;
    padding-bottom: 12px; /* 타이틀 하단에 여유를 주기 위한 추가 조정 */
`;

// 보낸 스타일시트 적용
const HeaderContent = styled.div`
    display: flex;
    width: 100%;
    height: 32px;
    flex-direction: row;
    align-items: center;
`;

// 보낸 스타일시트 적용
const Title = styled.span`
    font-size: 20px;
    color: #383131;
    font-weight: 500;
    margin-left: auto;
    margin-right: auto;
    transform: translateX(
        -16px
    ); /* PreviousButton 두께만큼 좌측 보정하여 완전 정중앙 배치 */
`;

const MainContent = styled.main`
    flex: 1;
    padding: 24px 24px 100px 24px; /* 헤더 및 네비게이션 여백과 정렬 통일 */
`;

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 16px;
    row-gap: 24px;
`;

const Footer = styled.footer`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #ffffff;
    border-top: 1px solid #f0f0f0;
    z-index: 10;
`;
