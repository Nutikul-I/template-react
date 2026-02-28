import { fontSize, lineHeight, margin, width } from "@mui/system";
import { alert, format_date, toFixed, total, GET } from "./CustomComponent.js";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import ThaiBahtText from "thai-baht-text";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  FCIconic: {
    normal: "FCIconic-Light.ttf",
    bold: "FCIconic-Bold.ttf",
    italics: "FCIconic-Italic.ttf",
    bolditalics: "FCIconic-Italic.ttf",
  },
  THSarabunNew: {
    normal: "THSarabunNew.ttf",
    bold: "THSarabunNew-Bold.ttf",
    italics: "THSarabunNew-Italic.ttf",
    bolditalics: "THSarabunNew-BoldItalic.ttf",
  },
  Roboto: {
    normal: "Roboto-Regular.ttf",
    bold: "Roboto-Medium.ttf",
    italics: "Roboto-Italic.ttf",
    bolditalics: "Roboto-MediumItalic.ttf",
  },
};

function value(text = " ", width = 300, alignment = "center",fontSize = 16) {
  return {
    width: width,
    stack: [
      {
        text: text || " ",
        fontSize: fontSize,
        alignment: alignment,
        margin: [12, 0, 12, 0],
      },
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: width,
            y2: 0,
            lineWidth: 1,
            dash: { length: 2 },
          },
        ],
        margin: [0, (fontSize * -1)+10, 0, 0],
      },
    ],
  };
}
function checkbox(checked, size = 12) {
  return checked
    ? {
        canvas: [
          // กล่องดำ
          {
            type: "rect",
            x: 0,
            y: 0,
            w: size,
            h: size,
            color: "black",
          },
          // เช็คถูก
          {
            type: "polyline",
            lineWidth: 2,
            lineColor: "white",
            points: [
              { x: size * 0.2, y: size * 0.55 },
              { x: size * 0.45, y: size * 0.75 },
              { x: size * 0.8, y: size * 0.25 },
            ],
          },
        ],
        width: size + 10,
        height: size,
        margin: [3, 4, 2, 4],
      }
    : {
        canvas: [
          {
            type: "rect",
            x: 0,
            y: 0,
            w: size,
            h: size,
            lineWidth: 1,
          },
        ],
        width: size + 10,
        height: size,
        margin: [3, 4, 2, 4],
      };
}
async function print(docDefinition) {
  pdfMake.createPdf(docDefinition).print();
}
async function open(docDefinition) {
  try {
    pdfMake.createPdf(docDefinition).open();
  } catch (error) {
    pdfMake.createPdf(docDefinition).download("ทดสอบ");
    if (error === "Open PDF in new window blocked by browser") {
      alert(
        "warning",
        "แจ้งเตือน",
        "ไม่สามารถเปิดเอกสารได้เนื่องจากการปิดกั้นจากบราวเซอร์"
      );
    } else {
      alert("warning", "แจ้งเตือน", "กรุณาลองใหม่อีกครั้ง");
    }
  }
}

