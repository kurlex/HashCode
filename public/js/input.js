/*
** 
** Made By Kurlex
** Feel free to use this code without any restrictions
** Good Luck ;)
**
*/

var input = document.querySelectorAll(".input");
var ni = document.querySelectorAll(".inputName");
function FadeIn(el,goal,num=50){
    var s="0";
    var ID=setInterval(function () {
    if(Number(s) + 0.1 >= Number(goal)){
        el.style.opacity = goal;
        clearInterval(ID);
    }
    s = String(Number(s)+0.1);
    el.style.opacity=s;
  },num);
}
function FadeOut(el,initialOpacity,num=50){
    var s=initialOpacity;
    var ID=setInterval(function () {
    if(Number(s) <= 0){
        el.style.opacity ="0";
        clearInterval(ID);
    }
    s = String(Number(s)-0.1);
    el.style.opacity=s;
  },num);
}
function setInputName(item,index){
    if(item.value!="")
        ni[index].style.opacity ="0";
    item.addEventListener('focus',()=> {if(item.value=="")FadeOut(ni[index],"0.5");});
    item.addEventListener('focusout',()=> {if(item.value=="")FadeIn(ni[index],"0.5");});
}
input.forEach(setInputName);
