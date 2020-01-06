import { model, Types, Schema } from "mongoose";
import uuid from 'uuid';

const bannersSChema = Schema({
    idBanner:{type: String ,default: uuid, required: true},
    motaBanner:{type: String, required: true},
    urlHinhANh:{type: String, required: true},
    idNguoiDang:{type: String , required: true},
    ngayDang:{type: String , required: true}
});

const Banner = model('Banner',bannersSChema);
module.exports = Banner;