// Invoice
async function report_invoice(data) {
  let result = await Promise.all(data.items.map((item) =>
    GET("v1/admin/invoices", { uid: item.uid }),
  ))
  const _null = [
    { text: " ", border: [1,0,1,0] },
    { text: " ", border: [1,0,1,0] },
    { text: " ", border: [1,0,1,0] },
    { text: " ", border: [1,0,1,0] },
    { text: " ", border: [1,0,1,0] },
    { text: " ", border: [1,0,1,0] }
  ]
  function header(item,th,en) {
    return [
      { text: "บริษัท เซนนิตลิงค์ จํากัด", fontSize: 12, alignment: "right",
        lineHeight: 0.8 },
      {
        text: "981/154 หมู่ที่ 9 ต.บางแก้ว อ.บางพลี จ.สมุทรปราการ",
        fontSize: 12,
        alignment: "right",
        lineHeight: 0.8
      },
      {
        text: "เลขที่ผู้เสียภาษี 0-1155-68018-97-8 | (สํานักงานใหญ่)",
        fontSize: 12,
        alignment: "right",
        lineHeight: 0.8
      },
      { text: ` `, fontSize: 4 },
      {
        columns: [
          { text: "", width: 286 },
          {
            table: {
              headerRows: 2,
              widths: [140, 100],
              body: [
                [
                  {
                    stack: [
                      {
                        text: "Tax Invoice/Receipt",
                        alignment: "center",
                        bold: true,
                        fontSize: 20,
                        lineHeight: 0.7,
                        color: "#ffffff",
                      },
                      {
                        text: "ใบกํากับภาษี/ใบเสร็จ",
                        alignment: "center",
                        bold: true,
                        color: "#ffffff",
                      },
                    ],
                    rowSpan: 2,
                    fillColor: "#000000",
                  },
                  {
                    text: th + " / " + en,
                    alignment: "center",
                    fontSize: 12,
                  },
                ],
                [
                  " ",
                  {
                    text: item.invoice_number || "-",
                    alignment: "center",
                    bold: true,
                    fontSize: 20,
                  },
                ],
              ],
            },
          },
        ],
      },
    ]
  }
  function body(item) {
    return JSON.stringify([
      { text: ` `, fontSize: 4 },
      {
        table: {
          headerRows: 2,
          widths: [63, "*", 50, 61, 59, 62],
        body: [
          // ===== ROW 1 =====
          [
            {
              stack: [
                { text: "ชื่อลูกค้า", lineHeight: 0.6 },
                { text: "Customer Name", fontSize: 12 },
              ],
              border: [1,1,0,0]
            },
            { text: item.broker?.company_name || item.broker?.name_th || "-",
              border: [0,1,1,0] },

            {
              stack: [
                { text: "วันที่", lineHeight: 0.6 },
                { text: "Issue Date", fontSize: 12 },
              ],
              border: [1,1,0,0]
            },
            { text: format_date(item.date,"dd/mm/yyyy"),
              border: [0,1,1,0] },

            {
              stack: [
                { text: "พนักงาน", lineHeight: 0.6 },
                { text: "Salesman", fontSize: 12 },
              ],
              border: [1,1,0,0]
            },
            { text: "-",
              border: [0,1,1,0] },
          ],
          [
            {
              stack: [
                { text: "เลขที่ผู้เสียภาษี", lineHeight: 0.6 },
                { text: "Tax ID", fontSize: 12 },
              ],
              border: [1,0,0,0]
            },
            { text: item.broker?.tax_number || "-",
              border: [0,0,1,0] },

            {
              stack: [
                { text: "ชำระโดย", lineHeight: 0.6 },
                { text: "Payment", fontSize: 12 },
              ],
              border: [1,0,0,0]
            },
            { text: "โอนเงิน",
              border: [0,0,1,0] },

            {
              stack: [
                { text: "ใบวางบิล", lineHeight: 0.6 },
                { text: "Invoice No", fontSize: 12 },
              ],
              border: [1,0,0,0]
            },
            { text: "-",
              border: [0,0,1,0] },
          ],
          [
            {
              rowSpan: 2,
              stack: [
                { text: "ที่อยู่", lineHeight: 0.6 },
                { text: "Address", fontSize: 12 },
              ],
              border: [1,0,0,1]
            },
            {
              rowSpan: 2,
              text: item.broker?.company_address || "-",
              border: [0,0,0,1]
            },
            {text:"",border:[1,0,0,0]},
            {text:"",border:[0,0,0,0]},

            {
              stack: [
                { text: "เอกสารอ้างอิง", lineHeight: 0.6 },
                { text: "Ref Document", fontSize: 12 },
              ],
              border: [1,0,0,1]
            },
            { text: "-",
              border: [0,0,1,1] },
          ],
          [
            "",
            "",
            {
                  stack: [
                    { text: "ชื่อโปรเจกต์", lineHeight: 0.6 },
                    { text: "Project Name", fontSize: 12 },
                  ],
              border: [1,1,0,1]
                },
            {
              colSpan: 3,
              text: "-",
              border: [0,1,1,1]
            },
            "",
            "",
          ],
        ],
      },
    },
    { text: ` `, fontSize: 4 },
    {
      table: {
        headerRows: 1,
        widths: [40, "*", 40, 60, 40, 78],
        body: [
          // ===== ROW 1 =====
          [
            { stack: [ { text: "เลขที่", color: "#ffffff", alignment: "center", bold: true, lineHeight: 0.6 }, { text: "No.", color: "#ffffff", alignment: "center", bold: true, fontSize: 12 }], fillColor: "#000000" },
            { stack: [ { text: "รายการ", color: "#ffffff", alignment: "center", bold: true, lineHeight: 0.6 }, { text: "Description", color: "#ffffff", alignment: "center", bold: true, fontSize: 12 }], fillColor: "#000000" },
            { stack: [ { text: "จำนวน", color: "#ffffff", alignment: "center", bold: true, lineHeight: 0.6 }, { text: "Quantity", color: "#ffffff", alignment: "center", bold: true, fontSize: 12 }], fillColor: "#000000" },
            { stack: [ { text: "ราคา/หน่วย", color: "#ffffff", alignment: "center", bold: true, lineHeight: 0.6 }, { text: "Unit Price", color: "#ffffff", alignment: "center", bold: true, fontSize: 12 }], fillColor: "#000000" },
            { stack: [ { text: "ส่วนลด", color: "#ffffff", alignment: "center", bold: true, lineHeight: 0.6 }, { text: "Discount", color: "#ffffff", alignment: "center", bold: true, fontSize: 12 }], fillColor: "#000000" },
            { stack: [ { text: "จำนวนเงิน(THB)", color: "#ffffff", alignment: "center", bold: true, lineHeight: 0.6 }, { text: "Amount", color: "#ffffff", alignment: "center", bold: true, fontSize: 12 }], fillColor: "#000000" },
          ],
          [
            { text: 1, alignment: "center", border: [1,0,1,0] },
            { stack: [ { text: `รายได้ค่าบริการรับช่องทาง ${item.gateway?.toUpperCase() || "-"} - ${item.broker?.name_en?.toUpperCase() || "-"}`, lineHeight: 0.6, border: [1,0,1,0] }, { text: `Customer transfer ${toFixed(item.customer_transfer)}`, fontSize: 12 }], border: [1,0,1,0] },
            { text: 1, alignment: "center", border: [1,0,1,0] },
            { text: toFixed(item.total_amount), alignment: "right", border: [1,0,1,0] },
            { text: "00.00", alignment: "right", border: [1,0,1,0] },
            { text: toFixed(item.total_amount), alignment: "right", border: [1,0,1,0] },
          ],
          ...["","","","","","",""].map(e=>_null),
          [
            { text: " ", border: [1,0,1,1] },
            { text: " ", border: [1,0,1,1] },
            { text: " ", border: [1,0,1,1] },
            { text: " ", border: [1,0,1,1] },
            { text: " ", border: [1,0,1,1] },
            { text: " ", border: [1,0,1,1] }
          ]
        ],
      },
    },
    { text: ` `, fontSize: 4 },
    {
      table: {
        headerRows: 1,
        widths: [70,"*", 110, 78],
        body: [
          // ===== ROW 1 =====
          [
            { stack: [ { text: "จำนวนเงิน", alignment: "center", lineHeight: 0.6 }, { text: "Amount", alignment: "center", fontSize: 12 }],
              fillColor: "#f6f5ff",
              border: [0,0,0,0],
              colSpan: 2
            },
            { text: ThaiBahtText(Number(item.total_amount)), alignment: "center",
              fillColor: "#f6f5ff",
              border: [0,0,0,0]
            },
            { stack: [ { text: "รวมเป็นเงิน", lineHeight: 0.6 }, { text: "Subtotal", fontSize: 12 }], border: [0,0,0,0] },
            { text: toFixed(item.sub_total), alignment: "right", fillColor: "#f6f5ff", bold: true },
          ],
          // ===== ROW 2 =====
          [
            { text: "การชําระเงิน (Conditions of Payments)", fontSize: 18, bold: true, border: [0,0,0,0], lineHeight: 0.8, colSpan: 2},
            "",
            { stack: [ { text: "หักส่วนลดพิเศษ", lineHeight: 0.6 }, { text: "Special Discount", fontSize: 12 }], border: [0,0,0,0] },
            { text: toFixed(item.special_discount), alignment: "right", fillColor: "#f6f5ff", bold: true },
          ],
          // ===== ROW 3 =====
          [
            { 
              columns: [
                checkbox(false),
                { stack: [ { text: "เงินสด", lineHeight: 0.6 }, { text: "Cash", fontSize: 12 }], width: 40 },
                checkbox(true),
                { stack: [ { text: "โอนเงิน", lineHeight: 0.6 }, { text: "Bank Transfer", fontSize: 12 }], width: 60 },
                checkbox(false),
                { stack: [ { text: "เช็คธนาคาร", lineHeight: 0.6 }, { text: "Cheque Bank", fontSize: 12 }], width: 60 },
                checkbox(false),
                { stack: [ { text: "อื่นๆ", lineHeight: 0.6 }, { text: "Other", fontSize: 12 }], width: 40 },
              ],
              border: [0,0,0,0],
              colSpan: 2
            },
            "",
            { stack: [ { text: "ยอดรวมหลังหักส่วนลด", lineHeight: 0.6 }, { text: "After Discount", fontSize: 12 }], border: [0,0,0,0] },
            { text: toFixed(item.after_discount), alignment: "right", fillColor: "#f6f5ff", bold: true },
          ],
           // ===== ROW 4 =====
          [
            { stack: [ { text: "รายละเอียด", lineHeight: 0.6, bold: true }, { text: "Payment Detail", fontSize: 12, bold: true }],
              border: [0,0,0,0] },
            { text: `โอนเข้า ธนาคารไทยพาณิชย์ SCB (บริษัท เซนนิตลิงค์ จํากัด) วันที่ ${format_date(item.date,"dd/mm/yyyy")} จํานวน ${toFixed(item.total_amount)} บาท`, fontSize: 14, lineHeight: 0.8, border: [0,0,0,0], rowSpan: 2 },
            { stack: [ { text: "จํานวนภาษีมูลค่าเพิม 7%", lineHeight: 0.6 }, { text: "Value Added Tax", fontSize: 12 }], border: [0,0,0,0] },
            { text: toFixed(item.value_added_tax), alignment: "right", fillColor: "#f6f5ff", bold: true },
          ],
           // ===== ROW 5 =====
          [
            {text:"", border: [0,0,0,0]},
            "",
            { stack: [ { text: "จํานวนเงินรวมทังสิน", lineHeight: 0.6 }, { text: "Total", fontSize: 12 }], border: [0,0,0,0] },
            { text: toFixed(item.total_amount), alignment: "right", fillColor: "#000000", color: "#ffffff", bold: true },
          ],
        ],
      },
    },
    { text: ` `, fontSize: 4 },
    {
      table: {
        headerRows: 1,
        widths: ["*", "*", "*"],
        body: [
          // ===== ROW 1 =====
          [
            { 
              stack: [ 
                {text: " ", fontSize: 30},
                value("",150),
                {text: " ", fontSize: 4},
                { text: "ผู้รับเงิน / Bill Receiver Signature", alignment: "center", fontSize: 14, bold: true }, 
                {text: " ", fontSize: 4},
                {columns: [
                  { text: "วันที่ / Date", alignment: "center", fontSize: 14, bold: true, width: "auto" },
                  value("",120),
                ]},
                {text: " ", fontSize: 4},
              ],
              alignment: "center"
            },
            {stack:[
              {text: " ", fontSize: 25},
              { text: "ตราประทับบริษัท", alignment: "center", fontSize: 26, bold: true, color:"#dfdfdf"},
            ]},
            { 
              stack: [ 
                {text: " ", fontSize: 30},
                value("",150),
                {text: " ", fontSize: 4},
                { text: "ผู้มีอํานาจลงนาม / Authorized Signature", alignment: "center", fontSize: 14, bold: true }, 
                {text: " ", fontSize: 4},
                {columns: [
                  { text: "วันที่ / Date", alignment: "center", fontSize: 14, bold: true, width: "auto" },
                  value("",120),
                ]},
                {text: " ", fontSize: 4},
              ],
              alignment: "center"
            },
          ],
          [{
            text:"981/154 หมู่ที่ 9 ต.บางแก้ว อ.บางพลี จ.สมุทรปราการ",color:"#ffffff",fillColor:"#000000",alignment:"center", fontSize:14,colSpan:3
          },"",""]
        ],
      },
    },
  ])};
  var docDefinition = {
    pageSize: "A4",
    content: result.map((item) => [
      ...header(item.data, "ต้นฉบับ","Original"),
      ...JSON.parse(body(item.data)),
      { text: "", pageBreak: "after" },
      ...header(item.data, "สำเนา","Copy"),
      ...JSON.parse(body(item.data)),
    ]),
    defaultStyle: { font: "THSarabunNew", fontSize: 16, lineHeight: 0.9 },
    pageMargins: [25, 25, 25, 25],
  };

  print(docDefinition, "ใบเสนอราคา.pdf");
}


export { report_invoice };
