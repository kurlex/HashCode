/* app.get("/add",(req,res)=>{
    const levels = [
        { title:"Tutorial", value : 0},
        { title:"Data Structure", value : 1},
        { title:"Greedy", value : 2},
        { title:"Graph", value : 3},
        { title:"Dynamic programming", value : 4}
    ]
    levels.forEach(l => {
        var x = new Levels(l);
        x.save().then(()=>{console.log("levels")})
    })
    const challenges = [
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

    challenges.forEach(l => {
        var x = new Challenges(l);
        x.save().then(()=>{console.log("chall")})
    })
    const inputs = [
        { challenge : 0 ,title:"1st_input",value : 0},
        { challenge : 0 ,title:"2nd_input",value : 1},
        { challenge : 0 ,title:"3rd_input",value : 2},
    ]

    inputs.forEach(l => {
        var x = new Inputs(l);
        x.save().then(()=>{console.log("input")}) 
    })
    const datas = [
        { id:0,data:"1st input"},
        { id:1,data:"2nd input"},
        { id:2,data:"3rd input"},   
    ]
    datas.forEach(l => {
        var x = new Data(l);
        x.save().then(()=>{console.log("data")})
    })

})
 */
const express = require('express');
const app = express();
var i = 0;
const fs = require('fs');
function crypto(key,id){
    const acc = "Acc";
    var cry = "";
    for(var i=0;i<28;i+=4){
        cry+= key[i];
    }
    var lastDigit = parseInt(parseInt(id)%10);
    var firstDigit = parseInt(parseInt(id)/10);
    key = ""
    for(var i=0;i<3;i++){
        x = parseInt(((cry.charCodeAt(i)+acc.charCodeAt(i))/2)-lastDigit);
        if(x==92){
            key+="A";
        }
        else
            key+=String.fromCharCode(x);
        
    }
    key+= cry[3]
    x = parseInt((cry.charCodeAt(4)+ firstDigit + 48)/2);
        if(x==92){
            key+="A";
        }
        else
            key+=String.fromCharCode(x);
   
    x = parseInt((cry.charCodeAt(5)+ lastDigit +48)/2);
        if(x==92){
            key+="A";
        }
        else
            key+=String.fromCharCode(x);
    key += cry[6]
    return key;
}
console.log(crypto("kbb9eScAUUWqJUpPIkEkDjP1ku83",0))
