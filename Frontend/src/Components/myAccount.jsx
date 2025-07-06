import React, { useState } from "react";
import Sidebar from "./sidebar";
import Cookies from "js-cookie";
import { MDBCard, MDBCardBody, MDBBtn, MDBSpinner } from "mdb-react-ui-kit";
import Form from "react-bootstrap/Form";
import toast, { Toaster } from "react-hot-toast";

export default function Myaccount() {
  const [csubmit, setCSubmit] = useState(false);
  const [csuccess, setCSuccess] = useState(false);
  const [previous, setPrevious] = useState("");
  const [confirm, setConfirm] = useState("");
  const [newpass, setNewpass] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handlePrevious = (e) => setPrevious(e.target.value);
  const handleCurrent = (e) => setConfirm(e.target.value);
  const handleNewpass = (e) => setNewpass(e.target.value);

  const handleCredentials = async (e) => {
    e.preventDefault();
    setCSubmit(true);
    setErrorMsg("");

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!passwordRegex.test(newpass)) {
      setErrorMsg(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character."
      );
      setCSubmit(false);
      return;
    }

    if (newpass !== confirm) {
      setErrorMsg("New Password and Confirm Password must match.");
      setCSubmit(false);
      return;
    }

    const user = Cookies.get("user");
    if (!user) {
      toast.error("User not found. Please login again.");
      setCSubmit(false);
      return;
    }

    const userId = JSON.parse(user).id;

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/auth/updatePassword/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.REACT_APP_API_KEY,
          },
          body: JSON.stringify({
            currentPassword: previous,
            newPassword: newpass,
          }),
        }
      );

      const data = await res.json();
      if (data.success) {
        setPrevious("");
        setConfirm("");
        setNewpass("");
        setCSuccess(true);
        toast.success("Password changed successfully.");
        setTimeout(() => setCSuccess(false), 3000);
      } else {
        toast.error(data.message || "Failed to update password.");
      }
    } catch (err) {
      toast.error("An error occurred while updating password.");
    }

    setCSubmit(false);
  };


  return (
    <div className="siderow" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Toaster position="top-center" />
      <div className="sidecol1">
        <Sidebar />
      </div>
      <div className="sidecol2">
        <h1
          className="dashboard"
          style={{ textAlign: "left", paddingTop: "40px", fontWeight: "bolder" }}
        >
          My Account
        </h1>
        <MDBCard
          className="shadow"
          style={{
            borderRadius: "10px",
            margin: "5px",
            marginTop: "20px",
            marginBottom: "20px",
            padding: "20px",
            backgroundColor: "#fff",
          }}
        >
          <h4 style={{ textAlign: "left", fontWeight: "bold", marginBottom: "20px" }}>
            Change Password
          </h4>
          <form onSubmit={handleCredentials}>
            <MDBCardBody style={{ textAlign: "left" }}>
              <Form.Group className="mb-4">
                <Form.Label>Current Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter current password"
                  size="lg"
                  value={previous}
                  onChange={handlePrevious}
                  required
                  style={{
                    borderRadius: "8px",
                    padding: "12px",
                    fontSize: "14px",
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  size="lg"
                  value={newpass}
                  onChange={handleNewpass}
                  required
                  style={{
                    borderRadius: "8px",
                    padding: "12px",
                    fontSize: "14px",
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm new password"
                  size="lg"
                  value={confirm}
                  onChange={handleCurrent}
                  required
                  style={{
                    borderRadius: "8px",
                    padding: "12px",
                    fontSize: "14px",
                  }}
                />
                {errorMsg && (
                  <small style={{ color: "red", marginTop: "5px", display: "block" }}>
                    {errorMsg}
                  </small>
                )}
              </Form.Group>

              <MDBBtn
                type="submit"
                style={{
                  height: "50px",
                  marginTop: "10px",
                  backgroundColor: "#563d7c",
                  color: "#fff",
                  borderRadius: "8px",
                  width: '100%'
                }}
              >
                {csubmit ? (
                  <MDBSpinner color="light" size="sm" />
                ) : csuccess ? (
                  "Password Changed"
                ) : (
                  "Change Password"
                )}
              </MDBBtn>
            </MDBCardBody>
          </form>
        </MDBCard>
      </div>
    </div>
  );
}
