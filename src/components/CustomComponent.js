import React, { Component } from "react";
import Swal from "sweetalert2";
import "../assets/css/bootstrap.css";
import "../assets/css/style.css";
const tokens = localStorage.getItem("scp-acc-tk") || "";
const profile = localStorage.getItem("scp-profile")
  ? JSON.parse(localStorage.getItem("scp-profile"))
  : null;
const required = <span className="text-danger">*</span>;
const alert = (url, icon, title, detail, confirm, cancel) => {
  // if(confirm){
const modals = document.getElementsByClassName("swal2-modal");
const icons = document.getElementsByClassName("swal2-icon");

  const hasBangIcon = Array.from(icons).some(
    (el) => el.textContent.trim() === "!"
  );
  if (modals.length >= 2 || hasBangIcon) return;

  return Swal.fire({
    icon: icon || "warning",
    title: title || (icon === "success" ? "Success" : "Warning"),
    text:
      detail ||
      (icon === "success"
        ? "The transaction was completed successfully."
        : " "),
    confirmButtonText: confirm || "Confirm",
    showCancelButton: !!cancel,
    cancelButtonText: cancel || "Cancel",
    background: "#fff", // Dark / Light background
    color: "#000000", // Text color
    confirmButtonColor: "#212529",
    cancelButtonColor: "unset",
  }).then(({ isConfirmed }) => {
    if (url) {
      if (url === "#") window.location.reload();
      else window.location.href = url;
    }
    return isConfirmed;
  });

  // }else{
  //    return Swal.fire({
  //   toast: true,
  //   position: 'top-end',
  //    icon: icon || "warning",
  //   title: title || (icon === "success" ? "Success" : "Warning"),
  //   text:
  //     detail ||
  //     (icon === "success"
  //       ? "The transaction was completed successfully."
  //       : " "),
  //   showConfirmButton: false,
  //   timer: 1500,
  //   timerProgressBar: true,
  //   background: "#fff",
  //   color:"#000000",
  //   didOpen: (toast) => {
  //     toast.addEventListener('mouseenter', Swal.stopTimer)
  //     toast.addEventListener('mouseleave', Swal.resumeTimer)
  //   }
  // }).then(() => {
  //   if (url) {
  //     if (url === "#") window.location.reload();
  //     else window.location.href = url;
  //   }
  // });
  // }
 
  };
const copyText = (textToCopy) => {
  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Copied successfully",
        showConfirmButton: false,
        timer: 1500,
        background: "#fff", // Dark / Light background
        color: "#000000", // Text color
        confirmButtonColor: "#212529",
        cancelButtonColor: "unset",
      });
    })
    .catch((err) => {});
};
const total = (array, key) => {
  if (!Array.isArray(array)) return 0;
  return key
    ? array.reduce((sum, item) => Number(sum) + (Number(item[key]) || 0), 0)
    : array.reduce((sum, item) => Number(sum) + (Number(item) || 0), 0);
};
const float = (num, length = 2) => {
  const regexPattern = new RegExp(`^\\d*\\.?\\d{0,${length}}$`);
  return regexPattern.test(num);
};
const toFixed = (number, size = 2, ceil = false) => {
  if (!number && number !== 0) return "0.00";
  if (number === 0) return "0.00";

  const num = Number(number.toString());
  const precision = size || 2;
  const processedNum = ceil
    ? Math.ceil(num * Math.pow(10, precision)) / Math.pow(10, precision)
    : num;

  return processedNum.toFixed(precision).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};
