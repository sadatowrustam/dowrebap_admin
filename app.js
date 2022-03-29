const express = require("express");
const axios = require('axios');
const bodyParser = require("body-parser");
require("dotenv").config({path:"./config/config.env"});
const path = require('path')
const host = process.env.HOST;
const hostiso = process.env.HOSTISO;

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"))
app.use('/css',express.static(path.join(__dirname,"public","style")));
// app.use('/font',express.static(path.join(__dirname,"public","style")));
app.use('/js',express.static(path.join(__dirname,"public","scripts")));
app.use('/img',express.static(path.join(__dirname,"public","pictures")));
const localHost = 'http://localhost:5001'
let lastId
let category_id
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// Get functions
app.get("/",function(req,res){
  res.render("pages/login",{host:localHost})
})
app.get("/products/active",async function(req,res){
  let data
  try{
    data = await axios.get(`${localHost}/admin/products/active`);
  }catch(error){
    console.log(error)
  }
  res.render("admin/products",{name:"active products",data:data.data,host:localHost,link:"products"});
})
app.get("/products/not-active",async function(req,res){
  let data
  try{
    data = await axios.get(`${localHost}/admin/products/non-active`);
  }catch(error){
    console.log(error)
  }
  res.render("admin/products",{name:"not active products",data:data.data,host:localHost,link:"products"})
})
app.get("/products/add",async function(req,res){
  let data
  try{
    data = await axios.get(`${localHost}/admin/categories/`);
  }catch(error){
    console.log(error)
  }
  res.render("admin/toAdd/addProducts",{name:"Haryt goşmak",categories:data.data,host:localHost,link:"products"})
})
app.get("/products/getOne/:id",async function (req, res){
  let data
  try{
    data = await axios.get(`${localHost}/admin/products/${req.params.id}`);
  }catch(error){
    console.log(error)
  }
  const categories = await axios.get(`${localHost}/admin/categories/`);
  res.render("admin/toEdit/editProducts",{name:"Edit products",data:data.data,host:localHost,categories:categories.data})
})
app.get("/seller",async function(req,res){
  let data
  try{
    data = await axios.get(`${localHost}/admin/seller`);
  }catch(error){
    console.log(error)
  }
  res.render("admin/sellers",{name:"Satyjylar",data:data.data,host:localHost,link:"seller"})
})
app.get("/seller/add",async(req,res)=>{
  res.render("admin/toAdd/addSeller",{name:"Satyjy gosh",host:localHost,link:"seller"})
})
app.get("/seller/getOne/:id",async function(req,res){
  let data
  try{
    data = await axios.get(`${localHost}/admin/seller/${req.params.id}`);
  }catch(error){
    console.log(error)
  }
  lastId=req.params.id
  res.render("admin/sellerProducts",{name:data.data.name,data:data.data.seller_product,host:localHost,link:"seller/products"})
})
app.get("/seller/products/getOne/:id",async function(req,res){
  let data
  try{
    data = await axios.get(`${localHost}/admin/products/${req.params.id}`);
  }catch(error){
    console.log(error)
  }
  const categories = await axios.get(`${localHost}/admin/categories/`);
  let redirectLink=`/seller/getOne/${lastId}`
  res.render("admin/toEdit/editSellerProducts",{name:"Satyjynyn harydyny uytgetmek",data:data.data,host:localHost,categories:categories.data,redirectLink})
})
app.get("/categories",async(req,res)=>{
  let data
  try{
    data = await axios.get(`${localHost}/admin/categories`);
  }catch(error){
    console.log(error)
  }
  res.render("admin/categories",{name:"Kategoriyalar",data:data.data,host:localHost,link:"categories"});
})
app.get("/categories/add",async(req,res)=>{
  res.render("admin/toAdd/addCategories",{name:"Kategoriya gosh",host:localHost})
})
app.get("/categories/:id",async(req,res)=>{
  let data
  try{
    data = await axios.get(`${localHost}/admin/categories/getOne/${req.params.id}`);
  }catch(error){
    console.log(error)
  }
  category_id=data.data.category_id
  res.render("admin/subcategories",{name:"Subkategoriyalar",data:data.data.category_subcategories,host:localHost,link:`subcategories/`+req.params.id});
})
app.get("/categories/edit/:id",async(req,res)=>{
  let data
  try{
    data = await axios.get(`${localHost}/admin/categories/getOne/${req.params.id}`);
  }catch(error){
    res.send(error)
  }
  res.render("admin/toEdit/editCategory",{name:"Kategoriyany uytgetmek",data:data.data,host:localHost,link:"categories"});
})
app.get("/subcategories/:id/add",async(req,res)=>{
  try{
    data = await axios.get(`${localHost}/admin/categories/getOne/${req.params.id}`);
  }catch(error){
    res.send(error)
  }
  res.render("admin/toAdd/addSubcategory",{name:"Subkategoriya gosh",host:localHost,category_id:data.data.category_id})
})
app.get("/subcategories/edit/:id",async(req,res)=>{
  try{
    data = await axios.get(`${localHost}/admin/subcategories/getOne/${req.params.id}`);
  }catch(error){
    res.send(error)
  }
  res.render("admin/toEdit/editSubcategory",{name:"Subkategoriya gosh",host:localHost,category_id:category_id,data:data.data})
})
app.get("/orders",async(req,res)=>{
  let data
  try{
    data = await axios.get(`${localHost}/admin/orders`);
  }catch(error){
    console.log(error)
  }
  res.render("admin/orders",{name:"Zakazlar",data:data.data,host:localHost,link:"orders"});
})
app.get("/orders/:id",async(req,res)=>{
  let data
  try{
    data = await axios.get(`${localHost}/admin/orders/order-products/${req.params.id}`);
  }catch(error){
    console.log(error)
  }
  res.render("admin/orderproducts",{name:"Zakaz harytlar",data:data.data,host:localHost,link:"orderproducts"});
})
app.get("/banners",async(req,res)=>{
  let data
  try{
    data =await axios.get(`${localHost}/public/banners`)
  }catch(err){
    return res.send(err)
  }
  res.render("admin/banner",{name:"Bannerler",link:"banners",data:data.data,host:localHost})
})
app.get("/banners/add",async(req,res)=>{
  res.render("admin/toAdd/addBanner",{name:"Banner gosh",link:"banners",host:localHost})
})
app.get("/banners/getOne/:id",async(req,res)=>{
  let data
  try {
    data=await axios.get(`${localHost}/admin/banners/${req.params.id}`)
  } catch (err) {
    res.send(err)
  }
  res.render("admin/bannerProducts",{name:"Banner harytlary",link:"banners/products/"+req.params.id,host:localHost,data:data.data})
})
app.get("/banners/edit/:id",async(req,res)=>{
  let data
  try {
    data=await axios.get(`${localHost}/admin/banners/${req.params.id}`)
  } catch (err) {
    res.send(err)
  }
  res.render("admin/toEdit/editBanner",{data:data.data,link:"banners",host:localHost,id:req.params.id})
})
app.get("/banners/products/:id/add",async(req,res)=>{
  res.render("admin/toAdd/addBannerProduct",{name:"Bannere haryt gosh",link:"banners/",host:localHost,id:req.params.id})
})
// search
app.post("/admin/:page/search",async function(req,res){
  var page = req.params.page;
  var text = req.body.search;
  
  var link;
  var ejs;
  if(page == "Habarlar"){
    link = "news";
    ejs = "habarlar"
  }
  else if(page == "Bildirişler"){
    link = "events"
    ejs = "bildirishler"
  }
  else if(page == "Gazetler"){
    link = "newspapers"
    ejs = "gazetler"
  }
  else if(page == "TSTB agzalary"){
    link = "members"
    ejs = "kompaniyalar"
  }
  else if(page == "Internet Söwda"){
    link = "commerce"
    ejs = "internetSowda"
  }
  else if(page == "Iş meýilnamasy"){
    link = "menu/bussiness"
    ejs = "plans"
  } 
  else if(page == "Ygtyýarnama"){
    link = "menu/license"
    ejs = "lisense"
  } 
  // else if(page == "Pudaklar"){
  //   link = ""
  //   ejs = "pudaklar"
  // } 
  // else if(page == "Kärhanalar"){
  //   link = ""
  //   ejs = "karhanalar"
  // } 
  // else if(page == "Partniýorlar"){
  //   link = ""
  //   ejs = "partniyorlar"
  // }
  // else if(page == "Constructor kategoriýalar"){
  //   link = "constructor"
  //   ejs = "constructor"
  // }
  else if(page == "Sub constructorlar"){
    link = "constructor"
    ejs = "subConstructor";
  }
  var data;
  console.log(link);
  console.log(text);
  try{
    data = await axios.get(`${localHost}/${link}/searchAdmin?text=${text}`);
  }catch(error){
    console.log(error)
  }
  console.log(data.data)
  res.render(`admin/${ejs}`,{data:data.data,name:page,host:host,hostiso});
  
})

