import { model, Types, Schema } from "mongoose";
import uuid from 'uuid';

const typesSchema = Schema({
    idTheLoai:{type: String , default: uuid , required: true},
    tenTheLoai:{type: String, required: true},
    viTri: {type: Number , required: true}
});

const Types = model('Types',typesSchema);
module.exports = Types;