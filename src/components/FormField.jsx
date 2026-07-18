import "../styles/components/FormField.css";

function FormField({ id, label, type = "text", placeholder, value, onChange }) {
  return (
    <div className="form-field">
      <label className="form-field__label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="form-field__input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default FormField;