import { model, Types, Schema } from "mongoose";
import uuid from 'uuid';

const newsSchema = Schema({
    id:{type: String , default: uuid , required: true},
    tieuDe:{type: String , required: true},
    trichYeu:{type: String , required: true},
    tacGia:{type: String , required: true},
    nguon:{type: String , required: true},
    noiDung:{type: String , required: true},
    daDuyet:{type: Boolean , required: true},
    idNguoiDuyet:{type: String , required: true},
    ngayDuyet:{type: String , required: true},
    idNguoiDang:{type: String , required: true},
    ngayDang:{type: String , required: true},
    idNguoiCapNhat:{type: String , required: true},
    ngayCapNhat:{type: String, required: true},
    luotXem:{type: Number},
    dangGia:{type: Number},
    binhLuan:{type: String},
    hashtag:{type: String},
    idChuDe:{type: String, required: true},
    loaiTin:{type: String , required: true},
});

const News = model('News',newsSchema);

module.exports = News;