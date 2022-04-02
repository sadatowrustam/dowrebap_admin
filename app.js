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
  let data,count
  const limit=req.query.limit || 20
  const page=req.query.page || 0
  try{
    data = await axios.get(`${localHost}/admin/products/active?limit=${limit}&page=${page}`);
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
  res.render("admin/bannerProducts",{name:"Banner harytlary",link:"banners/products/"+req.params.id,host:localHost,data:data.data.banner})
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
app.get
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
//Server Start
app.listen("80",function(){
  console.log('80 server is working');
})
