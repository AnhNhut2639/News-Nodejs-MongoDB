import { model, Types, Schema } from "mongoose";
import uuid from 'uuid';

const themesSchema = Schema({
    idChuDe:{type: String , default: uuid , required: true},
    tenChuDe: {type: String, required: true},
    viTri:{type: Number, required: true},
    idTheLoai:{type: String}
});
const Themes = model('Themes',themesSchema);

module.exports = Themes;