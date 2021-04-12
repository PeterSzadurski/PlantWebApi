import "./Header.css";
import headerImage from "./images/pexels-brett-sayles-1073069.jpg";
function Header(props) {
  return (
    <div
      className="outerHeader"
      style={{
        backgroundImage: `url(${headerImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div>
        <div className="innerHeader"></div>
        <h1 className="headerText">Remote Watering System</h1>
      </div>
    </div>
  );
}
export default Header;
