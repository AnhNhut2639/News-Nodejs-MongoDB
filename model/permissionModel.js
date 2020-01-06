import { model, Types, Schema } from "mongoose";
import uuid from 'uuid';

const permissionSchema = Schema({
    idPQ: {
        type: String,
        default: uuid,
        required: true
        },
    tenQuyen:{
        type: String,
        required: true
    },
    quyenThem:{
        type: Boolean,
        default: false,
        required: true
    },
    quyenSua:{
        type: Boolean,
        default: false,
        required: true
    },
    quyenXoa:{
        type: Boolean,
        default: false,
        required: true
    },
    quyenXem:{
        type: Boolean,
        default: true,
    },
});

const Permission = model('Permission',permissionSchema);
module.exports = Permission;