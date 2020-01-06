import { model, Types, Schema } from "mongoose";
import uuid from 'uuid';

const advertiseSchema = Schema({
    idQC:{type:String , default: uuid , required: true},
    motaQC:{type: String , required: true},
    urlHinhQC:{type: String , required: true},
    luotXem: Number,
    ngayDang:{type: String , required: true},
    idNguoiDang:{type: String , required: true},
});

const Advertise = model('Advertise',advertiseSchema);
module.exports = Advertise;