import { auth, db } from "../firebase";
import { doc,updateDoc,getDoc } from "firebase/firestore";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile(){

  const nav=useNavigate();
  const [name,setName]=useState("");
  const [profile,setProfile]=useState("");
  const [file,setFile]=useState(null);
  const [preview,setPreview]=useState(null);

  const fetchProfile=async()=>{
    const snap = await getDoc(doc(db,"users",auth.currentUser.uid));
    if(snap.exists()){
      setName(snap.data().username);
      setProfile(snap.data().profile);
      setPreview(snap.data().profile);
    }
  };

  const uploadCloud=async(file)=>{
    const form=new FormData();
    form.append("file",file);
    form.append("upload_preset","lost_found_preset");
    let res=await fetch("https://api.cloudinary.com/v1_1/dcjhbeyvo/image/upload",{method:"POST",body:form});
    let data=await res.json();
    return data.secure_url;
  };

  const updateProfile=async()=>{
    let url=profile;
    if(file) url=await uploadCloud(file);

    await updateDoc(doc(db,"users",auth.currentUser.uid),{
      username:name,
      profile:url
    });

    alert("Profile Updated");
    nav("/dashboard");
  };

  useEffect(()=>{fetchProfile()},[]);

  return(
    <div className="card profile-box animated-card">
      <h2>Edit Profile</h2>
      <img src={preview || "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"}
      className="profile-pic"/>

      <input type="file" onChange={(e)=>{setFile(e.target.files[0]);setPreview(URL.createObjectURL(e.target.files[0]));}}/>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your Name"/>

      <button className="btn" style={{width:"100%",marginTop:15}} onClick={updateProfile}>Save</button>
      <button className="btn" style={{width:"100%",marginTop:10,background:"#333"}} onClick={()=>nav("/dashboard")}>Back</button>
    </div>
  );
}
