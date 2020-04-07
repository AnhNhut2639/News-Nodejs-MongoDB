import { model, Types, Schema } from "mongoose";
import uuid from "uuid";

const themesSchema = Schema(
  {
    idChuDe: { type: String, default: uuid, required: true },
    tenChuDe: { type: String, required: true },
    img: { type: String },
    idTheLoai: { type: String, required: true },
    idNguoiTao: { type: String, required: true },
    tenNguoiTao: { type: String, required: true },
    ngayTao: { type: Date, default: Date.now, required: true },
    idNguoiCapNhat: { type: String },
    tenNguoiCapNhat: { type: String },
    ngayCapNhat: { type: Date }
  },
  { versionKey: false }
);
const Themes = model("Themes", themesSchema);

module.exports = Themes;