// page post

app.post("/admin/:page",function(req,res){
  var page = req.params.page;
  if(page == "subConstructor"){
    var nomer = req.body.shablon;
    console.log(req.body);
    banner=nomer
    if(nomer == 1){
      res.render("admin/toAdd/shablon/shablon1",{data:req.body,name:"Sub Constructor",id:constructorId,host,hostiso});
    }else if(nomer == 2){
      res.render("admin/toAdd/shablon/shablon2",{data:req.body,name:"Sub Constructor",host,id:constructorId,hostiso});
    }else if(nomer == 3){
      res.render("admin/toAdd/shablon/shablon3",{data:req.body,name:"Sub Constructor",host,id:constructorId,hostiso});
    }else if(nomer == 4){
      res.render("admin/toAdd/shablon/shablon4",{data:req.body,name:"Sub Constructor",host,id:constructorId,hostiso})
    }else if(nomer == 5){
      res.render("admin/toAdd/shablon/shablon5",{data:req.body,name:"Sub Constructor",host,id:constructorId,hostiso})
    }else if(nomer == 6){
      res.render("admin/toAdd/shablon/shablon6",{data:req.body,name:"Sub Constructor",host,id:constructorId,hostiso})
    }else if(nomer == 7){
      res.render("admin/toAdd/shablon/shablon7",{data:req.body,name:"Sub Constructor",host,id:constructorId,hostiso})
    }
  }else if(page == "subConstructor2"){
    console.log("Shablondan Maglumat geldi"+constructorId);
    console.log(req.body);
    res.redirect(`/admin/subConstructor/${constructorId}`)
  }
})






