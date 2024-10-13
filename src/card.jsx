import anhNhaXe from "./assets/anhNhaXe.jpg"
import 'bootstrap/dist/css/bootstrap.min.css';
function Card(){
    return(
        <div className="card">
            <img className="card-image" src={anhNhaXe} alt="ảnh Nhà Xe"></img>
            <h5 className="card-title">Nhà xe Mai Huy Thanh</h5>
            <p className="card-text">Nhập thông tin khách hàng</p>
        </div>
    );
}

export default Card