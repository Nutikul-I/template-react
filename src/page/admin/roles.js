import React, { Component } from "react";
import {
  alert,
  GET,
  POST,
  PUT,
  loading,
  required,
  BtnIcon,
  Pagination,
  Navbar,
  Modal,
  copyText
} from "../../components/CustomComponent.js";
export default class Roles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal_create: false,
      modal_update: false,

      filter_search: "",

      data: [],
      count: 10,

      id: "",
      uid: "",
      name: "",
      permission: "",
    };
  }

  async componentDidMount() {
    loading(false);
    await this.Get(1);
  }
  Get = async (page) => {
    const { filter_search } = this.state;
    let data, count;
    loading(true);
    let [result] = await Promise.all([
      GET("v1/admin/roles", { data_search: filter_search }),
    ]);
    if (result?.status) {
      data = result.data;
      count = 0;
    }
    this.setState({
      data,
      count,
    });
    loading(false);
  };
  CreateUpdate = async () => {
    const { uid, name, permission } = this.state;
    if (!name.trim()) {
      alert("", "warning", "Warning", "Please input Name");
      return;
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
        name,
        permission,
      };

      let result = !uid
        ? await POST("v1/admin/roles", body)
        : await PUT("v1/admin/roles/" + uid, body);
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
  render() {
    const {
      modal_create,
      modal_update,
      filter_search,
      data,
      count,
      name,
      permission,
    } = this.state;
    return (
      <div className="w-100 min-vh-100">
        <Navbar />
        <div className="body p-3 mt-3">
          <div className="d-flex justify-content-between">
            <div>
              <h4 className="fw-bold mb-1">Role Settings</h4>
              <div className="text-secondary mb-3">
                Manage user roles and permissions
              </div>
            </div>
            <div className="d-flex align-items-center">
              <button className="btn btn-dark px-4 roles.create" onClick={() => {
              this.setState({modal_create: true,
                id: "",
                uid: "",
                name: "",
                permission: "",
              })
            }}>Create</button>
            </div>
          </div>
          

          <div className="rounded-4 bg-white p-3 mb-3">
            <h5 className="fw-bold mb-3">
              <span className="icon me-1 text-14">{"\uf0b0"}</span>Filter
            </h5>
            <div className="d-flex align-items-center flex-wrap">
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
          <div className="rounded-4 bg-white p-3">
            <div className="table-responsive">
              <table className="table table-hover table-striped-columns">
                <thead>
                  <tr>
                    <td className="text-nowrap wpx-350">UID</td>
                    <td className="text-nowrap">Name</td>
                    <td className="text-center wpx-100 roles.update">Edit</td>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item, index) => (
                    <tr key={`array-${index}`}>
                      <td data-label="Name" className="text-nowrap">
                        <div className="d-flex justify-content-between">
                        {item.uid || "-"}
                        <span
                          className="icon pointer ms-2"
                          title="Copy"
                          onClick={() => {
                            copyText(item.uid || "");
                          }}
                        >
                          {"\uf0c5"}
                        </span>
                        </div>
                      </td>
                      <td data-label="Name" className="text-nowrap">
                        {item.name || "-"}
                      </td>
                      <td
                        data-label="Edit"
                        className="text-center roles.update"
                      >
                        <div className="d-flex justify-content-center">
                          <BtnIcon
                            className="roles.update"
                            type="update"
                            onClick={() => {
                              this.setState({ ...item, modal_update: true });
                            }}
                          />
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
              {modal_create ? "Create" : modal_update ? "Update" : ""} Role
            </h5>
          </Modal.Header>
          <Modal.Body className="pb-0">
            <div className="d-flex mb-3">
              <div className="wpx-100 mt-2">Name{required}</div>
              <input
                type="text"
                className="form-control"
                placeholder="Name..."
                onChange={(e) => {
                  this.setState({ name: e.target.value });
                }}
                value={name}
              />
            </div>
            <div>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th className="bg-light">Name</th>
                    <th className="text-center bg-light">
                      <div>All</div>
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const allNames = [
                            ...new Set(
                              global.permission.map(
                                (perm) => perm.split(".")[0]
                              )
                            ),
                          ];
                          const actions = [
                            "read",
                            "create",
                            "update",
                            "delete",
                          ];
                          const allPermissions = allNames.flatMap((name) =>
                            actions.map((action) => `${name}.${action}`)
                          );

                          const updated = checked
                            ? [...new Set([...permission, ...allPermissions])]
                            : permission.filter(
                                (p) => !allPermissions.includes(p)
                              );
                          this.setState({ permission: updated });
                        }}
                        checked={(() => {
                          const allNames = [
                            ...new Set(
                              global.permission.map(
                                (perm) => perm.split(".")[0]
                              )
                            ),
                          ];
                          const actions = [
                            "read",
                            "create",
                            "update",
                            "delete",
                          ];
                          const allPermissions = allNames.flatMap((name) =>
                            actions.map((action) => `${name}.${action}`)
                          );
                          return allPermissions.every((p) =>
                            permission.includes(p)
                          );
                        })()}
                      />
                    </th>
                    {["read", "create", "update", "delete"].map((action) => (
                      <th className="text-center bg-light" key={action}>
                        <div>{action}</div>
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            const checked = e.target.checked;
                            const allNames = global.permission
                              .filter((perm) => perm.includes("read"))
                              .map((perm) => perm.split(".")[0]);

                            const updated = checked
                              ? [
                                  ...new Set([
                                    ...permission,
                                    ...allNames.map(
                                      (name) => `${name}.${action}`
                                    ),
                                  ]),
                                ]
                              : permission.filter(
                                  (p) =>
                                    !allNames.some(
                                      (n) => p === `${n}.${action}`
                                    )
                                );

                            this.setState({ permission: updated });
                          }}
                          checked={global.permission
                            .filter((perm) => perm.includes("read"))
                            .map((perm) => perm.split(".")[0])
                            .every((name) =>
                              permission.includes(`${name}.${action}`)
                            )}
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {global.permission
                    .filter((e) => e.includes("read"))
                    .map((item, index) => {
                      const name = item.split(".")[0];
                      const actions = ["read", "create", "update", "delete"];

                      const renderCheckbox = (action) => (
                        <td key={action} className="text-center">
                          <input
                            type="checkbox"
                            checked={permission.includes(`${name}.${action}`)}
                            onChange={() => {
                              this.setState({
                                permission: permission.includes(
                                  `${name}.${action}`
                                )
                                  ? permission.filter(
                                      (p) => p !== `${name}.${action}`
                                    )
                                  : [...permission, `${name}.${action}`],
                              });
                            }}
                          />
                        </td>
                      );

                      return (
                        <tr key={index}>
                          <td>{name}</td>
                          <td key={"all"} className="text-center">
                            <input
                              type="checkbox"
                              checked={actions.every((action) =>
                                permission.includes(`${name}.${action}`)
                              )}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                const updatedPermissions = checked
                                  ? [
                                      ...new Set([
                                        ...permission,
                                        ...actions.map(
                                          (action) => `${name}.${action}`
                                        ),
                                      ]),
                                    ]
                                  : permission.filter(
                                      (p) =>
                                        !actions.some(
                                          (action) => p === `${name}.${action}`
                                        )
                                    );

                                this.setState({
                                  permission: updatedPermissions,
                                });
                              }}
                            />
                          </td>
                          {actions.map(renderCheckbox)}
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </Modal.Body>
          <Modal.Footer className="pt-0 border-0 d-flex justify-content-end">
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
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
