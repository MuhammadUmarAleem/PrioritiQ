import React, { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const history = useHistory();

  useEffect(() => {
    document.body.className = Cookies.get("mode") === "light" ? "light-mode" : "dark-mode";
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!email || !pass) {
      toast.error("Please fill in all fields");
      setSubmitting(false);
      return;
    }

    console.log(process.env.REACT_APP_API_KEY)
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.REACT_APP_API_KEY,
        },
        body: JSON.stringify({ email, password: pass }),
      });

      const data = await res.json();

      if (data.success) {
        Cookies.set("token", data.token);
        Cookies.set("user", JSON.stringify(data.user));
        toast.success("Login successful");
        setTimeout(() => history.push("/home"), 1000);
      } else {
        toast.error(data.message || "Login failed");
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
            <form onSubmit={handleLogin}>
              <MDBCardBody style={{ textAlign: "left", padding: "30px" }}>
                {/* PrioritiQ Branding */}
                <div className="text-center mb-4">
                  <h2 style={{ fontWeight: "bold", color: "#563d7c" }}>PrioritiQ</h2>
                  <p style={{ fontSize: "16px", color: "#777" }}>
                    Welcome back! Please login to continue
                  </p>
                </div>

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
                  {submitting ? <MDBSpinner color="light" /> : <span>Login</span>}
                </MDBBtn>

                <div className="text-center" style={{ fontSize: "13px", marginBottom: "10px" }}>
                  Don't have an account?{" "}
                  <span onClick={()=>{history.push("/register")}} style={{ color: "#563d7c", fontWeight: "bold", cursor: "pointer" }}>
                    Register
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
