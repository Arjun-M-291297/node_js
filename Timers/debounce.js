let out, tempVal = "";
let timer;
function debounce(val){
    tempVal+=val
    clearTimeout(timer)
    timer = setTimeout(()=>{
        out = tempVal
        console.log(out)
    },1000)
}

debounce('A')
debounce('R')
debounce('J')
debounce('U')
debounce('N')