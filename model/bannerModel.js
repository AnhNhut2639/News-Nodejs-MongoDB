import { model, Types, Schema } from "mongoose";
import uuid from "uuid";

const bannersSChema = Schema(
  {
    idBanner: { type: String, default: uuid, required: true },
    motaBanner: { type: String, required: true },
    urlHinhAnh: { type: String, required: true },
    idNguoiDang: { type: String, required: true },
    tenNguoiDang: { type: String, required: true },
    ngayDang: { type: Date, default: Date.now, required: true }
  },
  { versionKey: false }
);

const Banner = model("Banner", bannersSChema);
module.exports = Banner;
