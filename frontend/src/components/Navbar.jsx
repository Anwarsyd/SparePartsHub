import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("access_token");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    navigate("/login");
  };

  return (
    <nav className="nav">
      <h2>SparePartsHub</h2>

      <div className="links">
        <Link to="/">Home</Link>{" "}
        <Link to="/products">Products</Link>{" "}
        <Link to="/cart">Cart</Link>{" "}
        <Link to="/orders">Orders</Link>{" "}

        {isLoggedIn ? (
          <button onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/login">Login</Link>{" "}
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;