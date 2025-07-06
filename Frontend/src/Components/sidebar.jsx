import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Modal, Button } from "react-bootstrap";
import { MDBSpinner } from "mdb-react-ui-kit";

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isdarkmode, setIsdarkmode] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setIsdarkmode(Cookies.get("mode") !== "light");
  }, []);

  const location = useLocation();
  const history = useHistory();

  const isActiveLink = (path) => location.pathname === path;

  const handleLogout = () => {
    setSubmitting(true);
    setTimeout(() => {
      Cookies.remove("email");
      Cookies.remove("token");
      Cookies.remove("user");
      history.push("/");
    }, 1000);
  };

  return (
    <>
      <div
        id="sidebar"
        style={{ borderRadius: 0, height: "100vh" }}
        className={`lg:w-16 lg:flex ${isSidebarOpen ? "lg:w-64" : ""
          } fixed lg:h-screen overflow-y-auto text-gray-400 transition-all duration-300`}
      >
        <div className="flex flex-col items-center w-16 lg:w-64 h-full overflow-hidden text-gray-400">
          <a className="flex items-center justify-center mt-3" href="#">
            <img src="./assets/logo.png" alt="Logo" className="w-6 h-6" />
          </a>
          <div className="flex flex-col items-center mt-3 border-t border-gray-700">
            <Link
              className={`flex items-center justify-center w-12 h-12 mt-2 rounded transition ${isActiveLink("/home")
                ? "bg-gray-200"
                : "hover:bg-gray-100"
                }`}
              to="/home"
              title="Home"
            >
              <img src="./assets/home.png" alt="Home" className="w-6 h-6" />
            </Link>
            <Link
              className={`flex items-center justify-center w-12 h-12 mt-2 rounded transition ${isActiveLink("/category")
                ? "bg-gray-200"
                : "hover:bg-gray-100"
                }`}
              to="/category"
            >
              <img src="./assets/category.png" alt="Category" className="w-6 h-6" />
            </Link>
          </div>

          <div className="flex flex-col items-center mt-2">
            <div
              onClick={() => setShowLogoutModal(true)}
              className={`flex items-center justify-center w-12 h-12 mt-2 rounded transition ${isActiveLink("/")
                ? "bg-gray-200"
                : "hover:bg-gray-100"
                }`}
            >
              <img src="./assets/logout.png" alt="Logout" className="w-6 h-6" />
            </div>
          </div>

          <Link
            className={`flex items-center justify-center w-16 h-16 mt-auto ${isActiveLink("/my-accounts")
              ? "bg-gray-200 "
              : "hover:bg-gray-100"
              }`}
            to="/my-accounts"
          >
            <img src="./assets/user.png" alt="Account" className="w-6 h-6" />
          </Link>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to logout?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            {submitting ? <MDBSpinner size="sm" /> : "Logout"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