// page add
app.get("/admin/:page/add",async function(req,res){
  var page = req.params.page;
  var data;
  if(page == 'Habarlar'){
    try{
      data = await axios.get(`${localHost}/news/tag`);
      res.render("admin/toAdd/addHabarlar",{tag:data.data,name : page+" goşmak",host,hostiso});
    }catch(error){
      res.send(error);
    }
    
  }else if(page == "Bildirişler"){
    try{
      data = await axios.get(`${localHost}/events/tag`);
      res.render("admin/toAdd/addBildirishler",{tag:data.data,name : "Bildiriş goşmak",host,hostiso});
    }catch(error){
      res.send(error);
    }

  }else if(page == "Gazetler"){
    res.render("admin/toAdd/addGazetler",{name:"Gazet goşmak",host,hostiso})
  }else if(page == "Pudaklar"){
    res.render("admin/toAdd/addPudaklar",{name:"Pudak goşmak",host,hostiso})
  }else if(page == "Kärhanalar"){
    res.render("admin/toAdd/addKarhanalar",{name:"Kärhana goşmak",host,id:pudakId,hostiso})
  }else if(page == "Internet Söwda"){
    try{
      data = await axios.get(`${localHost}/commerce/getCategorySimple`);
      console.log(data.data);
      res.render("admin/toAdd/addInternetSowda",{tag:data.data,name:"Internet Söwda goşmak",host,hostiso})
    }catch(error){
      res.send(error);
    }
  }else if(page == "Iş meýilnamasy"){
    res.render("admin/toAdd/addPlans",{name:"Iş meýilnamasyny goşmak",host,hostiso})
  }else if(page == "Ygtyýarnama"){
    res.render("admin/toAdd/addLisense",{name:"Ygtyýarnama goşmak",host,hostiso})
  }else if(page == "TSTB agzalary"){
    res.render('admin/toAdd/addKompaniyalar',{name:"TSTB agza goşmak",host,hostiso});
  }else if(page == "Partniýorlar"){
    res.render("admin/toAdd/addPartniyorlar",{name:"Partniýor goşmak",host,hostiso})
  }else if(page == "1-nji banner"){
    res.render("admin/toAdd/addBanner1",{name : "Banner 1-a goşmak",host,hostiso});
  }else if(page == "2-nji banner"){
    res.render("admin/toAdd/addBanner2",{name:"2-nji bannere goşmak",host,hostiso})
  }else if(page == "3-nji banner"){
    res.render("admin/toAdd/addBanner3",{name:"3-nji bannere goşmak",host,hostiso})
  }else if(page == "Constructor kategoriýalar"){
    res.render("admin/toAdd/addConstructorKategori",{host,name:"Constructor kategoriýa goşmak",hostiso})
  }else if(page == "Sub constructorlar"){
    console.log(constructorId)
    res.render("admin/toAdd/addSubConstructor",{name:"Sub constructor goşmak",hostiso})
  }
})



