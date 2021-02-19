const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser')
const Inputs = [
    { challenge : 0 ,title:"Sample",value : 0},
    { challenge : 0 ,title:"Example of Easy constraints",value : 1},
    { challenge : 0 ,title:"A littel harder",value : 2},
    
    { challenge : 1 ,title:"Sample",value : 3},
    { challenge : 1 ,title:"The power of 100",value : 4},
    { challenge : 1 ,title:"Five zeros",value : 5},

    { challenge : 2 ,title:"Sample",value : 6},
    { challenge : 2 ,title:"Just a box",value : 7},
    { challenge : 2 ,title:"Full containe",value : 8},

    { challenge : 3 ,title:"Sample",value : 9},
    { challenge : 3 ,title:"Example of Easy constraints",value : 10},
    { challenge : 3 ,title:"A bit harder",value : 11},

    { challenge : 4 ,title:"Sample",value : 12},
    { challenge : 4 ,title:"Y/N",value : 13},
    
    { challenge : 5 ,title:"Sample",value : 14},
    { challenge : 5 ,title:"Normal mode",value : 15},
    { challenge : 5 ,title:"Extraordinary",value : 16},

    { challenge : 6 ,title:"A bit harder",value : 17},
    { challenge : 6 ,title:"Medium size",value : 18},
    { challenge : 6 ,title:"10000 Years",value : 19},

    { challenge : 7 ,title:"Sample",value : 20},
    { challenge : 7 ,title:"Medium array",value : 21},
    { challenge : 7 ,title:"Large array",value : 22},

]
const Levels = [
    { title:"Tutorial", value : 0},
    { title:"Data Structure", value : 1},
    { title:"Greedy", value : 2},
    { title:"Graph", value : 3},
    { title:"Dynamic programming", value : 4}
]
const Challenges = [
    { level : 0 ,title:"Addition", value : 0},
    { level : 0 ,title:"Square", value : 1},

    { level : 1 ,title:"Chocolate", value : 2},
    { level : 1 ,title:"Good Number", value : 3},
    { level : 1 ,title:"Yes/No", value : 4},

    { level : 2 ,title:"High Quality", value : 5},
    { level : 2 ,title:"Deci-Binary", value : 6},
    { level : 2 ,title:"Dense", value : 7},
    
    { level : 3 ,title:"Gr1", value : 8},
    { level : 3 ,title:"Gr2", value : 9},
    { level : 3 ,title:"Gr3", value : 10},
    
    { level : 4 ,title:"dp1", value : 11},
    { level : 4 ,title:"dp2", value : 12},
    { level : 4 ,title:"dp3", value : 13},
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

  function crypto(key,id){
    const acc = "Acc";
    var cry = "";
    for(var i=0;i<28;i+=4)
        cry+= key[i];
    console.log(cry)
    var v = parseInt(id)%10;
    key = ""
    for(var i=0;i<3;i++){
        key += String.fromCharCode(((cry.charCodeAt(i)+acc.charCodeAt(i))/2)-v)
    }
    key+= cry[3]
    key += String.fromCharCode((cry.charCodeAt(4)+ parseInt(id)/10)/2)
    key += String.fromCharCode((cry.charCodeAt(5)+v)/2)
    key += cry[6]
    return key;
}

function throwError(str,err,res){
    var date_format = new Date();
    var currDate = date_format.getMonth()+'/'+ date_format.getDate()+'/'+date_format.getFullYear();
    fs.appendFile('erros.txt',"\n"+ str +" at : "+ currDate + " : With Error: \n" + err + "\n--------------------------------------------------------------------------\n--------------------------------------------------------------------------", (er) => {
        if (er) throw err;
    })
    res.status(500).render("500")
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


app.get("/",(req,res)=>{
    res.sendFile(__dirname +"/views/index.html");

})


app.get("/About",(req,res)=>{
    res.sendFile(__dirname+ "/views/about.html");
})

app.get("/GetKey",(req,res)=>{
    res.sendFile(__dirname+"/views/GetKey.html");
})

app.get("/Phone",(req,res)=>{
    res.sendFile(__dirname+"/views/phone.html");
})

app.post('/Submit/:id1/:id2',(req, res, next) => {
    try {
        const f1 = req.files
        const id1 = Number((req.params.id1).substring(1));
        const id2 = Number((req.params.id2).substring(1));
        var keys = Object.keys(f1);
        var start
        const inputs = Inputs.filter(obj => {
            return obj.challenge === id2

          })
          inputs.sort(compare);
        len = inputs.length;
        if(keys.length != len || req.body.key.length!=28){
            //!Wrong Answer
            res.render("WA")
        }
        if(len==0)
            res.render("404")
        else
            start = inputs[0].value;
            for(var j = start ; j < len+start ; ++j){
                var s = "fileInput"+String(j-start+1);
                let serverData = fs.readFileSync( "./model/output/output"+String(j),'utf8');
                let usrData = fs.readFileSync(f1[s].tempFilePath , 'utf8' );
                if(serverData!=usrData)
                    res.render("WA");
                if(len+start==j+1)
                    res.render("cong",{key : crypto(req.body.key,id2)})

            } 
    }    
    catch (error) {
        throwError("Global error at /Submit/:id1/:id2 ",error,res)
        res.status(500).render('500')
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
            throwError("Error While Reading serverInput ",err,res)
            return
        }
        res.send(serverData)
    }) 
})

app.use((req,res)=>{
    res.status(404).sendFile(__dirname+"/views/404.html");
}
app.listen(process.env.PORT,()=>{console.log("server conneted!")})
