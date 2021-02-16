function chooseFile(num) {
    document.getElementById("fileInput"+num).click();
 }
var el = document.getElementById("error");

function check(size){
    FadeOut(el,el.style.opacity,20);
    if(document.getElementsByClassName("input")[0].value==""){
        FadeIn(el,"1");
        return;
    }
    for(var i =1 ;i<=size;i++)
        if(document.getElementById("fileInput"+String(i)).files.length == 0){
            FadeIn(el,"1");
            return;
        }
    document.getElementsByClassName("post")[0].click();
}
function getSelectedOption(sel) {
    var opt;
    for ( var i = 0, len = sel.options.length; i < len; i++ ) {
        opt = sel.options[i];
        if ( opt.selected === true ) {
            break;
        }
    }
    return opt;
}
var url = new URL(document.location);
Slevel = document.getElementById("Slevel");
Slevel.addEventListener("change",()=>{
    window.location.href= (url.origin +"/Submission/:"+getSelectedOption(Slevel).value)
})