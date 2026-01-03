import { QRCodeCanvas } from "qrcode.react";

export default function ItemModal({data,close}){
  return(
    <div className="modal">
      <div className="modal-box">
        <h3>{data.name}</h3>
        <p>{data.location}</p>
        <QRCodeCanvas value={window.location.href} size={180}/>
        <br/><br/>
        <button className="btn btn-danger" onClick={close}>Close</button>
      </div>
    </div>
  )
}
