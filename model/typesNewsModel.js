import { model, Schema } from "mongoose";
import uuid from "uuid";

const typesSchema = Schema(
  {
    idTheLoai: { type: String, default: uuid, required: true },
    tenTheLoai: { type: String, required: true },
    viTri: { type: Number }
  },
  { versionKey: false }
);

const Types = model("Types", typesSchema);
module.exports = Types;
