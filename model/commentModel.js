import { model, Schema } from "mongoose";
import uuid from "uuid";

const commentsSchema = Schema(
  {
    id: { type: String, default: uuid, required: true },
    idBanTin: { type: String, required: true },
    hoTen: { type: String, required: true },
    sdt: { type: String, required: true },
    email: { type: String, required: true },
    binhLuan: { type: String, required: true },
    ngayBinhLuan: { type: Date, default: Date.now, required: true }
  },
  { versionKey: false }
);

const Comments = model("Comments", commentsSchema);

module.exports = Comments;
