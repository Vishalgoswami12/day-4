import React, { Component } from "react";
import { Link } from "react-router-dom";
import { loginURL } from "../utilis/constant";
import { lengthValidation } from "../utilis/validation";
import { validateEmail } from "../utilis/validation";
import withRouter from "../utilis/withRouter";
import { dataContext } from "./BlogContext";

class Signin extends Component {
  static contextType = dataContext;

  state = {
    email: "",
    password: "",
    errors: {
      email: "",
      password: "",
    },
  };

  handleChange = ({ target }) => {
    const { name, value } = target;
    //validate the email
    if (name === "email") {
      this.setState({
        errors: {
          email: validateEmail(value),
        },
      });
    }
    //validate   the password
    if (name === "password") {
      console.log(value);
      this.setState({
        errors: {
          password: lengthValidation(name, value),
        },
      });
    }

    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    let { password, email } = this.state;
    fetch(loginURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: { email, password } }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            return Promise.reject(data);
          });
        }
        return res.json();
      })
      .then(({ user }) => {
        this.context.updateUser(user);
        this.props.navigate("/");
      })
      .catch((error) => {
        this.setState((previousState) => {
          return {
            ...previousState,
            errors: {
              ...previousState.errors,
              email: "email or password is incorrect !!",
            },
          };
        });
      });
  };

  render() {
    const { email, password } = this.state.errors;
    return (
      <section className="form-container container">
        <div className=" center user-form">
          <header>
            <h1 className="text-center">Sign In</h1>
            <h5 className="text-center">
              <Link to="/register" className="primary-color">
                Need an account?
              </Link>
            </h5>
          </header>
          <form className="userinput-container">
            <div className="form-group">
              <input
                placeholder="Email"
                name="email"
                value={this.state.email}
                onChange={this.handleChange}
              />
              <span className="error">{email}</span>
            </div>
            <div className="form-group">
              <input
                placeholder="password"
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
              />
              <span className="error">{password}</span>
            </div>
            <div className="flex-end">
              <button
                className="btn"
                disabled={email || password}
                onClick={this.handleSubmit}
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export default withRouter(Signin);