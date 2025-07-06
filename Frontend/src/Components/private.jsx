import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [check, setCheck] = useState(true);
  const [valid, setValid] = useState();

  useEffect(() => {
    async function checker() {
      try {
        const token = Cookies.get("token");

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/auth/verifyToken`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "api-key": process.env.REACT_APP_API_KEY // optional if required
          },
        });

        if (!response.ok) {
          if (response.status === 403 || response.status === 401) {
            window.location.href = "/404";
          } else {
            throw new Error("Request failed.");
          }
        }

        const data = await response.json();

        if (data.success === true) {
          setCheck(false);
          setValid(true);
        } else {
          setCheck(false);
          setValid(false);
        }
      } catch (error) {
        console.error("Error:", error);
        setCheck(false);
        setValid(false);
      }
    }

    checker();
  }, []);

  return (
    <Route
      {...rest}
      render={(props) =>
        check ? null : valid ? <Component {...props} /> : <Redirect to="/404" />
      }
    />
  );
};

export default PrivateRoute;
