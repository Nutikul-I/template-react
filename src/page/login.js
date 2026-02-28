import React, { Component, createRef } from "react";
import {
  GET,
  POST,
  loading,
  alert,
  tokens
} from "../components/CustomComponent.js";
import Turnstile from "react-turnstile";
import LOGO from "../assets/images/logo.png";
import "../assets/css/bootstrap.css";
import "../assets/css/style.css";
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      password_view: "password",
      remember: false,
      token: "",
      captchaKey: Date.now(),
    };
    this.turnstileRef = createRef();
  }
  async componentDidMount() {
    if (tokens) {
      const result = await GET("v1/admin/users/profile");
      if (result?.status) {
        window.location.href = `/dashboard`;
      }
    }
    loading(false);
  }
  async componentDidUpdate() { }

  Login = async () => {
    const { token, email, password, remember } = this.state;
    if (!token) {
      alert("", "warning", "Warning", "Please confirm CAPTCHA.");
      return;
    }
    loading(true);
    let result = await POST("v1/public/login", {
      email: email,
      password: btoa(password),
      remember: remember,
      token: token,
    });
    if (result?.status) {
      localStorage.setItem("scp-acc-tk", btoa("Bearer " + result.data.token));
      localStorage.setItem(
        "scp-profile",
        JSON.stringify({
          ...result.data,
          password: "",
        })
      );
    } else {
      this.setState({ token: "", captchaKey: Date.now() });
      if (
        result.message === "User not verified, please verify your account first"
      ) {
        alert(
          "/resend-verification?email=" + email,
          "warning",
          "Warning",
          "User not verified, please verify your account first",
          "verify",
          "cancel"
        );
      }
    }
    loading(false);
  };

  render() {
    const { email, password, password_view, token } =
      this.state;
    return !tokens ? (
      <div className="w-100 min-vh-100 background position-relative">
        <div className="row w-100 mx-0">
          <div
            className="col-12 d-flex align-items-center justify-content-center d-md-none bg-primary py-3"
          >
            <img
              alt="logo"
              src={LOGO}
              className="w-75"
              style={{ minWidth: 350 }}
              fetchpriority="high"
            />
          </div>
          <div
            className="col-6 d-none d-md-flex align-items-center justify-content-center bg-primary min-vh-100"
          >
            <img
              alt="logo"
              src={LOGO}
              style={{ width: "60%", minWidth: 400 }}
            />
          </div>
          <div className="col-12 col-md-6 d-flex justify-content-center align-items-center">
            <div className="col-11 col-md-10 col-lg-7 col-xl-6 mx-auto my-5">
              <h3 className="fw-bold text-dark mb-3">Signin</h3>
              <div className="mb-3">
                <small>
                  Please enter your email and password to access the system.
                </small>
              </div>
              <label className="mb-1">Username</label>
              <input
                className="form-control mb-3"
                type="text"
                placeholder="Username"
                onChange={(e) => {
                  this.setState({ email: e.target.value });
                }}
                value={email}
              />
              <label className="mb-1">Password</label>
              <div className="position-relative">
                <input
                  className="form-control mb-3"
                  type={password_view}
                  placeholder="Password"
                  onChange={(e) => {
                    this.setState({ password: e.target.value });
                  }}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      this.Login();
                    }
                  }}
                  value={password}
                />
                <div
                  className="wpx-40 hpx-40 d-flex justify-content-center align-items-center icon pointer position-absolute"
                  style={{ right: 0, top: 0 }}
                  onClick={() => {
                    this.setState({
                      password_view:
                        password_view === "password" ? "text" : "password",
                    });
                  }}
                >
                  {password_view === "password" ? "\uf06e" : "\uf070"}
                </div>
              </div>
              <div className="w-100 mb-2">
                <Turnstile
                  key={this.state.captchaKey}
                  size="flexible"
                  sitekey={process.env.REACT_APP_CLOUDFLARE_SITE_KEY}
                  onVerify={(token) => {
                    this.setState({ token });
                  }}
                  onExpire={() => {
                    this.setState({ token: "" });
                  }}
                />
              </div>
              <button
                type="button"
                className={`btn ${
                  token ? "btn-dark" : "btn-secondary"
                } w-100 mb-3`}
                onClick={() => {
                  this.Login();
                }}
                disabled={!token}
              >
                Login
              </button>
              <div className="w-100 text-center mb-5">
                <small className="text-secondary text-center">
                  Copyright © 2026 Tepmplate version{" "}
                  {global.version}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div></div>
    );
  }
}
