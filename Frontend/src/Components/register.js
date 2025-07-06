import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBSpinner,
  MDBContainer,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import Form from "react-bootstrap/Form";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import toast, { Toaster } from "react-hot-toast";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const history = useHistory();

  useEffect(() => {
    document.body.className = Cookies.get("mode") === "light" ? "light-mode" : "dark-mode";
  }, []);

  const isValidPassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!name || !email || !pass) {
      toast.error("All fields are required.");
      setSubmitting(false);
      return;
    }

    if (!isValidPassword(pass)) {
      toast.error("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.REACT_APP_API_KEY,
        },
        body: JSON.stringify({ name, email, password: pass }),
      });

      const data = await res.json();

      if (data.success) {
        Cookies.set("token", data.verify_token);
        Cookies.set("email", data.email);
        toast.success("Registered successfully. Please verify your email.");
        setTimeout(() => history.push("/verify"), 1000);
      } else {
        toast.error(data.message || "Registration failed.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }

    setSubmitting(false);
  };

  return (
    <MDBContainer fluid className="vh-100 d-flex align-items-center justify-content-center">
      <Toaster position="top-center" />
      <MDBRow className="w-100 justify-content-center">
        <MDBCol md="4">
          <MDBCard style={{ borderRadius: "12px", boxShadow: "0px 8px 30px rgba(0,0,0,0.1)" }}>
            <form onSubmit={handleRegister}>
              <MDBCardBody style={{ textAlign: "left", padding: "30px" }}>
                <div className="text-center mb-4">
                  <h2 style={{ fontWeight: "bold", color: "#563d7c" }}>PrioritiQ</h2>
                  <p style={{ fontSize: "16px", color: "#777" }}>
                    Create your account
                  </p>
                </div>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Full Name"
                    size="lg"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{
                      borderRadius: "8px",
                      padding: "12px",
                      fontSize: "14px",
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    size="lg"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      borderRadius: "8px",
                      padding: "12px",
                      fontSize: "14px",
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    size="lg"
                    name="password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    required
                    style={{
                      borderRadius: "8px",
                      padding: "12px",
                      fontSize: "14px",
                    }}
                  />
                </Form.Group>

                <MDBBtn
                  type="submit"
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    backgroundColor: "#563d7c",
                    color: "white",
                    fontWeight: "bold",
                    padding: "12px",
                    fontSize: "16px",
                    marginBottom: "10px",
                  }}
                  className="btnsc"
                >
                  {submitting ? <MDBSpinner color="light" /> : <span>Register</span>}
                </MDBBtn>

                <div className="text-center" style={{ fontSize: "13px", marginBottom: "10px" }}>
                  Already have an account?{" "}
                  <span
                    onClick={() => history.push("/")}
                    style={{ color: "#563d7c", fontWeight: "bold", cursor: "pointer" }}
                  >
                    Login
                  </span>
                </div>

                <div className="text-center" style={{ fontSize: "13px", color: "#999" }}>
                  © {new Date().getFullYear()} PrioritiQ. All rights reserved.
                </div>
              </MDBCardBody>
            </form>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
