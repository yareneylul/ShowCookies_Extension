const express=require('express');
const mongoose=require('mongoose');
const dbURL='mongodb+srv://root:wert@showcookies.mvyjabp.mongodb.net/?retryWrites=true&w=majority';
const { Schema } = mongoose;

const app = express();
const port = 3000;

app.listen(port,()=>{
    console.log("port:3000")
}
)
  mongoose.connect(dbURL, {
      dbName: 'showcookie',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Connected to the DB succesfully');
    })
    .catch((err) => {
      console.log(`DB connection err:, ${err}`);
    });


const cookieSchema = new Schema({
 domain: {
    type: String,
    required: true,
    trim: true,
  },
   isim: {
    type: String,
    required: true,
    trim: true,
  },
  deger: {
   type: String,
   required: true,
   trim: true,
 },
amac: {
 type: String,
 required: false,
 trim: true,
 default: "belirsiz",
},
gecerlilik: {
 type: Date,
 required: false,
},
hostOnly: {
  type: Boolean,
  required: true,
 },
 oturum: {
  type: Boolean,
  required: true,
 },
 guvenlik: {
  type: Boolean,
  required: true,
 },
 httpOnly: {
  type: Boolean,
  required: true,
 }
  // uploadedAt: {
  //   type: Date,
  //   default: Date.now,
  // }
});

const cookieDb = mongoose.model('cookieDb', cookieSchema);
module.exports =cookieDb;

// app.get('./add',(req,res)=>{
//    const deneme= new database({
//     domain:FontFace,
//     isim:f,
//     deger:e,
//     hostOnly:false,
// oturum:false,
// guvenlik:false,
// httpOnly:false
//    })
//    deneme.save()
//    .then((result)=>{
//     res.send(result)
//    })
//    .catch((err)=>{
//     console.log(err)
//    })
// })
//  const createDB =(req,res)=>{
//   const cook = database.create(req.body)
//   res.status(201).json({
//     successed:true,
//     cook,
//   })
//  }

//  app.post('./add',createDB);
//  app.use(express.json());