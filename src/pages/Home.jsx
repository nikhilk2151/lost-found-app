import { useNavigate } from "react-router-dom";

export default function Home(){

  const nav = useNavigate();

  return(
    <>
    <div className="navbar">
      <b style={{fontSize:22}}>Lost & Found CCSU</b>
      <div>
        <a onClick={()=>nav("/login")} style={{marginRight:20}}>Login</a>
        <a onClick={()=>nav("/register")}>Register</a>
      </div>
    </div>

    <div className="hero animated-card">
      <h1>CCSU Lost & Found Portal</h1>
      <p>
        A digital hub to submit lost items, upload found objects, search belongings,
        and help students recover valuables quickly inside CCSU campus.
      </p>
      <button className="btn" style={{marginTop:25}} onClick={()=>nav("/login")}>Get Started</button>
    </div>

    <div className="section">
      <h2>Why use our platform?</h2>

      <div className="home-features">

        <div className="feature-box">
          <h3>Instant Posting</h3>
          <p>Upload lost/found item details with image within seconds.</p>
        </div>

        <div className="feature-box">
          <h3>Fast Search</h3>
          <p>Search and filter items by title, category or location.</p>
        </div>

        <div className="feature-box">
          <h3>Student Verified</h3>
          <p>Every user is verified and secure with campus authentication.</p>
        </div>

      </div>
    </div>

    <div className="footer">
      <p>Lost & Found Platform © 2025 | Designed for CCSU Students</p>
    </div>
    </>
  );
}
