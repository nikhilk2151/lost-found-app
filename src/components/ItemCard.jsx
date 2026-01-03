export default function ItemCard({item}){
  return(
    <div className="item-card">
      <img src={item.image}/>
      <div className="item-desc">
        <b>{item.title}</b><br/>
        {item.desc}<br/>
        <small>Location: {item.loc}</small><br/>
        <small>Posted by: {item.email}</small><br/>
        <b style={{color:"#00aaff"}}>{item.type}</b>
      </div>
    </div>
  )
}
