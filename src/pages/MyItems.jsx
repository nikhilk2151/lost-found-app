import { db,auth } from "../firebase";
import { collection, query, where, getDocs,deleteDoc,doc } from "firebase/firestore";
import "../styles/global.css";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyItems(){
  const [data,setData]=useState([]);
  const nav=useNavigate();

  async function load(){
    const q=query(collection(db,"items"),where("uid","==",auth.currentUser.uid));
    const snap=await getDocs(q);
    setData(snap.docs.map(d=>({...d.data(),id:d.id})));
  }

  async function remove(id){
    await deleteDoc(doc(db,"items",id));
    load();
  }

  useEffect(()=>{load();},[]);

  return(
    <div style={{padding:"40px"}}>
      <button className="btn-primary" onClick={()=>nav("/dashboard")}>⬅ Back</button>
      <h2 style={{margin:"25px 0"}}>My Uploaded Items</h2>
      {data.map(e=>
        <div className="card" style={{width:"300px",margin:"10px"}}>
          <h3>{e.item}</h3>
          <p>{e.loc} | {e.type}</p>
          <button style={{background:"#e11d48",color:"#fff",padding:"8px",marginTop:"10px"}} onClick={()=>remove(e.id)}>Delete</button>
        </div>
      )}
    </div>
  );
}
