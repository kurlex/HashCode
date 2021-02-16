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
    window.location.href= (url.origin +"/Search/:"+getSelectedOption(Slevel).value)
})