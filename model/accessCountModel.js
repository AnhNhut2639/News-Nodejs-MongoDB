import { model, Types, Schema } from "mongoose";
import uuid from "uuid";

const accessCountSchema = Schema(
  {
    id: { type: String, default: uuid, required: true },
    luotTruyCap: { type: Number, default: 0 }
  },
  { versionKey: false }
);

const AccessCount = model("AccessCount", accessCountSchema);
module.exports = AccessCount;
