import Vector from "../assets/Vector.png";

function RegisterLink() {
  return (
    <div className="register">
      <button type="button" className="register-link">
        계정이 없으신가요? 회원가입하러가기
      </button>
      <img src={Vector} alt="벡터 이미지" className="login-page__vector" />
    </div>
  );
}

export default RegisterLink;