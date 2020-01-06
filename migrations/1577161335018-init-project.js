import mongoose from 'mongoose';
//const mongoose = require('mongoose');
import { MALE } from "../enums/userGender";
import Users from '../model/usersModel';


const systemUser = {
  username: 'admin',
  password: '123456',
  sdt: '01653948141',
  email: 'lanhut3926@gmail.com',
  tenDayDu: 'Le Anh Nhut',
  ngaySinh:'26/12/1998',
  gioiTinh: MALE

};

const insertSystemUser = () => new Users(systemUser).save();

const { MONGO_URL, MONGO_DB, MONGO_OPTIONS } = process.env;
// const { MONGODB_URI, MONGO_DB, MONGO_OPTIONS } = process.env;

const mongoUrl = MONGO_URL || 'mongodb://localhost:27017';
const dbName = MONGO_DB || 'ITNews';
const option = MONGO_OPTIONS
  ? JSON.parse(MONGO_URL)
  : {
      useNewUrlParser: true
    };

const connectDb = () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(mongoUrl + '/' + dbName, option, err => {
      if (err) {
        reject(err);
      }
      resolve(mongoose);
    });
  });
};

module.exports.up = async function() {
  const db = await connectDb();
  await insertSystemUser();
  await db.disconnect();
};

module.exports.down = async function() {
  const db = await connectDb();

  await Promise.all([
    Users.deleteOne({ username: systemUser.username }),
  ]);

  await db.disconnect();
};