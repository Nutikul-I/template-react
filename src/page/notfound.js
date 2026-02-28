import React, { Component } from "react";
import { loading } from "../components/CustomComponent.js";
import "../assets/css/bootstrap.css";
import "../assets/css/style.css";
export default class Notfound extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() { loading(false); }
  async componentDidUpdate() {}
  render() {
    return (
      <div className="w-100 min-vh-100 background">
        <div className="center w-100 min-vh-100 d-flex justify-content-center align-items-center">
          <div className="col-11 col-sm-10 col-md-8 col-lg-6 col-xl-8 col-xxl-6 mx-auto">
            <div className="p-5 text-center">
              <h1 className="fw-bold mb-4 text-72">404</h1>
              <h3>Sorry, the webpage you requested was not found.</h3>
              <div className="mb-4">{window.location.href}</div>
              <button
                type="button"
                className="btn btn-dark wpx-200 mt-3 mx-auto"
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/";
                }}
              >
                Return to the homepage
              </button>
              <div class="w-100 text-center mt-4">
                <small class="text-secondary">version {global.version}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
