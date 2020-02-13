import { model, Types, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import uuid from "uuid";

const userSchema = Schema(
  {
    id: {
      type: String,
      default: uuid,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    sdt: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    tenDayDu: {
      type: String,
      required: true
    },
    ngaySinh: {
      type: String,
      required: true
    },
    gioiTinh: {
      type: Number,
      required: true
    },
    ngayTao: {
      type: Date,
      default: Date.now,
      required: true
    },
    idNguoiTao: {
      type: String
    },
    idPQ: {
      type: String
    }
  },
  { versionKey: false }
);

userSchema.pre("save", function(next) {
  var user = this;
  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        user.updated_at = Date.now();
        return next();
      });
    });
  } else {
    if (user.username) {
      user.username = user.username.toLowerCase();
    }
    return next();
  }
});
userSchema.methods.comparePassword = function(password) {
  try {
    return bcrypt.compare(password, this.password);
  } catch (err) {
    return err;
  }
};
const Users = model("Users", userSchema);
module.exports = Users;
