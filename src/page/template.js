import React, { Component } from "react";
import { profile, branch, alert, total, float, toFixed, format_date, random_charactor, GET, POST, PUT, DELETE, loading, Status, params, required, DatePicker, Select, BtnIcon, Swal, Pagination, Switch, Navbar, Modal, Resizer } from "../components/CustomComponent.js";
export default class Template extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal_create: false,
      modal_update: false,
      modal_view: false,

      search: "",

      data: [
        { id: 1, name: "ชื่อ", price: 100, status: "สำเร็จ" },
        { id: 1, name: "ชื่อ", price: 100, status: "ไม่สำเร็จ" },
        { id: 1, name: "ชื่อ", price: 100, status: "สำเร็จ" },
        { id: 1, name: "ชื่อ", price: 100, status: "ไม่สำเร็จ" },
        { id: 1, name: "ชื่อ", price: 100, status: "สำเร็จ" },
        { id: 1, name: "ชื่อ", price: 100, status: "ไม่สำเร็จ" },
      ],
      count: 0,

      text: "",
      photo: "",
    };
  }

  async componentDidMount() {
    loading(false);
    // await this.Get(1);
  }
  Get = async (page) => {
    loading(true);
    let body = {};
    let result = await GET("transaction", body);
    if (result?.status) {
      this.setState({ data: result.data, count: result.count });
    }
    loading(false);
  };
  CreateUpdate = async () => {
    loading(true);
    let body = {};
    let result = !this.sate.id ? await POST("transaction", body) : await PUT("transaction", body);
    if (result?.status) {
      alert("#", "success");
    }
    loading(false);
  };
  Delete = async (id) => {
    if (await alert("", "warning", "ลบข้อมูล", "ยืนยันการลบรายการนี้หรือไม่ ?", "ลบข้อมูล", "ยกเลิก")) {
      loading(true);
      let result = await DELETE("transaction/" + id, null);
      if (result?.status) {
        alert("#", "success");
      }
      loading(false);
    }
  };
  render() {
    const { search, data, count, text, photo, createdAt, modal_create, modal_update, modal_view } = this.state;
    return (
      <div className="w-100 min-vh-100">
        <Navbar />
        <div className="body p-3 mt-3">
          <h3 className="mb-3">ตัวอย่าง</h3>
          <div className="d-flex flex-wrap">
            <input
              type="text"
              className="form-control wpx-250 me-2 mb-2"
              placeholder="Search..."
              onChange={(e) => {
                this.setState({ search: e.target.value });
              }}
              value={search}
            />
            <div className="d-flex">
              <button
                className="btn btn-success px-4 me-2 mb-2"
                onClick={() => {
                  this.Get(1);
                }}
              >
                Search
              </button>
              <button
                className="btn btn-outline-success px-4 me-2 mb-2"
                onClick={() => {
                  window.location.reload();
                }}
              >
                ล้างค่า
              </button>
            </div>
            <button
              className="btn btn-success px-3 ms-auto mb-2"
              onClick={async () => {
                this.setState({ modal_create: true });
              }}
            >
              + เพิ่มข้อมูล
            </button>
          </div>
          <div className="table-responsive">
            <table className="table table-hover table-striped-columns">
              <thead>
                <tr>
                  <td>ลำดับ</td>
                  <td>ชื่อ</td>
                  <td>ราคา</td>
                  <td>สถานะ</td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {data?.map((item, index) => (
                  <tr key={`array-${index}`}>
                    <td>{item.index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td className="align-middle">{Status(item.status, "primary")}</td>
                    <td>
                      <div className="d-flex">
                        <BtnIcon
                          type="view"
                          onClick={() => {
                            this.setState({
                              ...item,
                              modal_view: true,
                            });
                          }}
                        />
                        <BtnIcon
                          type="update"
                          onClick={() => {
                            this.setState({
                              ...item,
                              modal_update: true,
                            });
                          }}
                        />
                        <BtnIcon
                          type="delete"
                          onClick={() => {
                            this.Delete(item?.position_id);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="w-100 d-flex align-items-center justify-content-end flex-wrap mt-2">
            <span className="mb-3">รายการทั้งหมด {count || 0} รายการ</span>
            <Pagination className="mb-3" count={Math.ceil(count / 10) || 1} showFirstButton showLastButton onChange={(_, page) => this.Get(page)} />
          </div>
        </div>
        {/* CREATE UPDATE */}
        <Modal show={modal_create || modal_update} onHide={() => this.setState({ modal_create: false, modal_update: false })}>
          <Modal.Header closeButton>
            <h5 className="mb-0">{modal_create ? "เพิ่มข้อมูล" : modal_update ? "แก้ไขข้อมูล" : ""}</h5>
          </Modal.Header>
          <Modal.Body className="pb-0">
            <div className="d-flex mb-2">
              <div className="wpx-120 mt-2">ข้อความ</div>
              <input
                type="text"
                className="form-control"
                placeholder="กรอกข้อมูล..."
                onChange={(e) => {
                  this.setState({ text: e.target.value });
                }}
                value={text}
              />
            </div>
            <div className="d-flex mb-2">
              <div className="wpx-120 mt-2">ข้อความยาว</div>
              <textarea
                className="form-control"
                placeholder="กรอกข้อมูล..."
                rows={5}
                onChange={(e) => {
                  this.setState({ text: e.target.value });
                }}
                value={text}
              />
            </div>
            <div className="d-flex mb-2">
              <div className="wpx-120 mt-2">ตัวเลือก</div>
              <Select
                className="form-control"
                options={[
                  { value: "1", label: "ตัวเลือก 1" },
                  { value: "2", label: "ตัวเลือก 2" },
                ]}
                onChange={(e) => {
                  this.setState({ text: e });
                }}
                value={text}
              ></Select>
            </div>
            <div className="d-flex mb-2">
              <div className="wpx-120 mt-2">วันที่</div>
              <DatePicker
                className="form-control"
                onChange={(e) => {
                  this.setState({ text: e });
                }}
                value={text}
              />
            </div>
            <div className="d-flex mb-2">
              <div className="wpx-120 mt-2">สวิซต์</div>
              <Switch
                onChange={(e) => {
                  this.setState({ text: e });
                }}
                checked={text}
              />
            </div>
            <div className="d-flex mb-2">
              <div className="wpx-120 mt-2">รูปภาพ</div>
              <div className="d-flex flex-wrap">
                <input
                  hidden
                  accept="image/*"
                  id="image"
                  type="file"
                  onChange={async (e) => {
                    if (e.target.files[0]) {
                      let image = await new Promise((resolve) => {
                        Resizer.imageFileResizer(
                          e.target.files[0],
                          1200,
                          1200,
                          "JPEG",
                          100,
                          0,
                          (uri) => {
                            resolve(uri);
                          },
                          "base64"
                        );
                      });
                      this.setState({ photo: image });
                      e.target.value = "";
                    }
                  }}
                />
                {photo ? (
                  <div className="wpx-100 hpx-100 rounded-3 border p-1 position-relative">
                    <img alt="example" src={photo} className="rounded-3" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <span
                      className="wpx-20 hpx-20 rounded-circle bg-danger pointer text-white text-16 position-absolute icon d-flex align-items-center justify-content-center shadow"
                      style={{ right: -8, top: -8 }}
                      onClick={() => {
                        this.setState({ photo: "" });
                      }}
                    >
                      {"\uf00d"}
                    </span>
                  </div>
                ) : (
                  <div className="d-flex">
                    <div
                      className="wpx-100 hpx-100 d-flex align-items-center justify-content-center icon text-32 text-success bg-success-light rounded-3 pointer"
                      onClick={() => {
                        document.getElementById("image").click();
                      }}
                    >
                      {"\uf03e"}
                    </div>
                    <small className="text-secondary ps-3">
                      <b>ขนาดไฟล์ที่แนะนำ:</b> ไม่เกิน 1200x1200 พิกเซล เพื่อให้ได้คุณภาพที่ดีที่สุด <br />
                      <b>รูปแบบไฟล์ที่รองรับ:</b> PNG, JPG, JPEG, GIF <br />
                      <b>ขนาดไฟล์สูงสุด:</b> 5MB
                    </small>
                  </div>
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="py-1 d-flex justify-content-end">
            <button
              className="btn btn-success px-5 me-1"
              onClick={() => {
                this.CreateUpdate();
              }}
            >
              บันทึก
            </button>
            <button
              className="btn btn-secondary px-5 ms-1"
              onClick={() => {
                this.setState({ modal_create: false, modal_update: false });
              }}
            >
              ยกเลิก
            </button>
          </Modal.Footer>
        </Modal>
        {/* VIEW */}
        <Modal show={modal_view} onHide={() => this.setState({ modal_view: false })}>
          <Modal.Header closeButton>
            <h4 className="mb-0">รายละเอียด</h4>
          </Modal.Header>
          <Modal.Body className="pb-0">
            <div className="d-flex mb-2 justify-content-between flex-wrap">
              <label>Time</label>
              <label>{createdAt ? format_date(createdAt, "yyyy-mm-dd hh:mm:ss", "en") : ""}</label>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
