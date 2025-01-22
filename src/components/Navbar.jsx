import Logo from "../img/logo.png";

const Navbar = () => {
  return (
    <div className="navbar">
      <img src={Logo} className="invert" alt="logo" />
    </div>
  );
};

export default Navbar;
