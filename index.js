const request = require('request');
const express = require('express')
const app = express();
const port = 3000;

const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

const serviceAccount = require('./key.json')

initializeApp({
    credential: cert(serviceAccount)
});

const db=getFirestore();

app.set("view engine","ejs")
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/signup', (req, res) => {
    res.render("signup");
  })
app.get('/signupsubmit',(req,res)=>{
  const name=req.query.name;
    
  const email=req.query.email;
    const password=req.query.pwd;

    db.collection('users').add({
      name:name,
      email:email,
      password:password
    }).then(() =>{
      res.render("signin");
    })
});
  app.get('/signin', (req, res) => {
    res.render("signin");
  })
  app.get('/signinfail',(req,res)=>{
    res.render("signinfail");
  })
app.get('/signinsubmit',(req,res) =>{
  const email=req.query.email;
    const password=req.query.password;
     db.collection("users")
     .where("email","==",email)
     .where("password","==",password)
     .get()
     .then((docs) =>{
      if(docs.size> 0){
        res.render("time");
      }
      else{
        res.render("signinfail");
      }
     });
});

app.get('/timesubmit',(req,res) =>{
  const title = req.query.title;
  console.log(title);

  request.get({
    url: 'https://api.api-ninjas.com/v1/worldtime?city=' + title,
    headers: {
      'X-Api-Key': 'VoNOqiYnho+ksLTG1CK0gg==v0sfgZYgBLFKKI0f'
    },
  }, function (error, response, body){
      if("error" in JSON.parse(body))
      {
        if((JSON.parse(body).error.code.toString()).length > 0)
        {
          res.render("time");
        }
      }
      else
      {
        const timezone= JSON.parse(body).timezone;
        const datetime= JSON.parse(body).datetime;
        const date = JSON.parse(body).date;
        const year= JSON.parse(body).year;
        const month= JSON.parse(body).month;
        const day= JSON.parse(body).day;
        const hour=JSON.parse(body).hour;
         const minute=JSON.parse(body).minute;
         const second=JSON.parse(body).second;
 const day_of_week=JSON.parse(body).day_of_week;
        
        


       res.render('title',{
  timezone:  timezone,
  datetime:datetime,
  date:date,
  year:year,
  month:month,
  day: day,
  hour: hour,
  minute:minute ,
  second: second,
  day_of_week: day_of_week,
});
        
      } 
    }
    );
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})