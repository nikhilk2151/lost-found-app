import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  query,
  onSnapshot,
  doc,
  getDoc,
  deleteDoc
} from "firebase/firestore";
import { useEffect, useState } from "react";
import ItemCard from "../components/ItemCard";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const nav = useNavigate();
  const { user } = useAuth();
  if (!user) return null;

  // Form Inputs
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [loc, setLoc] = useState("");
  const [type, setType] = useState("Lost");
  const [img, setImg] = useState(null);

  // Data
  const [posts, setPosts] = useState([]);
  const [name, setName] = useState("");
  const [profile, setProfile] = useState("");

  // UI State
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [myItemsMode, setMyItemsMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  // Upload Image
  const uploadCloud = async (file) => {
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", "lost_found_preset");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dcjhbeyvo/image/upload",
      { method: "POST", body: form }
    );

    return (await res.json()).secure_url;
  };

  // Post Item
  const postItem = async () => {
    if (!title || !desc || !loc) return alert("Fill all fields");
    if (!img) return alert("Upload an image");

    const url = await uploadCloud(img);

    await addDoc(collection(db, "posts"), {
      title,
      desc,
      loc,
      type,
      image: url,
      email: user.email,
      uid: user.uid,
      username: name,
      time: Date.now()
    });

    alert("Item Posted Successfully");
    setTitle("");
    setDesc("");
    setLoc("");
    setImg(null);
  };

  // Load User
  const loadUser = async () => {
    const snap = await getDoc(doc(db, "users", user.uid));
    if (snap.exists()) {
      setName(snap.data().name || snap.data().username || "User");
      setProfile(snap.data().profile);
    }
  };

  // Load Items
  useEffect(() => {
    loadUser();

    const q = query(collection(db, "posts"));
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map((d) => ({ ...d.data(), id: d.id })));
      setLoading(false);
    });

    return unsub;
  }, [user.uid]);

  // Filters
  let displayPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || p.type === filter)
  );

  if (myItemsMode) {
    displayPosts = displayPosts.filter((p) => p.uid === user.uid);
  }

  // Delete Item
  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item permanently?")) return;
    await deleteDoc(doc(db, "posts", id));
    alert("Item Removed");
  };

  return (
    <>
      {/* NAVBAR */}
      <div className="navbar" style={{ justifyContent: "space-between" }}>
        <div style={{ fontSize: 16 }}>
          Hi, <b>{name}</b>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img
            onClick={() => nav("/profile")}
            src={
              profile ||
              "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
            }
            style={{
              width: 46,
              height: 46,
              borderRadius: "50%",
              cursor: "pointer"
            }}
          />
          <a onClick={() => { signOut(auth); nav("/"); }}>Logout</a>
        </div>
      </div>

      {/* FORM */}
      <div className="section animated-card">
        <h2>Add Lost / Found Item</h2>

        <div style={{ maxWidth: 450, margin: "auto" }}>
          <select onChange={(e) => setType(e.target.value)}>
            <option>Lost</option>
            <option>Found</option>
          </select>

          <input placeholder="Item Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
          <input placeholder="Location" value={loc} onChange={(e) => setLoc(e.target.value)} />
          <input type="file" onChange={(e) => setImg(e.target.files[0])} />

          <button className="btn" style={{ width: "100%", marginTop: 10 }} onClick={postItem}>
            Post Item
          </button>
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div style={{ textAlign: "center", marginTop: -15 }}>
        <input
          placeholder="Search..."
          style={{ width: 300, marginBottom: 15 }}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select style={{ width: 200, marginLeft: 10 }} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          <option>Lost</option>
          <option>Found</option>
        </select>

        <button
          className="btn"
          style={{ marginLeft: 10, padding: "10px 18px" }}
          onClick={() => setMyItemsMode(!myItemsMode)}
        >
          {myItemsMode ? "Show All Items" : "My Items"}
        </button>
      </div>

      {loading && <h3 style={{ textAlign: "center", opacity: 0.6 }}>Loading items...</h3>}

      {/* ITEMS */}
      <div className="grid">
        {displayPosts.map((item) => (
          <div key={item.id}>
            <div onClick={() => setModal(item)}>
              <ItemCard item={item} />
            </div>

            {item.uid === user.uid && (
              <button
                className="btn"
                style={{ marginTop: 8, width: "100%" }}
                onClick={() => deleteItem(item.id)}
              >
                Delete Item
              </button>
            )}
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modal && (
        <div className="modal-backdrop">
          <div className="card" style={{ width: 450 }}>
            <img src={modal.image} style={{ width: "100%", borderRadius: "10px" }} />
            <h2>{modal.title}</h2>
            <p>{modal.desc}</p>
            <p>Location: {modal.loc}</p>
            <p>Posted by: {modal.email}</p>

            <button
              className="btn"
              style={{ width: "100%", marginTop: 10 }}
              onClick={() => setModal(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* FOOTER (ALIGNED + LINE ADDED) */}
      <div className="footer" style={{ textAlign: "center", lineHeight: "26px" }}>
        <p><b>Contact Information</b></p>
        <p>Email: nikhik21518@gmail.com</p>
        <p>Mobile: 7017847291</p>
        <p style={{ marginTop: 10 }}>
          Lost & Found Portal © 2025 • Made for CCSU Students
        </p>
      </div>
    </>
  );
}
