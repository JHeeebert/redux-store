import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Auth from "../utils/auth";
import { ADD_USER } from "../utils/mutations";
const MySwal = withReactContent(Swal);

function Signup() {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [addUser] = useMutation(ADD_USER);
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const mutationResponse = await addUser({
        variables: {
          email: formState.email,
          password: formState.password,
          firstName: formState.firstName,
          lastName: formState.lastName,
        },
      });
      const token = mutationResponse.data.addUser.token;
      Auth.login(token);
      MySwal.fire({
        title: "Success!",
        text: "You have successfully signed up.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.assign("/");
      });
    } catch (error) {
      MySwal.fire({
        title: "Failed to Sign Up",
        text: "Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };
  return (
    <div className="container my-1">
      <Link to="/login">← Go to Login</Link>
      <h2>Signup</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            placeholder="First"
            name="firstName"
            id="firstName"
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            placeholder="Last"
            name="lastName"
            id="lastName"
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            placeholder="youremail@test.com"
            name="email"
            id="email"
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            placeholder="******"
            name="password"
            id="password"
            onChange={handleChange}
          />
        </div>
        <div className="form-group flex-row flex-end">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
