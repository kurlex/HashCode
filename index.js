const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser')
const Inputs = [
    { challenge : 0 ,title:"1st_input",value : 0},
    { challenge : 0 ,title:"2nd_input",value : 1},
    { challenge : 0 ,title:"3rd_input",value : 2},
]
const Levels = [
    { title:"Tutorial", value : 0},
    { title:"Data Structure", value : 1},
    { title:"Greedy", value : 2},
    { title:"Graph", value : 3},
    { title:"Dynamic programming", value : 4}
]

const Data = [
    { id:0,InputPath:"1st input"},
    { id:1,InputPath:"2nd input"},
    { id:2,InputPath:"3rd input"},   
]
const Challenges = [
    { level : 0 ,title:"Sum", value : 0},
    { level : 0 ,title:"Square", value : 1},

    { level : 1 ,title:"Sweets", value : 2},
    { level : 1 ,title:"Repetition", value : 3},
    { level : 1 ,title:"???", value : 4},

    { level : 2 ,title:"Greedy1", value : 5},
    { level : 2 ,title:"Greedy2", value : 6},
    { level : 2 ,title:"Greedy3", value : 7},
    
    { level : 3 ,title:"Gr1", value : 8},
    { level : 3 ,title:"Gr2", value : 9},
    { level : 3 ,title:"Gr3", value : 10},
    
    { level : 4 ,title:"dp1", value : 11},
    { level : 4 ,title:"dp2", value : 12},
    { level : 4 ,title:"dp3", value : 13},
]
const Output = [
    { id:0,OutputPath:"1st input"},
    { id:1,OutputPath:"2nd input"},
    { id:2,OutputPath:"3rd input"},   
]
const fileUpload = require('express-fileupload')
const path = require('path')
function compare( a, b ) {
    if ( a.value < b.value ){
      return -1;
    }
    if ( a.value > b.value ){
      return 1;
    }
    return 0;
  }

function crypto(key){
    return key;
}

function throwError(str,err){
    var date_format = new Date();
    var currDate = date_format.getMonth()+'/'+ date_format.getDate()+'/'+date_format.getFullYear();
    fs.appendFile('erros.txt',"\n"+ str +" at : "+ currDate + " : With Error: \n" + err + "\n--------------------------------------------------------------------------\n--------------------------------------------------------------------------", (er) => {
        if (er) throw err;
    })
    res.status(500).send("Please inform us about this error")
}

app.set('view engine','ejs')
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended : true}))
app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: path.join(__dirname, 'tmp'),
      createParentPath: true,
      limits: { fileSize: 2 * 1024 * 1024 },
    })
  )

//res.render('index',{});

//TODO:matensech el donnes ynajem wehed yabdel el value mta3 el forms!!

app.get("/",(req,res)=>{
    res.sendFile(__dirname +"/views/index.html");
})


app.get("/About",(req,res)=>{
    res.sendFile(__dirname+ "/views/about.html");
})

app.get("/GetKey",(req,res)=>{
    res.sendFile(__dirname+"/views/GetKey.html");
})


app.post('/Submit/:id1/:id2',(req, res, next) => {
    try {
        const f1 = req.files
        const id1 = Number((req.params.id1).substring(1));
        const id2 = Number((req.params.id2).substring(1));
        var keys = Object.keys(f1);
        const inputs = Inputs.filter(obj => {
            return obj.challenge === id2
          })
        len = inputs.length;
        if(keys.length != len){
            //!Wrong Answer
            res.render("WA")
        }
        new Promise((resolve, reject)=>{
            var res = 0;
            for(var j = 1 ; j <= len ; ++j){
                var s = "fileInput"+String(j)
                f1[s] = { ...f1[s] , ...{k : j}}
                if(f1[s]==undefined||f1[s].truncated){
                    reject('Wrong Answer')
                }
        
                fs.readFile(f1[s].tempFilePath , 'utf8' , (err1, usrData) => {
                    if (err1) {
                        throwError("Error While Reading userFile ",err1)
                        return
                    }
                    fs.readFile( "./model/output/output"+String(inputs[Number(f1[s].k-1)].value), 'utf8' , (err2, serverData) => {
                        if (err2) {
                            throwError("Error While Reading serverOutput ",err2)
                            return
                        }
                        if(usrData!=serverData)
                            reject("Wrong Answer")
                     else{
                         res++;
                         if(res==len)
                             resolve("Accepted")
                     }
                    })  
                })
            }
    
        })
        .then((a)=>{
            res.render("cong",{key : crypto(req.body.key)})
        })
        .catch((w)=>{
            res.render("WA")
        })
    }
    catch (error) {
        throwError("Global error at /Submit/:id1/:id2 ",error)
        res.render('505')
    }
  })

app.get("/Submission/:id",(req,res)=>{

    const id = Number((req.params.id).substring(1));
    if(id > Levels.length || id < 0)
        res.status(404).sendFile(__dirname+"/views/404.html")
    const challenges = Challenges.filter(obj => {
        return obj.level === id
    })
    res.render("submit", {Levels , challenges ,id1 : id ,id2 : null,title : "Outputs",inputs:null});
})


//TODO method to search for the problems of each level
app.get("/Search/:id",(req,res)=>{

    const id = Number((req.params.id).substring(1));
    
    if(id > Levels.length || id < 0)
        res.status(404).sendFile(__dirname+"/views/404.html")
    const challenges = Challenges.filter(obj => {
        return obj.level === id
    })
    res.render("input", {Levels , challenges ,id1 : id ,id2 : null,title : "Inputs",inputs:null});
})

app.post("/Output",(req,res)=>{
    const id1 = Number(req.body.level);
    const id2 = Number(req.body.challenge);

    if(id1> Levels.length || id1<0)
        res.status(404).sendFile(__dirname+"/views/404.html")
    const challenges = Challenges.filter(obj => {
        return obj.level === id1
    })    
    title = "Problem"
    challenges.forEach(chal =>{
        if(chal.value == id2)
            title = chal.title
    })
    const inputs = Inputs.filter(obj => {
        return obj.challenge === id2
    })
    res.render("submit", {Levels,challenges,id1,id2,title,inputs});        
})
    
//TODO provide inputs IDs
app.post("/Input",(req,res)=>{
    const id1 = Number(req.body.level);
    const id2 = Number(req.body.challenge);

    if(id1> Levels.length || id1<0)
        res.status(404).sendFile(__dirname+"/views/404.html")
        const challenges = Challenges.filter(obj => {
            return obj.level === id1
        })
        title = "Input"
        challenges.forEach(chal =>{
            if(chal.value == id2)
                title = chal.title
        })
        const inputs = Inputs.filter(obj => {
            return obj.challenge === id2
        })
        res.render("input", {Levels,challenges,id1,id2,title,inputs});
})

//TODO provide data to download
app.get("/Download/:id",(req,res)=>{
    fs.readFile( "./model/input/input"+String(Number((req.params.id).substring(1))), 'utf8' , (err, serverData) => {
        if (err) {
            throwError("Error While Reading serverInput ",err)
            return
        }
        res.send(serverData)
    }) 
})

app.use((req,res)=>{
    res.status(404).sendFile(__dirname+"/views/404.html");
})

app.listen(3000,()=>{console.log("server conneted!")})