import React, { Component } from "react";
import {
  profile,
  GET,
  alert,
  loading,
} from "./CustomComponent.js";
import { Navbar, Nav } from "react-bootstrap";
import LOGO from "../assets/images/logo-landscape.png";
import LOGO512 from "../assets/images/logo.png";
import "../assets/css/bootstrap.css";
import "../assets/css/style.css";
export default class NavbarComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total_balance_available: 0,
      total_balance_thb: 0,
      total_balance_lak: 0,
      dropdown: "",
      array_link: [...this.filterMenu(profile)],
      user_profile: profile,
      modal_news: false,
      announce_datetime: "",
      announce_duration: 0,
      announce_detail: "",
    };
  }

  icon = (io) => <span className="icon">{io}</span>;

  componentDidMount = async () => {
    // โหลดโปรไฟล์
    // await this.GetProfile();

    // ตรวจสอบการล็อกอิน
    // if (!profile) {
    //   window.location.href = "/";
    //   return;
    // } else {
    //   localStorage.clear();
    //   window.location.href = "/";
    // }
  };
  GetProfile = async () => {
    const result = await GET("v1/admin/users/profile");
    if (result?.status) {
      localStorage.setItem("scp-profile", JSON.stringify(result.data));
      this.setState({
        user_profile: result.data,
        array_link: [...this.filterMenu(result.data)],
      });
      this.permissionSetting();
    }
  };
  async componentDidUpdate() {
    const active = document.querySelector(".active");
    if (active) {
      active.focus();
      active.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    this.permissionSetting();
  }
  filterMenu = (profile) => {
    let perms = profile?.role?.permission || [];
    perms.push("dashboard.read");

    const menu = global.menu?.filter(
      (item) =>
        !item.link ||
        perms.includes(item.link.slice(1) + ".read") ||
        perms.includes(item.type + ".read"),
    );
    return menu
      .reduce((acc, item) => {
        if (item.title && acc.at(-1)?.title) return acc;
        acc.push(item);
        return acc;
      }, [])
      .filter((_, i, arr) => !(i === arr.length - 1 && arr[i].title));
  };
  permissionSetting = () => {
    const role = new Set(this.state.user_profile?.role?.permission || []);
    global.permission.forEach((perm) => {
      if (!role.has(perm)) {
        [...document.getElementsByClassName(perm)].forEach((el) => el.remove());
      }
    });
  };
  componentMenu = () => {
    const classNameBTN =
      "btn btn-outline-dark border-0 w-100 text-start d-flex align-items-center justify-content-start p-1 mb-1 rounded-3";
    const classNameICON = "icon wpx-20 ms-1";
    const currentPath = `/${window.location.href.split("/").pop()}`;
    const linkItem = (href, icon, label, isActive, extra = null) => (
      <a
        href={href}
        className={`${classNameBTN} ${isActive ? "active" : ""}`}
        style={{ borderRadius: 12 }}
      >
        <span className={classNameICON} style={{ borderRadius: 10 }}>
          {icon}
        </span>
        <div className="mx-2">{label}</div>
        {extra}
      </a>
    );

    const { array_link } = this.state;

    return (
      <div>
        {array_link.map((item, i) => {
          if (item.title)
            return (
              <div className="my-2 text-12" key={`title-${i}`}>
                <b>{item.title}</b>
              </div>
            );
          const params = [`type=${item.type}`]?.filter(Boolean).join("&");
          const href = `${item.link}${
            item.type || item.country ? "?" + params : ""
          }`;
          const isActive = href === currentPath;
          return linkItem(
            `${href}`,
            item.icon,
            item.name,
            isActive,
            item.component,
          );
        })}

        <hr />

        <div className="d-block d-xl-none">
          <button
            className={`${classNameBTN} text-danger`}
            style={{ borderRadius: 16 }}
            onClick={async () => {
              this.Logout();
            }}
          >
            <span className={classNameICON} style={{ borderRadius: 12 }}>
              {"\uf2f5"}
            </span>
            <div className="mx-2">Logout</div>
          </button>
        </div>
        <div className="d-none d-xl-block hpx-100"></div>
      </div>
    );
  };
  Logout = async () => {
    if (
      await alert(
        "",
        "warning",
        "Confirm",
        "Press 'Logout' to confirm leaving this app?",
        "Logout",
        "cancel",
      )
    ) {
      loading(true);
      let result = await GET("logout", null);
      if (result?.status) {
        localStorage.clear();
        window.location.href = "/";
      }
      loading(false);
    }
  };

  render() {
    const {
      user_profile,
      modal_news,
      announce_datetime,
      announce_duration,
      announce_detail,
    } = this.state;
    return (
      <div className="hpx-50">
        <Navbar
          className="px-3 px-xl-4 bg-light position-fixed w-100 border-secondary-light"
          style={{ zIndex: 1020, border: "0", borderBottom: "1px solid" }}
          expand="xl"
        >
          <Navbar.Brand href={`/dashboard`} className="fw-bold text-dark d-flex">
            <div className="position-relative">
              <img
                alt="logo"
                src={LOGO}
                height={25}
                style={{ objectFit: "contain" }}
                className="pointer d-none d-sm-block"
                onClick={() => {
                  window.location.href = `/dashboard`;
                }}
              />
              <img
                alt="logo"
                src={LOGO512}
                height={30}
                style={{ objectFit: "contain" }}
                className="pointer d-block d-sm-none"
                onClick={() => {
                  window.location.href = `/dashboard`;
                }}
              />
              <span className="position-absolute d-none d-sm-block" style={{ right: 8, bottom: -4, fontSize: 10, color: "#dabb55" }}>
                {user_profile?.user_type?.replaceAll("_", "")} v{" "}
                {global.version}
              </span>
            </div>
          </Navbar.Brand>
          <div className="d-flex">
            <Navbar.Toggle className="border-0" aria-controls="basic-navbar-nav"/>
          </div>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <div className="d-none d-xl-flex align-items-center">
                <div className="hpx-40 mx-2 bg-secondary-light" style={{ width: 1 }}/>
                <div className="d-none d-xl-flex align-items-center text-start">
                  <span className="bg-warning text-dark me-1 wpx-30 hpx-30 rounded-circle d-flex align-items-center justify-content-center">
                    {user_profile?.full_name?.slice(0, 2).toUpperCase() || "US"}
                  </span>
                  <div className="px-2">
                    <div className="text-14">
                      {user_profile?.full_name || "Username"}
                    </div>
                    <div className="text-12 text-secondary" style={{ marginTop: -2 }}>
                      {user_profile?.user_type?.replaceAll("_", " ")}
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-block d-xl-none mb-5 pt-4 overflow-scroll" style={{ height: "80vh" }}>
                {this.componentMenu()}
              </div>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div
          className="position-fixed wpx-260 bg-light overflow-scroll d-none d-xl-block border-secondary-light"
          style={{
            zIndex: 1021,
            height: "100vh",
            border: "0",
            borderRight: "1px solid",
          }}
        >
          <div
            className="d-flex pt-3 position-fixed bg-light pb-4 px-3 wpx-260 border-secondary-light"
            style={{
              border: "0",
              borderBottom: "1px solid",
              borderRight: "1px solid",
            }}
          >
            <div className="position-relative">
              <img
                alt="logo"
                src={LOGO}
                height={25}
                style={{ objectFit: "contain" }}
                className="pointer"
                onClick={() => {
                  window.location.href = `/dashboard`;
                }}
              />
              <span
                className="position-absolute"
                style={{ right: 8, bottom: -4, fontSize: 10, color: "#dabb55" }}
              >
                {user_profile?.user_type?.replaceAll("_", "")} v{" "}
                {global.version}
              </span>
            </div>
          </div>
          <div className="px-3 mb-5" style={{ marginTop: 70 }}>
            {this.componentMenu()}
          </div>
          <div
            className="d-flex pt-2 position-fixed bg-light pb-3 px-3 wpx-260 border-secondary-light"
            style={{
              bottom: 0,
              border: "0",
              borderRight: "1px solid",
              borderTop: "1px solid",
            }}
          >
            <div className="d-flex align-items-center text-start w-100">
              <span className="bg-warning text-dark me-1 wpx-30 hpx-30 rounded-circle d-flex align-items-center justify-content-center">
                {user_profile?.full_name?.slice(0, 2).toUpperCase() || "US"}
              </span>
              <div className="px-2 w-100">
                <div className="text-14">
                  {user_profile?.full_name || "Username"}
                </div>
                <div
                  className="text-12 text-secondary"
                  style={{ marginTop: -2 }}
                >
                  {user_profile?.email}
                </div>
              </div>
              <span
                className="icon p-2 pointer"
                onClick={() => {
                  this.Logout();
                }}
              >
                {"\uf08b"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
