import styled from "styled-components";
import { Link } from "react-router-dom";

import PreviousButtonImage from "../assets/previousButton.svg";

const ChevronLeftIconRoot = styled.img`
    height: 24px;
    width: 24px;
    position: relative;
`;

const LinkTo = styled(Link)`
    width: 24px;
    height: 24px;
`;
const PreviousButton = ({ to }) => {
    return (
        <LinkTo to={to}>
            <ChevronLeftIconRoot src={PreviousButtonImage} />
        </LinkTo>
    );
};
export default PreviousButton;
