import FormField from "./FormField";

function LoginForm() {
  return (
    <form className="login-page__form" onSubmit={(e) => e.preventDefault()}>
      <FormField
        id="email"
        label="이메일"
        type="email"
        placeholder="이메일을 입력해주세요"
      />
      <FormField
        id="password"
        label="비밀번호"
        type="password"
        placeholder="비밀번호를 입력해주세요"
      />
      <button type="submit" className="login-page__submit">
        로그인하기
      </button>
    </form>
  );
}

export default LoginForm;