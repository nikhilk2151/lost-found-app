import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate,Link } from "react-router-dom";

export default function Login(){

  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const nav=useNavigate();

  const login=async()=>{
    if(!email || !pass) return alert("Fill all fields");
    try{
      await signInWithEmailAndPassword(auth,email,pass);
      nav("/dashboard");
    }catch{
      alert("Invalid email or password");
    }
  };

  return(
    <div className="card animated-card">
      <h2 style={{marginBottom:20}}>Login</h2>

      <input placeholder="Email" type="email" onChange={e=>setEmail(e.target.value)}/>
      <input placeholder="Password" type="password" onChange={e=>setPass(e.target.value)}/>

      <button className="btn" style={{width:"100%",marginTop:10}} onClick={login}>Login</button>
      
      <p style={{marginTop:15}}>New user? <Link to="/register">Create Account</Link></p>
    </div>
  );
}
