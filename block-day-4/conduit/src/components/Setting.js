import React, { Component } from "react";
import { lengthValidation } from "../utilis/validation";
import { validateEmail } from "../utilis/validation";
import { userURL } from "../utilis/constant";
import { localStorageKey } from "../utilis/constant";
import withRouter from "../utilis/withRouter";
import { dataContext } from "./BlogContext";



class Setting extends Component {
  static contextType = dataContext
  state = {
    username: this.context.user.username,
    image: this.context.user.image || "",
    bio: this.context.user.bio || " ",
    email: this.context.user.email,
    password: this.context.user.password,
    errors: {
      username: "",
      image: "",
      bio: "",
      email: "",
      password: "",
    },
    isLoggedIn: true,
    updateError: "",
  };

  
  handleChange = ({ target }) => {
    const { name, value } = target;
    
    //validate user email
    if (name === "email") {
      this.setState({
        errors: {
          email: validateEmail(value),
        },
      });
    }

    //validate user  password
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

    this.setState((previousState) => {
      return {
        ...previousState,
        [name]: value,
      };
    });
  };

  // updates user profile 
  handleSubmit = (event) => {
    event.preventDefault();
    const { username, email, bio, image, password } = this.state;
    let storageKey = localStorage[localStorageKey];
    fetch(userURL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Token ${storageKey}`,
      },
      body: JSON.stringify({
        user: { username, email, bio, image, password },
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return this.setState({
            updateError: "profile is not udpated please try again",
          });
        }
        return res.json();
      })
      .then(({ user }) => {
        this.props.navigate("/");
      });
  };

  render() {
    const { email, password, image,bio, username } = this.state.errors;
    return (
      <section className="form-container container">
        <div className="user-form center setting-container">
          <h2 className="section-heading text-center">Update your profile</h2>
          <form className="userinput-container">
            <button className="btn logout-btn" onClick={this.context.logout}>
              logout
            </button>
            <div className="form-group">
              <p className="error text-center">{this.state.updateError}</p>
            </div>
            <div className="form-group">
              <input
                placeholder="URL of profile picture"
                name="image"
                onChange={this.handleChange}
                value={image}
              />
            </div>
            <div className="form-group">
              <input
                placeholder="Username"
                name="username"
                onChange={this.handleChange}
                value={this.state.username}
              />
              <span className="error">{username}</span>
            </div>
            <div className="form-group">
              <textarea
                placeholder="Short bio about you"
                name="bio"
                onChange={this.handleChange}
                value={this.state.bio}
                rows="5"
              />
              <span className="error">{bio}</span>
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
                placeholder="New Password"
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
                Update
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export default withRouter(Setting);