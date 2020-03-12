import { model, Schema } from "mongoose";
import uuid from "uuid";

const typesSchema = Schema(
  {
    idTheLoai: { type: String, default: uuid, required: true },
    tenTheLoai: { type: String, required: true },
    idNguoiTao: { type: String, required: true },
    tenNguoiTao: { type: String, required: true },
    ngayTao: { type: Date, default: Date.now, required: true },
    idNguoiCapNhat: { type: String },
    tenNguoiCapNhat: { type: String },
    ngayCapNhat: { type: Date }
  },
  { versionKey: false }
);

const Types = model("Types", typesSchema);
module.exports = Types;
