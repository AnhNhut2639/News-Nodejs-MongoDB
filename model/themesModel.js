import { model, Types, Schema } from "mongoose";
import uuid from "uuid";

const themesSchema = Schema(
  {
    idChuDe: { type: String, default: uuid, required: true },
    tenChuDe: { type: String, required: true },
    viTri: { type: Number },
    idTheLoai: { type: String, required: true }
  },
  { versionKey: false }
);
const Themes = model("Themes", themesSchema);

module.exports = Themes;
