import styled from "styled-components";

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const Label = styled.label`
    padding: 0 2px;
    color: var(--Black, #383131);
    font-family: Pretendard, sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: -0.75px;
`;

const Input = styled.input`
    width: 354px;
    height: 48px;
    border: none;
    border-bottom: 1px solid var(--Gray02, #bfb4aa);
    background: transparent;
    padding: 4px 2px 10px;
    box-sizing: border-box;
    color: var(--Black, #383131);
    font-family: Pretendard, sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: -1px;
    outline: none;

    &::placeholder {
        color: var(--Gray02, #bfb4aa);
    }

    &:focus {
        border-bottom-color: var(--Black, #383131);
    }
`;

function IngredientsFormField({
    id,
    label,
    type = "text",
    placeholder,
    name,
    value,
    onChange,
}) {
    return (
        <Wrapper>
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                type={type}
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange}
            />
        </Wrapper>
    );
}

export default IngredientsFormField;
