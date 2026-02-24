
import "./Signup.css";

/*
Field function sourced from course repository.

Nasreen Arif, https://github.com/nasreenarif/cs418518-s26/blob/60fa03240d225b28dc44ec02206acb077ce4354c/Project/client/src/Field.jsx
*/

export default function Field({ label, error, children }) {
  return (
    <div className="signup-group">
      <label className="signup-label">{label}</label>
      {children}
      {error && <div className="signup-error">{error}</div>}
    </div>
  );
}