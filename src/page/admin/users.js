import React, { Component } from "react";
import {
  profile,
  alert,
  float,
  random_charactor,
  GET,
  POST,
  PUT,
  DELETE,
  loading,
  Status,
  required,
  Select,
  BtnIcon,
  Pagination,
  Switch,
  Navbar,
  Modal,
  copyText
} from "../../components/CustomComponent.js";

export default class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal_create: false,
      modal_update: false,

      filter_search: "",
      filter_user_type: "",

      data: [],
      count: 10,
      data_role: [],
      data_broker: [],

      id: "",
      uid: "",
      full_name: "",
      phone: "",
      role_id: "",
      email: "",
      password: "",
      is_active: false,
      is_2fa: false,
      is_mismatch_limit_approved: false,
      broker_id: "",

      user_type: "",
    };
  }

  async componentDidMount() {
    loading(false);
    await this.Get(1);
  }
  Get = async (page) => {
    const { filter_search, filter_user_type } = this.state;
    let data, count, data_role, data_broker;
    loading(true);
    let [result, result_role, result_broker] = await Promise.all([
      GET("v1/admin/users", {
        page_size: 10,
        page: page,
        data_search: filter_search,
        user_type: filter_user_type,
      }),
      GET("v1/admin/roles", { page_size: 100000, page: 0, data_search: "" }),
      GET("v1/admin/brokers/options", {
        page_size: 100000,
        page: 0,
        data_search: "",
      }),
    ]);
    if (result?.status) {
      data = result.data;
      count = result.pagination.count;
    }
    if (result_role?.status) {
      data_role = result_role.data;
    }
    if (result_broker?.status) {
      data_broker = result_broker.data.map((e) => ({
        value: e.uid,
        label: e.name_en,
      }));
    }
    this.setState({
      data,
      count,
      data_role,
      data_broker,
    });
    loading(false);
  };
  CreateUpdate = async () => {
    const {
      modal_create,
      uid,
      full_name,
      phone,
      role_id,
      email,
      password,
      is_active,
      is_2fa,
      is_mismatch_limit_approved,
      user_type,
      broker_id,
    } = this.state;
    if (!full_name.trim()) {
      alert("", "warning", "Warning", "Please input Name");
      return;
    } else if (!role_id.trim()) {
      alert("", "warning", "Warning", "Please select Role");
      return;
    } else if (!email.trim()) {
      alert("", "warning", "Warning", "Please input Email");
      return;
    }
    if (modal_create) {
      if (!password) {
        alert("", "warning", "Warning", "Please input Password");
        return;
      }
    }
    if (
      await alert(
        "",
        "info",
        "Confirm",
        "Do you want to confirm the submission?",
        "Confirm",
        "Cancel"
      )
    ) {
      loading(true);
      let body = {
        full_name,
        phone,
        role_id,
        email,
        user_type: user_type.replaceAll(" ", "_"),
        password,
        is_active,
        is_2fa,
        is_mismatch_limit_approved,
        broker_id: broker_id || null,
      };

      let result = !uid
        ? await POST("v1/admin/users", body)
        : await PUT("v1/admin/users/" + uid, body);
      if (result?.status === true) {
        alert("#", "success");
      } else {
        alert(
          "",
          "warning",
          "Warning",
          result?.message || "An error occurred. Please try again."
        );
      }
      loading(false);
    }
  };
  ResendVerification = async (email) => {
    if (!email?.trim()) {
      alert("", "warning", "Warning", "Please input Email");
      return;
    }
    loading(true);
    let result = await POST("v1/public/re-verify-email", {
      email: email,
      token: process.env.REACT_APP_CAPTCHA_TOKEN_MASTER,
    });
    if (result?.status) {
      alert(
        "#",
        "success",
        "Success",
        "We've sent a verification link to your email"
      );
    }
    loading(false);
  };
  Delete = async (id) => {
    if (
      await alert(
        "",
        "warning",
        "Delete Item",
        "Do you really want to delete this item?",
        "Confirm",
        "Cancel"
      )
    ) {
      loading(true);
      let result = await DELETE("v1/admin/users/" + id, null);
      if (result?.status) {
        alert("#", "success");
      }
      loading(false);
    }
  };
  render() {
    const {
      modal_create,
      modal_update,
      filter_search,
      filter_user_type,
      data,
      count,
      data_role,
      data_broker,
      full_name,
      phone,
      role_id,
      email,
      password,
      is_active,
      is_2fa,
      is_mismatch_limit_approved,
      broker_id,
      user_type,
    } = this.state;
    return (
      <div className="w-100 min-vh-100">
        <Navbar />
        <div className="body p-3 mt-3">
          <h4 className="fw-bold mb-1">User Management</h4>
          <div className="text-secondary mb-3">
            Manage user accounts and permissions
          </div>
          <div className="rounded-4 bg-white p-3 mb-3">
            <h5 className="fw-bold mb-3">
              <span className="icon me-1 text-14">{"\uf0b0"}</span>Filter
            </h5>
            <div className="d-flex flex-wrap">
              <input
                type="text"
                className="form-control wpx-200 me-2 mb-2"
                placeholder="Search..."
                onChange={(e) => {
                  this.setState({ filter_search: e.target.value });
                }}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    this.Get(1);
                  }
                }}
                value={filter_search}
              />
              <select
                className="form-select wpx-200 me-2 mb-2"
                onChange={(e) => {
                  this.setState({ filter_user_type: e.target.value });
                }}
                value={filter_user_type}
              >
                <option value="">Select User Type</option>
                <option value="admin">Admin</option>
                <option value="agent">Agent</option>
                <option value="broker">Broker</option>
                <option value="sub_broker">Sub Broker</option>
              </select>
              <div className="d-flex">
                <button
                  className="btn btn-warning px-3 me-2 mb-2"
                  onClick={() => {
                    this.Get(1);
                  }}
                >
                  Search
                </button>
                <button
                  className="btn btn-outline-dark px-3 me-2 mb-2"
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-dark px-3 ms-auto mb-2 users.create"
              onClick={async () => {
                this.setState({
                  id: "",
                  uid: "",
                  full_name: "",
                  phone: "",
                  role_id: "",
                  email: "",
                  password: "",
                  user_type: "",
                  is_active: true,
                  is_2fa: false,
                  is_mismatch_limit_approved: false,
                  modal_create: true,
                });
              }}
            >
              Create User
            </button>
          </div>
          <div className="rounded-4 bg-white p-3">
            <div className="table-responsive">
              <table className="table table-hover table-striped-columns">
                <thead>
                  <tr>
                    <td className="text-nowrap">Code</td>
                    <td className="text-nowrap">Name</td>
                    <td className="text-nowrap">Email</td>
                    <td className="text-center text-nowrap wpx-100">Type</td>
                    <td className="text-center text-nowrap wpx-100">Status</td>
                    <td className="text-center users.update wpx-100">
                      Actions
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item, index) => (
                    <tr key={`array-${index}`}>
                      <td data-label="Code" className="text-nowrap wpx-120">{item.user_code || "-"}</td>
                      <td data-label="Name" className="text-nowrap">{item.full_name || "-"}</td>
                      <td data-label="Email" className="text-nowrap">{item.email || "-"}</td>
                      <td data-label="Type" className="text-nowrap">
                        <div className="d-flex align-items-center justify-content-center">
                          {item.user_type === "admin"
                            ? Status("admin", "success")
                            : item.user_type === "agent"
                            ? Status("agent", "info")
                            : item.user_type === "broker"
                            ? Status("broker", "purple")
                            : item.user_type === "sub_broker"
                            ? Status("sub broker", "primary")
                            : item.user_type === "accounting"
                            ? Status("accounting", "warning")
                            : Status(item.user_type, "danger")}
                        </div>
                      </td>
                      <td
                        data-label="Status"
                        className="text-nowrap text-center"
                      >
                        <div className="d-flex align-items-center justify-content-center">
                          {item.is_active
                            ? Status("active", "success")
                            : Status("not active", "danger")}
                        </div>
                      </td>
                      <td
                        data-label="Actions"
                        className="text-center users.update"
                      >
                        <div className="d-flex justify-content-center">
                          <BtnIcon
                            className="users.update"
                            type="update"
                            onClick={() => {
                              this.setState({
                                ...item,
                                role_id: item.role?.uid || "",
                                broker_id: item.broker?.uid || "",
                                modal_update: true,
                              });
                            }}
                          />
                          {!item.is_active &&
                            profile?.user_type === "super_user" && (
                              <BtnIcon
                                className="users.delete"
                                type="delete"
                                onClick={() => {
                                  this.Delete(item.uid);
                                }}
                              />
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="w-100 d-flex align-items-center justify-content-end flex-wrap mt-2">
            <Pagination
              className="mb-3"
              count={Math.ceil(count / 10) || 1}
              showFirstButton
              showLastButton
              onChange={(_, page) => this.Get(page)}
            />
          </div>
        </div>
        {/* CREATE UPDATE */}
        <Modal
          show={modal_create || modal_update}
          onHide={() =>
            this.setState({ modal_create: false, modal_update: false })
          }
        >
          <Modal.Header className="border-0" closeButton>
            <h5 className="fw-bold mb-0">
              {modal_create ? "Create" : modal_update ? "Update" : ""} User
            </h5>
          </Modal.Header>
          <Modal.Body className="pb-0">
            <div className="d-flex mb-3">
              <div className="wpx-150 mt-2">Name{required}</div>
              <input
                type="text"
                className="form-control"
                placeholder="Name..."
                onChange={(e) => {
                  this.setState({ full_name: e.target.value });
                }}
                value={full_name}
              />
            </div>
            <div className="d-flex mb-3">
              <div className="wpx-150 mt-2">Phone{required}</div>
              <input
                type="text"
                className="form-control"
                placeholder="Phone..."
                maxLength={10}
                onChange={(e) => {
                  if (!float(e.target.value)) return;
                  this.setState({ phone: e.target.value });
                }}
                value={phone}
              />
            </div>
            <div className="d-flex mb-3">
              <div className="wpx-150 mt-2">Role{required}</div>
              <select
                className="form-select"
                placeholder="Role..."
                onChange={(e) => {
                  this.setState({
                    role_id: e.target.value,
                    user_type:
                      data_role?.find((item) => item.uid === e.target.value)
                        ?.name || "",
                    broker_id: "",
                  });
                }}
                value={role_id}
              >
                <option value="">-- Select Role --</option>
                {data_role?.map((item, index) => (
                  <option key={`array-${index}`} value={item.uid}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex mb-3">
              <div className="wpx-150 mt-2">User Type{required}</div>
              <select
                className="form-select"
                placeholder="User Type..."
                onChange={(e) => {
                  this.setState({
                    user_type: e.target.value
                  });
                }}
                value={user_type}
              >
                <option value="">-- Select User Type --</option>
                <option value="admin">Admin</option>
                <option value="admin_broker">Admin Broker</option>
                <option value="broker">Broker</option>
                <option value="sub_broker">Sub Broker</option>
                <option value="agent">Agent</option>
                <option value="accounting">Accounting</option>
              </select>
            </div>
            {(user_type === "sub_broker" || user_type === "broker") && (
              <div className="d-flex mb-3">
                <div className="wpx-150 mt-2">
                  Broker{user_type === "sub_broker" && required}
                </div>
                <Select
                  className="form-control"
                  placeholder="Broker..."
                  options={data_broker}
                  onChange={(e, i) => {
                    this.setState({ broker_id: e });
                  }}
                  value={broker_id}
                ></Select>
              </div>
            )}
            <div className="d-flex mb-3">
              <div className="wpx-150 mt-2">Email{required}</div>
              <input
                type="email"
                className="form-control"
                placeholder="Email..."
                onChange={(e) => {
                  this.setState({ email: e.target.value });
                }}
                value={email}
                disabled={modal_update}
              />
            </div>
            {(modal_create || profile?.user_type === "super_user") && (
              <>
                <div className="d-flex mb-3">
                  <div className="wpx-150 mt-2">Password{required}</div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Password..."
                    onChange={(e) => {
                      this.setState({ password: e.target.value });
                    }}
                    value={password}
                  />
                  <button
                    className="btn btn-dark ms-2 px-3 text-nowrap"
                    onClick={() => {
                      const text = random_charactor(12);
                      this.setState({ password: text });
                    }}
                  >
                    Generate
                  </button>
                </div>
              </>
            )}
            <div className="d-flex align-items-center mb-2">
              <div className="wpx-150 mt-2">ACTIVE</div>
              <Switch
                onChange={(e) => {
                  this.setState({ is_active: e });
                }}
                checked={is_active}
              />
            </div>
          </Modal.Body>
          <Modal.Footer className="pt-0 border-0 d-flex justify-content-between">
            <BtnIcon type="copy" onClick={() => {
                copyText(`username: ${email}
password: ${password}`)
                }}/>
            <div className="d-flex">
              <button
                className="btn btn-dark px-5 me-1"
                onClick={() => {
                  this.CreateUpdate();
                }}
              >
                Submit
              </button>
              <button
                className="btn btn-outline-dark px-5 ms-1"
                onClick={() => {
                  this.setState({ modal_create: false, modal_update: false });
                }}
              >
                Cancel
              </button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
