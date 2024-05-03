import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import '../pages/css/ChangePass.css'; // Import the CSS file

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = () => {
    // Basic email format validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setSuccess(true);
        setError(null);
      })
      .catch((error) => {
        setError(error.message);
        setSuccess(false);
      });
  };

  return (
    <div className="reset-container">
      <h1 className="reset-h1">Reset Password</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="reset-input"
      />
      <button onClick={handleResetPassword} className="reset-button">Send Password Reset Email</button>
      {error && <p className="reset-error">{error}</p>}
      {success && <p className="reset-success">Password reset email sent successfully.</p>}
    </div>
  );
};

export default ResetPassword;
