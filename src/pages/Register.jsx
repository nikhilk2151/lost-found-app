import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");       // ✅ added
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const nav = useNavigate();

  const register = async () => {
    if (!name || !email || !pass) return alert("Fill all fields");

    try {
      const user = await createUserWithEmailAndPassword(auth, email, pass);

      await setDoc(doc(db, "users", user.user.uid), {
        name,                     // ✅ stored name
        email,
        username: email.split("@")[0],
        profile: ""
      });

      alert("Registered Successfully");
      nav("/dashboard");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="card animated-card">
      <h2 style={{ marginBottom: 20 }}>Create Account</h2>

      <input
        placeholder="Full Name"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPass(e.target.value)}
      />

      <button
        className="btn"
        style={{ width: "100%", marginTop: 10 }}
        onClick={register}
      >
        Register
      </button>

      <p style={{ marginTop: 15 }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
