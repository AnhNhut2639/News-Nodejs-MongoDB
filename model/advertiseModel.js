import { model, Types, Schema } from "mongoose";
import uuid from "uuid";

const advertiseSchema = Schema(
  {
    idQC: { type: String, default: uuid, required: true },
    motaQC: { type: String, required: true },
    urlHinhQC: { type: String, required: true },
    luotXem: { type: Number },
    link: { type: String },
    ngayDang: { type: Date, default: Date.now, required: true },
    idNguoiDang: { type: String, required: true },
    tenNguoiDang: { type: String, required: true }
  },
  { versionKey: false }
);

const Advertise = model("Advertise", advertiseSchema);
module.exports = Advertise;
