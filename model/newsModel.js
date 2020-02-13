import { model, Types, Schema } from "mongoose";
import uuid from "uuid";

const newsSchema = Schema(
  {
    id: { type: String, default: uuid, required: true },
    tieuDe: { type: String, required: true },
    trichYeu: { type: String, required: true },
    tacGia: { type: String, required: true },
    nguon: { type: String, required: true },
    noiDung: { type: String, required: true },
    daDuyet: { type: Boolean, default: false, required: true },
    idNguoiDuyet: { type: String },
    ngayDuyet: { type: String },
    idNguoiDang: { type: String, required: true },
    ngayDang: { type: String, required: true },
    // idNguoiCapNhat: { type: String },
    // ngayCapNhat: { type: String },
    luotXem: { type: Number, default: 0 },
    danhGia: { type: Number },
    binhLuan: { type: String },
    hashtag: { type: String },
    idChuDe: { type: String, required: true },
    loaiTin: { type: String, required: true }
  },
  { versionKey: false }
);

const News = model("News", newsSchema);

module.exports = News;
