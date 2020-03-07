var newsModel = require("../model/newsModel");
var moment = require("moment");

function getFirstImage(data) {
  let regex = /<img.*?src="(.*?)"/;
  data.forEach(item => (item.firstImage = regex.exec(item.noiDung)[1]));
  return data;
}
async function home(req, res) {
  const news = await newsModel.find({ daDuyet: true, deny: false });
  var arr = getFirstImage(news);
  const data = arr.map(news => {
    return {
      title: news.tieuDe,
      abstract: news.trichYeu,
      date: moment(news.ngayDuyet).format("DD[-]MM[-]YYYY"),
      time: moment(news.ngayDuyet).format("h:mm a"),
      id: news.id,
      img: news.firstImage,
      viewsCount: news.luotXem
    };
  });

  return res.render("home", {
    data: data
  });
}

function post(req, res) {
  return res.render("post", {});
}
function logout(req, res) {
  res.clearCookie("ID");
  res.redirect("/");
}
async function getNews(req, res) {
  const news = await news.find({});
  console.log(news);
}

module.exports = {
  home,
  post,
  logout,
  getNews
};
