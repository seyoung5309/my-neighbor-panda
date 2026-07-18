import styled from "styled-components";

const StyledToast = styled.div`
  display: inline-flex;
  padding: 4px 16px;
  align-items: center;
  gap: 8px;
  border-radius: 999px;
  background: var(--MainColor, #fbc942);
  color: #383131;
  font-family: Pretendard;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.75px;
`;

function Toast({ message, visible }) {
  if (!visible) return null;

  return (
    <StyledToast role="alert">
      {message}
    </StyledToast>
  );
}

export default Toast;