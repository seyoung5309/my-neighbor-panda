import styled from "styled-components";
import { Link } from "react-router-dom";

import PreviousButtonImage from "../assets/previousButton.svg";

const ChevronLeftIconRoot = styled.img`
    height: 24px;
    width: 24px;
    position: relative;
`;
const PreviousButton = ({ to }) => {
    return (
        <Link to={to}>
            <ChevronLeftIconRoot src={PreviousButtonImage} />
        </Link>
    );
};
export default PreviousButton;