// page edit
app.get("/admin/:page/edit/:id",async function(req,res){
  var page = req.params.page;
  var id = req.params.id;
  var data;
  if(page == "habarlar"){
    try{
      data = await axios.get(`${localHost}/news/getOne?id=${id}`);
    }catch(error){
      console.log(error)
    }
    console.log(data.data);
    res.render("admin/toEdit/editHabarlar",{data:data.data[0],tags:data.data[1],name:"Habarlar üýtgetmek",host:host});
  }else if(page == 'bildirishler'){
    try{
      data = await axios.get(`${localHost}/events/getOne?id=${id}`);
    }catch(error){
      console.log(error)
    }
    res.render("admin/toEdit/editBildirishler",{data:data.data[0],tags:data.data[1],name:"Bildiriş üýtgetmek",host:host});
  }else if(page == 'gazetlar'){
    try{
      data = await axios.get(`${localHost}/newspapers/getOne?id=${id}`);
    }catch(error){
      console.log(error)
    }
    console.log(data);
    res.render("admin/toEdit/editGazetlar",{data:data.data,name:"Gazet üýtgetmek",host:host});
  }else if (page == 'banner1'){
    try{
      data = await axios.get(`${localHost}/banners/getOneBanner?id=1&index=${id}`);
    }catch(error){
      console.log(error)
    }
    console.log(data.data);
    res.render("admin/toEdit/editBanner1",{data:data.data,index:req.params.id,name:"1-nji banneri üýtgetmek",host:host});
  }else if (page == 'banner2'){
    try{
      data = await axios.get(`${localHost}/banners/getOneBanner?index=${id}&id=2`);
    }catch(error){
      console.log(error)
    }
    console.log(data.data);
    res.render("admin/toEdit/editBanner2",{data:data.data,index:req.params.id,name:"2-nji banneri üýtgetmek",host});
  }else if (page == 'banner3'){
    try{
      data = await axios.get(`${localHost}/banners/getOneBanner?index=${id}&id=3`);
    }catch(error){
      console.log(error)
    }
    console.log(data.data);
    res.render("admin/toEdit/editBanner3",{data:data.data,index:req.params.id,name:"3-nji banneri üýtgetmek",host});
  }else if(page == 'kompaniyalar'){
    try{
      data = await axios.get(`${localHost}/members/getOne?id=${id}`);
    }catch(error){
      console.log(error)
    }
    console.log(data.data);
    res.render("admin/toEdit/editKompaniyalar",{data:data.data,id:req.params.id,name:"Kompaniýa üýtgetmek",host});
  }else if(page == 'internetSowda'){
    try{
      data = await axios.get(`${localHost}/commerce/getOne?id=${id}`);
    }catch(error){
      console.log(error)
    }
    console.log(data.data);
    res.render("admin/toEdit/editInternetSowda",{data:data.data[0],tag:data.data[1],id:req.params.id,name:"Internet Söwdany üýtgetmek",host});
  }else if(page == 'ishMeyilnamasy'){
    try{
      data = await axios.get(`${localHost}/menu/getOneBussiness?id=${id}`);
    }catch(e){
      console.log(e);
    }
    console.log(data.data);
    res.render('admin/toEdit/editPlans',{data:data.data,name:"Iş meýilnamasyny üýtgetmek",host});
  }else if(page == 'ygtyyarnama'){
    try{
      data = await axios.get(`${localHost}/menu/getOneLicense?id=${id}`);
    }catch(e){
      console.log(e);
    }
    console.log(data.data);
    res.render('admin/toEdit/editLisense',{data:data.data,name:"Ygtyýarnama üýtgetmek",host});
  }else if(page == "pudaklar"){
    try{
      data = await axios.get(`${localHost}/industry/getOne?id=${id}`);
    }catch(e){
      console.log(e);
    }
    console.log(data.data);
    res.render("admin/toEdit/editPudaklar",{data:data.data,host,name:"Pudaklar üýtgetmek"});
  }else if(page == "karhanalar"){
    try{
      data = await axios.get(`${localHost}/industry/subCategory?index=${id}&id=${pudakId}`);
    }catch(e){
      console.log(e);
    }
    console.log(data.data);
    res.render("admin/toEdit/editKarhanalar",{data:data.data,name:"Karhanalar üýtgetmek",host,index:id,id:pudakId});
  }else if(page == 'partniyorlar'){
    try{
      data = await axios.get(`${localHost}/sponsor/getOne?id=${id}`);
    }catch(e){
      console.log(e);
    }
    console.log(data.data);
    res.render('admin/toEdit/editPartniyorlar',{data:data.data,host,name:'Partniýorlar üýtgetmek'})
  }else if(page == 'constructorKategori'){
    try{
      data = await axios.get(`${localHost}/constructor/getOneSimple?id=${id}`);
    }catch(e){
      console.log(e);
    }
    console.log(data.data);
    res.render('admin/toEdit/editConstructorKategori',{data:data.data,host,name:'Constructor kategory üýtgetmek',id})
  }else if(page == 'subConstructor'){
    try{
      data = await axios.get(`${localHost}/constructor/subCategory/getOne?id=${id}`);
    }catch(e){
      console.log(e);
    }
    console.log(data.data);
    var sh = Number(data.data.page);
    var name = 'Constructor kategory üýtgetmek'
    if(sh == 1){
      res.render('admin/toEdit/shablon/shablon1',{data:data.data,host,name,id})
    }else if(sh == 2){
      res.render('admin/toEdit/shablon/shablon2',{data:data.data,host,name,id})
    }else if(sh == 3){
      res.render('admin/toEdit/shablon/shablon3',{name,data:data.data,host,id})
    }else if(sh == 4){
      res.render('admin/toEdit/shablon/shablon4',{name,data:data.data,host,id})
    }else if(sh == 5){
      res.render('admin/toEdit/shablon/shablon5',{name,data:data.data,host,id})
    }else if(sh == 6){
      res.render('admin/toEdit/shablon/shablon6',{name,data:data.data,host,id})
    }else if(sh == 7){
      res.render('admin/toEdit/shablon/shablon7',{name,data:data.data,host,id})
    }
  }
})
//Server Start
app.listen("80",function(){
  console.log('80 server is working');
})
