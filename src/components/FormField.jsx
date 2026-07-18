import "../styles/components/FormField.css";

function FormField({ id, label, type = "text", placeholder }) {
  return (
    <div className="login-page__field">
      <label className="login-page__lable" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="login-page__input"
        placeholder={placeholder}
      />
    </div>
  );
}

export default FormField;