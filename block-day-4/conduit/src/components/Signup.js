import React, { Component } from "react";
import { lengthValidation } from "../utilis/validation";
import { validateEmail } from "../utilis/validation";
import { signupURL } from "../utilis/constant";
import withRouter from "../utilis/withRouter";
import { Link } from "react-router-dom";
import { dataContext } from "./BlogContext";

class Signup extends Component {
  static contextType = dataContext;

  state = {
    email: "",
    password: "",
    username: "",
    errors: {
      username: "",
      password: "",
      email: "",
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
      this.setState({
        errors: {
          password: lengthValidation(name, value),
        },
      });
    }
    //validate  username
    if (name === "username") {
      this.setState({
        errors: {
          username: lengthValidation(name, value),
        },
      });
    }
    this.setState({
      [name]: value,
    });
  };


  //  resposible for user login or creating user account
  handleSubmit = (event) => {
    event.preventDefault();
    let { username, password, email } = this.state;
    console.log(username, password, email);
    fetch(signupURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: { username, email, password } }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            console.log(data);
            return Promise.reject(data);
          });
        }
        return res.json();
      })
      .then((data) => {
        this.context.updateUser(data.user);
        this.setState({ email: "", username: "", password: "" });
        this.props.navigate("/");
      })
      .catch((data) => {
        this.setState({
          errors: {
            username: data.errors.username,
            email: data.errors.email,
          },
        });
      });
  };

  render() {
    const { username, email, password } = this.state.errors;
    return (
      <section className="form-container container">
        <div className=" center user-form">
          <header>
            <h1 className="text-center">Sign up</h1>
            <h5 className="text-center"><Link to="/login" className="primary-color">Have an account?</Link></h5>
          </header>
          <form className="userinput-container">
            <div className="form-group">
              <input
                placeholder="Username"
                name="username"
                value={this.state.username}
                onChange={this.handleChange}
              />
              <span className="error">{username}</span>
            </div>
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
                disabled={password || username || email}
                onClick={this.handleSubmit}
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export default withRouter(Signup);