import "../styles/components/Toast.css";

function Toast({ message, visible }) {
  if (!visible) return null;

  return (
    <div className="toast" role="alert">
      {message}
    </div>
  );
}

export default Toast;