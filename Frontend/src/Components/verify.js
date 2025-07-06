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

export default function Verify() {
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const history = useHistory();
  const email = Cookies.get("email");
  const encryptedToken = Cookies.get("token"); // token set after register

  useEffect(() => {
    document.body.className =
      Cookies.get("mode") === "light" ? "light-mode" : "dark-mode";
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!otp || !email || !encryptedToken) {
      toast.error("Missing verification data.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.REACT_APP_API_KEY,
        },
        body: JSON.stringify({
          email,
          encryptedToken,
          originalToken: otp,
        }),
      });

      const data = await res.json();

      if (data.success) {
        Cookies.set("token", data.token);
        Cookies.set("user", JSON.stringify(data.user));
        toast.success("Email verified successfully!");
        setTimeout(() => history.push("/home"), 1000);
      } else {
        toast.error(data.message || "Verification failed.");
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
            <form onSubmit={handleVerify}>
              <MDBCardBody style={{ textAlign: "left", padding: "30px" }}>
                <div className="text-center mb-4">
                  <h2 style={{ fontWeight: "bold", color: "#563d7c" }}>PrioritiQ</h2>
                  <p style={{ fontSize: "16px", color: "#777" }}>
                    Enter the OTP sent to your email
                  </p>
                </div>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Enter OTP"
                    size="lg"
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    style={{
                      borderRadius: "8px",
                      padding: "12px",
                      fontSize: "14px",
                      letterSpacing: "2px",
                      textAlign: "center",
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
                  {submitting ? <MDBSpinner color="light" /> : <span>Verify</span>}
                </MDBBtn>

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