const format_date = (date, format, locale, type_excel) => {
  const array_month =
    locale?.toLowerCase() === "en"
      ? [
          "Jan.",
          "Feb.",
          "Mar.",
          "Apr.",
          "May.",
          "Jun.",
          "Jul.",
          "Aug.",
          "Sep.",
          "Oct.",
          "Nov.",
          "Dec.",
        ]
      : [
          "ม.ค.",
          "ก.พ.",
          "มี.ค.",
          "เม.ย.",
          "พ.ค.",
          "มิ.ย.",
          "ก.ค.",
          "ส.ค.",
          "ก.ย.",
          "ต.ค.",
          "พ.ย.",
          "ธ.ค.",
        ];

  const array_full_month =
    locale?.toLowerCase() === "en"
      ? [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ]
      : [
          "มกราคม",
          "กุมภาพันธ์",
          "มีนาคม",
          "เมษายน",
          "พฤษภาคม",
          "มิถุนายน",
          "กรกฎาคม",
          "สิงหาคม",
          "กันยายน",
          "ตุลาคม",
          "พฤศจิกายน",
          "ธันวาคม",
        ];

  let processedDate = date;
  if (type_excel) {
    if (Number(date)) {
      processedDate = new Date(
        date * 24 * 60 * 60 * 1000 + Date.parse("1899-12-30")
      );
    } else if (typeof date === "string") {
      const separator = date.includes("/")
        ? "/"
        : date.includes(".")
        ? "."
        : null;
      if (separator && date.split(separator)[2]?.length === 4) {
        const [day, month, year] = date.split(separator);
        const adjustedYear =
          Number(year) < 2100 ? Number(year) : Number(year) - 543;
        processedDate = `${adjustedYear}-${("0" + month).slice(-2)}-${(
          "0" + day
        ).slice(-2)}`;
      }
    }
  }

  const new_date = new Date(processedDate);
  if (isNaN(new_date.getTime())) return "-";
  const day = new_date.getDate();
  const month = new_date.getMonth();
  const rawYear = new_date.getFullYear();
  const year =
    locale?.toLowerCase() === "en"
      ? rawYear > 2100
        ? rawYear - 543
        : rawYear
      : rawYear > 2100
      ? rawYear
      : rawYear + 543;
  const hour = new_date.getHours();
  const minute = new_date.getMinutes();
  const second = new_date.getSeconds();
  if (!format) {
    return `${String(day).padStart(2, "0")}/${String(month + 1).padStart(
      2,
      "0"
    )}/${String(year).padStart(4, "0")}`;
  }

  if (format === "date") {
    return new_date.getTime();
  }
  let formatted = format
    .toLowerCase()
    // Time formats
    .replace(
      /hh:mm:ss/g,
      `${String(hour).padStart(2, "0")}:${String(minute).padStart(
        2,
        "0"
      )}:${String(second).padStart(2, "0")}`
    )
    .replace(
      /hh:mm/g,
      `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
    )
    .replace(/hh/g, String(hour).padStart(2, "0"))
    .replace(/h:m:s/g, `${hour}:${minute}:${second}`)
    .replace(/h:m/g, `${hour}:${minute}`)
    // Day formats
    .replace(/dd/g, String(day).padStart(2, "0"))
    .replace(/\bd\b/g, day)
    // Month formats
    .replace(/mmmm/g, array_full_month[month])
    .replace(/mmm/g, array_month[month])
    .replace(/\bmm\b/g, String(month + 1).padStart(2, "0"))
    .replace(/\bm\b/g, (month + 1).toString())
    // Year formats
    .replace(/yyyy/g, String(year).padStart(4, "0"))
    .replace(/yyy/g, year.toString().slice(-3))
    .replace(/\byy\b/g, year.toString().slice(-2))
    .replace(/\by\b/g, year);

  return formatted || "";
};
function removeEmptyString(value) {
  // Array
  if (Array.isArray(value)) {
    const arr = value
      .map(removeEmptyString)
      .filter(v => v !== "" && v !== null);

    return arr.length > 0 ? arr : null;
  }

  // Object
  if (value && typeof value === "object") {
    const obj = Object.fromEntries(
      Object.entries(value)
        .map(([k, v]) => [k, removeEmptyString(v)])
        .filter(([_, v]) => v !== "" && v !== null)
    );

    return Object.keys(obj).length > 0 ? obj : null;
  }

  return value;
}
const GET = async (url, body) => {
  return new Promise((resolve) => {
    let queryString = "";
    if (body) {
      queryString =
        "?" +
        Object.entries(body)
          .map(([key, value]) => `${key}=${value}`)
          .join("&");
    }
    const apiUrl = url.includes("://") ? url :
      (process.env.REACT_APP_API_URL + url).replaceAll(" ", "") + queryString;

    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: atob(tokens),
      },
      cache: "no-cache",
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.status) {
          resolve(result);
          return;
        }
        const message = ERROR(result);
        if (message === "Token not found" || message === "Token has expired") {
          localStorage.clear();
          alert("/", "warning", "Warning", message);
          resolve({ status: false, message });
          return;
        }
        if (message === "fetch is not defined") {
          alert("", "warning", "Warning", "Data not found");
          resolve({ status: false, message });
          return;
        }
        alert("", "warning", "Warning", message);
        resolve({ status: false, message });
      })
      .catch(() => {
        resolve({ status: false, message: "Error" });
      });
  });
};
const POST = async (url, body) => {
  return new Promise((resolve) => {
    fetch(url.includes("://") ? url : (process.env.REACT_APP_API_URL + url).replaceAll(" ", ""), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: atob(tokens),
      },
      cache: "no-cache",
      body: JSON.stringify(removeEmptyString(body)),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.status) {
          resolve(result);
          return;
        }
        const message = ERROR(result);
        if (message === "Token not found" || message === "Token has expired") {
          localStorage.clear();
          alert("/", "warning", "Warning", message);
          resolve({ status: false, message });
          return;
        } else if (
          message === "User not verified, please verify your account first"
        ) {
          resolve({ status: false, message });
          return;
        }
        alert("", "warning", "Warning", message);
        resolve({ status: false, message });
      })
      .catch(() => {
        resolve({ status: false, message: "Error" });
      });
  });
};
const PUT = async (url, body) => {
  return new Promise((resolve) => {
    fetch(url.includes("://") ? url : (process.env.REACT_APP_API_URL + url).replaceAll(" ", ""), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: atob(tokens),
      },
      cache: "no-cache",
      body: JSON.stringify(removeEmptyString(body)),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.status) {
          resolve(result);
          return;
        }
        const message = ERROR(result);
        if (message === "Token not found" || message === "Token has expired") {
          localStorage.clear();
          alert("/", "warning", "Warning", message);
          resolve({ status: false, message });
          return;
        }
        alert("", "warning", "Warning", message);
        resolve({ status: false, message });
      })
      .catch(() => {
        resolve({ status: false, message: "Error" });
      });
  });
};
const DELETE = async (url, body) => {
  return new Promise((resolve) => {
    fetch(url.includes("://") ? url : (process.env.REACT_APP_API_URL + url).replaceAll(" ", ""), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: atob(tokens),
      },
      cache: "no-cache",
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.status) {
          resolve(result);
          return;
        }
        const message = ERROR(result);
        if (message === "Token not found" || message === "Token has expired") {
          localStorage.clear();
          alert("/", "warning", "Warning", message);
          resolve({ status: false, message });
          return;
        }
        alert("", "warning", "Warning", message);
        resolve({ status: false, message });
      })
      .catch(() => {
        resolve({ status: false, message: "Error" });
      });
  });
};
const ERROR = (result) => {
  loading(false);
  if (!result) return "";
  if (result.detail) {
    return result.detail;
  }
  if (result.data) {
    if (result.data.message) {
      return result.data.message;
    }
    return result.data;
  }
  return result.message || "";
};
const random_charactor = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join("");
};
const loading = (status) => {
  try {
    const loading = document.getElementById("loading");
    if (status === true) {
      loading.classList.remove("d-none");
    } else if (status === false) {
      loading.classList.add("d-none");
    }
  } catch (e) {}
};
const Status = (status, color, icon) => {
  return (
    <div className="d-flex">
      <span
        className={`bg-${color || "primary"}-light text-${
          color || "primary"
        } border-status-${
          color || "primary"
        } px-2 pt-0 rounded-4 text-nowrap d-flex text-12 mx-1`}
        style={{ padding: "2px 0 0 2px" }}
      >
        {status}
        {icon && (
          <span className={`icon ms-1 text-${color || "primary"}`}>{icon}</span>
        )}
      </span>
    </div>
  );
};
const params = (name) => {
  const queryParams = new URLSearchParams(window.location.search);
  return queryParams.get(name);
};
class DatePicker extends Component {
  state = {
    value: "",
    default: new Date(),
    array_date: [],
    array_month: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    array_year: [],
    showCalendar: false,
    min: new Date(new Date().setFullYear(new Date().getFullYear() - 100)),
    max: new Date(new Date().setFullYear(new Date().getFullYear() + 100)),
  };
  componentDidMount = () => {
    let year = [];
    for (let i = -100; i < 100; i++) {
      year.push(new Date().getFullYear() + i);
    }
    this.setState({ array_year: year });
    if (this.props.value) {
      this.setState({
        default: new Date(this.props.value),
        value: new Date(this.props.value),
      });
    }
    if (this.props.min) {
      this.setState({ min: new Date(this.props.min) });
    } else {
      this.setState({
        min: new Date(new Date().setFullYear(new Date().getFullYear() - 100)),
      });
    }
    if (this.props.max) {
      this.setState({ max: new Date(this.props.max) });
    } else {
      this.setState({
        max: new Date(new Date().setFullYear(new Date().getFullYear() + 100)),
      });
    }
    this.getDates();
  };
  componentWillReceiveProps = (props) => {
    if (props.min) {
      this.setState({ min: new Date(props.min) });
    } else {
      this.setState({
        min: new Date(new Date().setFullYear(new Date().getFullYear() - 100)),
      });
    }
    if (props.max) {
      this.setState({ max: new Date(props.max) });
    } else {
      this.setState({
        max: new Date(new Date().setFullYear(new Date().getFullYear() + 100)),
      });
    }
    if (props.value) {
      this.setState({
        default: new Date(props.value),
        value: new Date(props.value),
      });
    } else {
      this.setState({ default: new Date(), value: "" });
    }
  };
  onChangeDate = (option) => {
    if (option === "") {
      this.props.onChange("");
    } else {
      this.props.onChange(
        Number(option.getFullYear()) +
          "-" +
          ("0" + (Number(option.getMonth()) + 1)).slice(-2) +
          "-" +
          ("0" + option.getDate()).slice(-2)
      );
    }
    this.setState({ value: option, showCalendar: false });
  };
  getDates = () => {
    let dates = [];
    let date = new Date(
      this.state.default.getFullYear(),
      this.state.default.getMonth(),
      1
    );
    for (let d = 0; d < new Date(date).getDay(); d++) {
      dates.push("");
    }
    while (date.getMonth() === this.state.default.getMonth()) {
      dates.push(new Date(date).getDate());
      date.setDate(date.getDate() + 1);
    }
    this.setState({ array_date: dates });
  };
  render() {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          fontSize: "0.8rem",
        }}
      >
        {this.state.showCalendar && (
          <div
            style={{
              bottom: 0,
              left: 0,
              top: 0,
              right: 0,
              backgroundColor: "#0000",
              zIndex: 1000,
              position: "fixed",
            }}
            onClick={() => {
              this.setState({ showCalendar: false });
            }}
          ></div>
        )}
        <div style={{ width: "100%" }}>
          <div style={{ position: "relative" }}>
            <input
              className={this.props.className}
              style={{ cursor: "pointer" }}
              type="text"
              value={
                this.state.value && typeof this.state.value === "object"
                  ? ("0" + this.state.value.getDate()).slice(-2) +
                    "/" +
                    ("0" + (Number(this.state.value.getMonth()) + 1)).slice(
                      -2
                    ) +
                    "/" +
                    Number(this.state.value.getFullYear())
                  : this.state.value
              }
              placeholder={
                this.props.placeholder ? this.props.placeholder : "dd/mm/yyyy"
              }
              onFocus={() => {
                this.setState({
                  showCalendar: true,
                  default: this.state.value
                    ? new Date(this.state.value)
                    : new Date(),
                });
                setTimeout(() => {
                  this.getDates();
                  let offsets = document.getElementById("calendar");
                  let box_left = offsets.getBoundingClientRect().left;
                  let box_top = offsets.getBoundingClientRect().top;
                  let width = window.innerWidth;
                  let height = window.innerHeight;
                  if (box_left + 300 > width) {
                    offsets.style.left = "-300px";
                  }
                  if (box_top + 335 > height) {
                    offsets.style.top = "-335px";
                  }
                  offsets.style.opacity = "1";
                }, 1);
              }}
              onChange={(e) => {
                this.setState({ value: e.target.value });
              }}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  e.target.blur();
                }
              }}
              onBlur={() => {
                const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
                if (regex.test(this.state.value)) {
                  this.setState({
                    default: new Date(
                      Number(this.state.value.split("/")[2]) > 2100
                        ? Number(this.state.value.split("/")[2]) - 543
                        : Number(this.state.value.split("/")[2]),
                      Number(this.state.value.split("/")[1]) - 1,
                      Number(this.state.value.split("/")[0])
                    ),
                  });
                  setTimeout(() => {
                    this.onChangeDate(
                      new Date(
                        this.state.default.getFullYear(),
                        this.state.default.getMonth(),
                        this.state.default.getDate()
                      )
                    );
                  }, 10);
                } else if (
                  typeof this.state.value === "object" &&
                  this.state.value !== "Invalid Date"
                ) {
                  console.log("Invalid Date");
                } else if (
                  this.state.value.length === 8 &&
                  Number(this.state.value)
                ) {
                  this.setState({
                    default: new Date(
                      Number(this.state.value.slice(-4)) > 2100
                        ? Number(this.state.value.slice(-4)) - 543
                        : Number(this.state.value.slice(-4)),
                      Number(this.state.value.slice(2, 4)) - 1,
                      Number(this.state.value.slice(0, 2))
                    ),
                  });
                  setTimeout(() => {
                    this.onChangeDate(
                      new Date(
                        this.state.default.getFullYear(),
                        this.state.default.getMonth(),
                        this.state.default.getDate()
                      )
                    );
                  }, 10);
                } else {
                  this.setState({ value: "" });
                }
              }}
              disabled={this.props.disabled}
              maxLength={10}
            />
            <svg
              style={{ position: "absolute", right: 12, top: 8 }}
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="#d2d2d2"
              viewBox="0 0 448 512"
            >
              <path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40L64 64C28.7 64 0 92.7 0 128l0 16 0 48L0 448c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-256 0-48 0-16c0-35.3-28.7-64-64-64l-40 0 0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40L152 64l0-40zM48 192l80 0 0 56-80 0 0-56zm0 104l80 0 0 64-80 0 0-64zm128 0l96 0 0 64-96 0 0-64zm144 0l80 0 0 64-80 0 0-64zm80-48l-80 0 0-56 80 0 0 56zm0 160l0 40c0 8.8-7.2 16-16 16l-64 0 0-56 80 0zm-128 0l0 56-96 0 0-56 96 0zm-144 0l0 56-64 0c-8.8 0-16-7.2-16-16l0-40 80 0zM272 248l-96 0 0-56 96 0 0 56z" />
            </svg>
          </div>
          {this.state.showCalendar && (
            <div
              id="calendar"
              style={{
                opacity: 0,
                zIndex: 1001,
                width: 300,
                position: "absolute",
                marginTop: "0.2rem",
                paddingTop: "0.3rem",
                paddingBottom: "0.3rem",
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
                wordWrap: "break-word",
                backgroundColor: "#ffffff",
                backgroundClip: "border-box",
                border: "1px solid rgba(0,0,0,.125)",
                borderRadius: 8,
                boxShadow: "0 0.3rem 1rem rgba(0, 0, 0, .15)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {this.state.default.getMonth() === 0 &&
                this.state.default.getFullYear() ===
                  new Date().getFullYear() - 100 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                    width="12"
                    height="12"
                    fill="#e1e2e2"
                  >
                    <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
                  </svg>
                ) : (
                  <span
                    style={{ cursor: "pointer", padding: "1rem" }}
                    onClick={() => {
                      let date = this.state.default;
                      date.setMonth(date.getMonth() - 1);
                      this.setState({ default: date });
                      setTimeout(() => {
                        this.getDates();
                      }, 1);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                      width="12"
                      height="12"
                    >
                      <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
                    </svg>
                  </span>
                )}
                {/* เดือน */}
                <select
                  style={{ width: 100, borderWidth: 0, textAlign: "center" }}
                  onChange={(e) => {
                    let date = this.state.default;
                    date.setMonth(e.target.value);
                    this.setState({ default: date });
                    setTimeout(() => {
                      this.getDates();
                    }, 1);
                  }}
                  value={
                    this.state.default ? this.state.default.getMonth() : " "
                  }
                >
                  {this.state.array_month.map((item, index) => (
                    <option key={`array-${index}`} value={index}>
                      {item}
                    </option>
                  ))}
                </select>
                <label
                  style={{
                    marginLeft: "0.3rem",
                    marginRight: "0.3rem",
                    paddingBottom: 0,
                    cursor: "pointer",
                  }}
                >
                  {this.props.type === "th" ? "พ.ศ." : "ค.ศ."}
                </label>
                {/* ปี */}
                <select
                  style={{ width: 60, borderWidth: 0, textAlign: "center" }}
                  onChange={(e) => {
                    let date = this.state.default;
                    date.setFullYear(e.target.value);
                    this.setState({ default: date });
                    setTimeout(() => {
                      this.getDates();
                    }, 1);
                  }}
                  value={
                    this.state.default ? this.state.default.getFullYear() : " "
                  }
                >
                  {this.state.array_year.map((item, index) => (
                    <option key={`array-${index}`} value={item}>
                      {this.props.type === "th" ? item + 543 : item}{" "}
                    </option>
                  ))}
                </select>
                {this.state.default.getMonth() === 11 &&
                this.state.default.getFullYear() ===
                  new Date().getFullYear() + 99 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                    width="12"
                    height="12"
                    fill="#e1e2e2"
                  >
                    <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                  </svg>
                ) : (
                  <span
                    style={{ cursor: "pointer", padding: "1rem" }}
                    onClick={() => {
                      let date = this.state.default;
                      date.setMonth(date.getMonth() + 1);
                      this.setState({ default: date });
                      setTimeout(() => {
                        this.getDates();
                      }, 1);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                      width="12"
                      height="12"
                    >
                      <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                    </svg>
                  </span>
                )}
              </div>
              <div
                style={{
                  marginBottom: "1rem",
                  marginLeft: 0,
                  marginRight: 0,
                  width: "100%",
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (item, index) => (
                    <div
                      key={"day_" + index}
                      style={{
                        width: "14.28%",
                        padding: "0,25rem 0",
                        textAlign: "center",
                      }}
                    >
                      {item}
                    </div>
                  )
                )}
              </div>
              <div
                style={{
                  marginTop: "-1rem",
                  marginLeft: 0,
                  marginRight: 0,
                  width: "100%",
                  display: "flex",
                  flexWrap: "wrap",
                  height: 220,
                }}
              >
                {this.state.array_date.map((item, index) => (
                  <div
                    key={"date_" + index}
                    style={
                      this.state.value &&
                      typeof this.state.value === "object" &&
                      item &&
                      this.state.value.getDate() === item &&
                      this.state.value.getMonth() ===
                        this.state.default.getMonth() &&
                      this.state.value.getFullYear() ===
                        this.state.default.getFullYear()
                        ? new Date(
                            this.state.default.getFullYear(),
                            this.state.default.getMonth(),
                            item
                          ) > this.state.min.getTime() &&
                          new Date(
                            this.state.default.getFullYear(),
                            this.state.default.getMonth(),
                            item
                          ) < this.state.max.getTime()
                          ? {
                              width: "14.28%",
                              paddingTop: "0.3rem",
                              paddingBottom: "0.3rem",
                              textAlign: "center",
                              cursor: "pointer",
                              backgroundColor: "#0d6efd",
                              color: "#ffffff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }
                          : {
                              width: "14.28%",
                              paddingTop: "0.3rem",
                              paddingBottom: "0.3rem",
                              textAlign: "center",
                              backgroundColor: "#0d6efd",
                              color: "#e1e2e2",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }
                        : new Date(
                            this.state.default.getFullYear(),
                            this.state.default.getMonth(),
                            item
                          ) > this.state.min.getTime() &&
                          new Date(
                            this.state.default.getFullYear(),
                            this.state.default.getMonth(),
                            item
                          ) < this.state.max.getTime()
                        ? {
                            width: "14.28%",
                            paddingTop: "0.3rem",
                            paddingBottom: "0.3rem",
                            textAlign: "center",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }
                        : {
                            width: "14.28%",
                            paddingTop: "0.3rem",
                            paddingBottom: "0.3rem",
                            textAlign: "center",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#e1e2e2",
                          }
                    }
                    onClick={() => {
                      if (
                        new Date(
                          this.state.default.getFullYear(),
                          this.state.default.getMonth(),
                          item
                        ) > this.state.min.getTime() &&
                        new Date(
                          this.state.default.getFullYear(),
                          this.state.default.getMonth(),
                          item
                        ) < this.state.max.getTime()
                      ) {
                        this.onChangeDate(
                          new Date(
                            this.state.default.getFullYear(),
                            this.state.default.getMonth(),
                            item
                          )
                        );
                      }
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingLeft: "0.3rem",
                  paddingRight: "0.3rem",
                }}
              >
                {this.props.clearable !== false ? (
                  <label
                    style={{ cursor: "pointer", color: "#0d6efd" }}
                    onClick={() => {
                      this.onChangeDate("");
                    }}
                  >
                    clear
                  </label>
                ) : (
                  <label></label>
                )}
                <label
                  style={{ cursor: "pointer", color: "#0d6efd" }}
                  onClick={() => {
                    this.onChangeDate(new Date());
                  }}
                >
                  To day
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
class DateRangePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start_date: props.value?.start_date
        ? new Date(props.value.start_date)
        : null,
      end_date: props.value?.end_date ? new Date(props.value.end_date) : null,
      hoverDate: null,
      default: new Date(),
      array_date: [],
      array_month: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      array_year: [],
      showCalendar: false,
    };
    this.calendarRef = React.createRef();
    this.inputWrapperRef = React.createRef();
  }

  componentDidMount() {
    let year = [];
    for (let i = -100; i < 100; i++) {
      year.push(new Date().getFullYear() + i);
    }
    this.setState({ array_year: year });
    this.getDates();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.value !== this.props.value) {
      this.setState({
        start_date: this.props.value?.start_date
          ? new Date(this.props.value.start_date)
          : null,
        end_date: this.props.value?.end_date
          ? new Date(this.props.value.end_date)
          : null,
      });
    }
    // ✅ ต้องเช็ค state ก่อน ไม่ใช่ props
    if (this.state.showCalendar && !prevState.showCalendar) {
      this.adjustCalendarPosition();
    }
  }

  adjustCalendarPosition = () => {
    const calendar = this.calendarRef.current;
    const inputWrapper = this.inputWrapperRef.current;
    if (!calendar || !inputWrapper) return;

    const rect = calendar.getBoundingClientRect();
    const inputRect = inputWrapper.getBoundingClientRect();
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let style = {};

    // ถ้าล้นขวา → ขยับเข้ามา
    if (rect.right > screenWidth) {
      style.right = 0;
      style.left = "auto";
    }

    // ถ้าล้นล่าง → แสดงด้านบน input
    if (rect.bottom > screenHeight) {
      style.bottom = inputRect.height + 8; // 8px margin
      style.top = "auto";
      style.marginTop = 0;
    }

    Object.assign(calendar.style, style);
  };

  getDates = () => {
    let dates = [];
    let date = new Date(
      this.state.default.getFullYear(),
      this.state.default.getMonth(),
      1
    );
    for (let d = 0; d < date.getDay(); d++) {
      dates.push("");
    }
    while (date.getMonth() === this.state.default.getMonth()) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    this.setState({ array_date: dates });
  };

  handleDateClick = (date) => {
    const { start_date, end_date } = this.state;
    if (!start_date || (start_date && end_date)) {
      this.setState({ start_date: date, end_date: null }, () => {
        this.props.onChange?.({ start_date: date, end_date: null });
      });
    } else if (start_date && !end_date) {
      if (date >= start_date) {
        this.setState({ end_date: date }, () => {
          this.props.onChange?.({
            start_date: this.state.start_date,
            end_date: date,
          });
        });
      } else {
        this.setState({ start_date: date, end_date: start_date }, () => {
          this.props.onChange?.({ start_date: date, end_date: start_date });
        });
      }
    }
  };

  isInRange = (date) => {
    const { start_date, end_date, hoverDate } = this.state;
    if (!start_date) return false;

    if (start_date && !end_date && hoverDate) {
      return date >= start_date && date <= hoverDate;
    }

    if (start_date && end_date) {
      return date >= start_date && date <= end_date;
    }
    return false;
  };

  render() {
    const {
      array_date,
      array_month,
      default: current,
      start_date,
      end_date,
      showCalendar,
    } = this.state;

    return (
      <div
        style={{ position: "relative", width: "100%", fontSize: "0.8rem" }}
        ref={this.inputWrapperRef}
      >
        {showCalendar && (
          <div
            style={{
              bottom: 0,
              left: 0,
              top: 0,
              right: 0,
              backgroundColor: "#0000",
              zIndex: 1000,
              position: "fixed",
            }}
            onClick={() => this.setState({ showCalendar: false })}
          />
        )}

        {/* Input */}
        <div style={{ position: "relative" }}>
          <input
            className={this.props.className}
            readOnly
            type="text"
            onFocus={() => this.setState({ showCalendar: true })}
            value={
              start_date
                ? `${format_date(start_date)} - ${
                    end_date ? format_date(end_date) : ""
                  }`
                : ""
            }
            placeholder="Select date range"
            style={{ width: "100%", padding: "0.35rem 0.5rem" }}
          />
          <svg
            style={{ position: "absolute", right: 12, top: 8 }}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="#d2d2d2"
            viewBox="0 0 448 512"
          >
            <path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40L64 64C28.7 64 0 92.7 0 128l0 16 0 48L0 448c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-256 0-48 0-16c0-35.3-28.7-64-64-64l-40 0 0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40L152 64l0-40zM48 192l80 0 0 56-80 0 0-56zm0 104l80 0 0 64-80 0 0-64zm128 0l96 0 0 64-96 0 0-64zm144 0l80 0 0 64-80 0 0-64zm80-48l-80 0 0-56 80 0 0 56zm0 160l0 40c0 8.8-7.2 16-16 16l-64 0 0-56 80 0zm-128 0l0 56-96 0 0-56 96 0zm-144 0l0 56-64 0c-8.8 0-16-7.2-16-16l0-40 80 0zM272 248l-96 0 0-56 96 0 0 56z" />
          </svg>
        </div>

        {/* Calendar */}
        {showCalendar && (
          <div
            id="calendar-range"
            ref={this.calendarRef}
            style={{
              zIndex: 1000,
              width: 320,
              position: "absolute",
              marginTop: "0.2rem",
              padding: "0.5rem",
              backgroundColor: "#fff",
              border: "1px solid rgba(0,0,0,.125)",
              borderRadius: 8,
              boxShadow: "0 0.3rem 1rem rgba(0,0,0,.15)",
              top: "100%",
              left: 0,
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
              }}
            >
              <span
                style={{ cursor: "pointer", padding: "1rem" }}
                onClick={() => {
                  let d = new Date(current);
                  d.setMonth(d.getMonth() - 1);
                  this.setState({ default: d }, this.getDates);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                  width="12"
                  height="12"
                  fill={"#000000"}
                >
                  <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
                </svg>
              </span>
              <div>
                {array_month[current.getMonth()]} {current.getFullYear()}
              </div>
              <span
                style={{ cursor: "pointer", padding: "1rem" }}
                onClick={() => {
                  let d = new Date(current);
                  d.setMonth(d.getMonth() + 1);
                  this.setState({ default: d }, this.getDates);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                  width="12"
                  height="12"
                  fill={"#000000"}
                >
                  <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                </svg>
              </span>
            </div>

            {/* Day headers */}
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
                <div
                  key={i}
                  style={{
                    width: "14.28%",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Dates */}
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {array_date.map((date, idx) => {
                if (!date)
                  return (
                    <div
                      key={idx}
                      style={{ width: "14.28%", height: 30 }}
                    ></div>
                  );

                const isSelected =
                  (start_date &&
                    date.toDateString() === start_date.toDateString()) ||
                  (end_date && date.toDateString() === end_date.toDateString());

                const isInRange = this.isInRange(date);

                return (
                  <div
                    key={idx}
                    style={{
                      width: "14.28%",
                      height: 30,
                      textAlign: "center",
                      lineHeight: "30px",
                      margin: "2px 0",
                      backgroundColor: isSelected
                        ? "#0d6efd"
                        : isInRange
                        ? "rgba(13,110,253,0.3)"
                        : "transparent",
                      color: isSelected ? "#fff" : "#000000",
                      cursor: "pointer",
                      borderTopLeftRadius:
                        start_date &&
                        date.toDateString() === start_date.toDateString()
                          ? 12
                          : 0,
                      borderBottomLeftRadius:
                        start_date &&
                        date.toDateString() === start_date.toDateString()
                          ? 12
                          : 0,
                      borderTopRightRadius:
                        end_date &&
                        date.toDateString() === end_date.toDateString()
                          ? 12
                          : 0,
                      borderBottomRightRadius:
                        end_date &&
                        date.toDateString() === end_date.toDateString()
                          ? 12
                          : 0,
                    }}
                    onClick={() => this.handleDateClick(date)}
                    onMouseEnter={() => this.setState({ hoverDate: date })}
                    onMouseLeave={() => this.setState({ hoverDate: null })}
                  >
                    {date.getDate()}
                  </div>
                );
              })}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingLeft: "0.3rem",
                paddingRight: "0.3rem",
                marginTop: "0.5rem",
              }}
            >
              {this.props.clearable !== false ? (
                <label
                  style={{ cursor: "pointer", color: "#0d6efd" }}
                  onClick={() => {
                    this.setState({ start_date: null, end_date: null });
                    this.props.onChange?.({ start_date: null, end_date: null });
                  }}
                >
                  clear
                </label>
              ) : (
                <label></label>
              )}
              <label
                style={{ cursor: "pointer", color: "#0d6efd" }}
                onClick={() => {
                  this.setState({ start_date: new Date(), end_date: null });
                  this.props.onChange?.({
                    start_date: new Date(),
                    end_date: null,
                  });
                }}
              >
                To day
              </label>
            </div>
          </div>
        )}
      </div>
    );
  }
}
class Select extends Component {
  state = {
    showSelectOption: false,
    search: "",
    selected: "",
  };
  componentDidMount = () => {};
  componentWillReceiveProps = (props) => {};
  render() {
    return (
      <div
        style={{ position: "relative", padding: 0 }}
        className={this.props.className}
      >
        {this.state.showSelectOption && (
          <div
            style={{
              bottom: 0,
              left: 0,
              top: 0,
              right: 0,
              backgroundColor: "#0000",
              zIndex: 1000,
              position: "fixed",
            }}
            onClick={() => {
              this.setState({ showSelectOption: false });
            }}
          ></div>
        )}
        <div style={{ position: "relative" }}>
          {!this.state.search &&
          !this.state.showSelectOption &&
          this.props.options?.find((e) => e.value === this.props.value)
            ?.front ? (
            <div className="position-absolute mx-2 mt-1">
              {
                this.props.options?.find((e) => e.value === this.props.value)
                  ?.front
              }
            </div>
          ) : null}
          <input
            className={this.props.className
              ?.replaceAll("mb-2", "")
              .replaceAll("mb-3", "")
              .replaceAll("mb-4", "")
              .replaceAll("mb-5", "")}
            style={{
              width: "100%",
              backgroundColor: this.props.disabled ? "#e9ecef" : "#00000000",
              border: 0,
              paddingLeft:
                !this.state.search &&
                !this.state.showSelectOption &&
                this.props.options?.find((e) => e.value === this.props.value)
                  ?.front
                  ? 36
                  : ".75rem",
            }}
            type="text"
            value={
              !this.state.search &&
              !this.state.showSelectOption &&
              this.props.value
                ? this.props.options?.find((e) => e.value === this.props.value)
                    ?.label
                : this.state.search
            }
            placeholder={this.props.placeholder || ""}
            onFocus={() => {
              this.setState({
                showSelectOption: true,
                search: "",
                selected: "",
              });
            }}
            onChange={(e) => {
              this.setState({ search: e.target.value });
            }}
            disabled={this.props.disabled}
          />
          <div
            style={{
              display: "flex",
              position: "absolute",
              right: 8,
              top: "50%",
            }}
          >
            <div
              style={{
                width: 7,
                height: 1.7,
                backgroundColor: "#232323",
                transform: "rotate(45deg)",
                borderRadius: 1,
              }}
            ></div>
            <div
              style={{
                width: 7,
                height: 1.7,
                backgroundColor: "#232323",
                transform: "rotate(315deg)",
                marginLeft: -3.2,
                borderRadius: 1,
              }}
            ></div>
          </div>
        </div>
        {this.state.showSelectOption && (
          <div
            id="select-tool"
            style={{
              minWidth: 150,
              width: "100%",
              padding: 6,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: "#d2d2d2",
              borderStyle: "solid",
              backgroundColor: "#fdfdfd",
              position: "absolute",
              top: 40,
              zIndex: 1001,
            }}
          >
            <div
              style={{
                maxHeight: 400,
                overflow: "scroll",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {this.props.options?.filter(
                (e) => !this.state.search || e.label.includes(this.state.search)
              ).length !== 0 &&
                this.props.default !== false && (
                  <div
                    style={{
                      width: "100%",
                      cursor: "pointer",
                      padding: 4,
                      backgroundColor:
                        this.state.selected === "" ? "#dfdfdf" : "#fff0",
                      color: "#000000",
                    }}
                    onClick={() => {
                      this.setState({
                        showSelectOption: false,
                        search: "",
                        selected: "",
                      });
                      this.props.onChange("", { value: "", label: "" });
                    }}
                    onMouseEnter={() => this.setState({ selected: "" })}
                  >
                    -- กรุณาเลือก --
                  </div>
                )}
              {this.props.options
                ?.filter(
                  (e) =>
                    !this.state.search || e.label.includes(this.state.search)
                )
                .map((item, index) => (
                  <div
                    key={`array-${index}`}
                    style={{
                      display: "flex",
                      width: "100%",
                      cursor: "pointer",
                      padding: 4,
                      backgroundColor:
                        this.state.selected === item.value
                          ? "#dfdfdf"
                          : "#fff0",
                      color: "#000000",
                    }}
                    onClick={() => {
                      this.setState({
                        showSelectOption: false,
                        search: "",
                        selected: "",
                      });
                      this.props.onChange(item.value, item);
                    }}
                    onMouseEnter={() => this.setState({ selected: item.value })}
                  >
                    {item.front || ""}
                    {item.label}
                  </div>
                ))}
              <div style={{ maxHeight: 300, overflow: "scroll" }}>
                {this.props.options?.filter(
                  (e) =>
                    !this.state.search || e.label.includes(this.state.search)
                ).length === 0 && (
                  <div
                    style={{
                      width: "100%",
                      textAlign: "center",
                      color: "#2c2c2c",
                    }}
                  >
                    ไม่พบข้อมูล...
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
class BtnIcon extends Component {
  render() {
    return (
      <div>
        {this.props.type === "print" && (
          <div
            className={`status bg-primary-light wpx-25 hpx-25 icon px-1 pointer text-primary ${this.props.className}`}
            title={this.props.title || "Print"}
            onClick={() => {
              this.props.onClick();
            }}
          >
            {"\uf02f"}
          </div>
        )}
        {this.props.type === "view" && (
          <div
            className={`status bg-success-light wpx-25 hpx-25 icon px-1 pointer text-success ${this.props.className}`}
            title={this.props.title || "View"}
            onClick={() => {
              this.props.onClick();
            }}
          >
            {"\uf06e"}
          </div>
        )}
        {this.props.type === "download" && (
          <div
            className={`status bg-info-light wpx-25 hpx-25 icon px-1 pointer text-info ${this.props.className}`}
            title={this.props.title || "Download"}
            onClick={() => {
              this.props.onClick();
            }}
          >
            {"\uf019"}
          </div>
        )}
        {this.props.type === "email" && (
          <div
            className={`status bg-secondary-light wpx-25 hpx-25 icon px-1 pointer text-secondary ${this.props.className}`}
            title={this.props.title || "Send Email"}
            onClick={() => {
              this.props.onClick();
            }}
          >
            {"\uf0e0"}
          </div>
        )}
        {this.props.type === "update" && (
          <div
            className={`status bg-warning-light wpx-25 hpx-25 icon px-1 pointer text-orange ${this.props.className}`}
            title={this.props.title || "Update"}
            onClick={() => {
              this.props.onClick();
            }}
          >
            {"\uf044"}
          </div>
        )}
        {this.props.type === "approve" && (
          <div
            className={`status bg-purple-light wpx-25 hpx-25 icon px-1 pointer text-purple ${this.props.className}`}
            title={this.props.title || "Change Status"}
            onClick={() => {
              this.props.onClick();
            }}
          >
            {"\uf52d"}
          </div>
        )}
        {this.props.type === "delete" && (
          <div
            className={`status bg-danger-light wpx-25 hpx-25 icon px-1 pointer text-danger ${this.props.className}`}
            title={this.props.title || "Delete"}
            onClick={() => {
              this.props.onClick();
            }}
          >
            {"\uf1f8"}
          </div>
        )}
        {this.props.type === "inquiry" && (
          <div
            className={`status bg-info-light wpx-25 hpx-25 icon px-1 pointer text-info ${this.props.className}`}
            title={this.props.title || "Inquiry"}
            onClick={() => {
              this.props.onClick();
            }}
          >
            {"\uf688"}
          </div>
        )}
        {this.props.type === "callback" && (
          <div
            className={`status bg-secondary-light wpx-25 hpx-25 icon px-1 pointer text-dark ${this.props.className}`}
            title={this.props.title || "Callback"}
            onClick={() => {
              this.props.onClick();
            }}
          >
            {"\u0043"}
          </div>
        )}
      </div>
    );
  }
}
export {
  profile,
  tokens,
  required,
  copyText,
  alert,
  total,
  float,
  toFixed,
  format_date,
  random_charactor,
  GET,
  POST,
  PUT,
  DELETE,
  loading,
  Status,
  params,
  DatePicker,
  DateRangePicker,
  Select,
  BtnIcon,
};
export { default as Swal } from "sweetalert2";
export { default as Pagination } from "@mui/material/Pagination";
export { default as Switch } from "react-switch";
export { default as Navbar } from "../components/Navbar.js";
export { Modal } from "react-bootstrap";
export { default as Resizer } from "react-image-file-resizer";
export { saveAs } from "file-saver";
export * as XLSX from "xlsx";
