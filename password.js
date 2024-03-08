const inputslider=document.querySelector("[sliderwa]");
const lengthdisplay=document.querySelector("[datalengthnumber]");
const passworddisplay=document.querySelector("[datapassworddisplay]");
const copybtn=document.querySelector("[datacopy]");
const copymsg=document.querySelector("[datacopymsg]");
const uppercasecheck=document.querySelector("#uppercase");
const lowercasecheck=document.querySelector("#lowercase");
const numberscheck=document.querySelector("#numbers");
const symbolcheck=document.querySelector("#symbol");
const indicator=document.querySelector("[data-indicator]");
const generatebtn=document.querySelector(".generatebutton");
const allcheckbox=document.querySelectorAll("input[type=checkbox]");
const symbol='~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password="";
let passwordlength=10;
let checkcount=0;
//set strength to color gray
setindicator("#ccc");

handleslider();
function handleslider()
{
    inputslider.value=passwordlength;
    lengthdisplay.innerText=passwordlength;
    const min=inputslider.min;
    const max=inputslider.max;
    inputslider.style.backgroundSize=( (passwordlength-min)*100/(max-min))+ "% 100%";
}
function setindicator(color)
{
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function getrandint(min,max)
{
    return Math.floor(Math.random()*(max-min))+min;
}

function generaterandomnumber()
{
    return getrandint(0,9);
}
function generatrandomlowercase()
{
    return String.fromCharCode(getrandint(97,123));
}
function generaterandomuppercase()
{
    return String.fromCharCode(getrandint(65,91));
}

function generaterandsymbol()
{
    let len=symbol.length;
    return symbol.charAt(getrandint(0,len));
}

function calcstrength()
{
    let hasupper=false;
    let haslower=false;
    let hasnum=false;
    let hassymbol=false;

    if(uppercasecheck.checked)
    {
        hasupper=true;
    }
    if(lowercasecheck.checked)
    {
        haslower=true;
    }
    if(symbolcheck.checked)
    {
        hassymbol=true;
    }
    if(numberscheck.checked)
    {
        hasnum=true;
    }
     
    if(hasupper&&haslower&&(hasnum||hassymbol)&&passwordlength>=8)
    {
        setindicator("#0f0");
    }
    else if((haslower||hasupper)&&(hasnum||hassymbol)&&passwordlength>=6)
    {
        setindicator("#ff0");
    }
    else
    {
        setindicator("#f00");
    }
}

async function copycontent()
{
    try
    {
        await navigator.clipboard.writeText(passworddisplay.value);
        copymsg.innerText="copied";
    }
    catch(e)
    {
        copymsg.innerText="failed";
    }
    //css ki help se dikhyange
    copymsg.classList.add("active");
    
    //2sec k baad chal jayga
    setTimeout(function(){
        copymsg.classList.remove("active");
    },2000);   
}

inputslider.addEventListener('input',function(e){
    passwordlength=e.target.value;
    handleslider();
})

copybtn.addEventListener('click',function(){
    if(passworddisplay.value)
    {
        copycontent();
    }
})
function handlecheckboxchange()
{
    checkcount=0;
    allcheckbox.forEach(function(checkbox){
        if(checkbox.checked)
        {
            checkcount++;
        }
    })

    //special constion
    if(passwordlength<checkcount)
    {
        passwordlength=checkcount;
        handleslider();
    }
}

allcheckbox.forEach(function(checkbox){
    checkbox.addEventListener('change',handlecheckboxchange);
})
function shufflepassword(password)
{
    //fisher yates method
    for (let i = password.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = password[i];
        password[i] = password[j];
        password[j] = temp;
    }
    let str = "";
    password.forEach((el) => (str += el));
    return str;
}
generatebtn.addEventListener('click',function(e){
     //none of the checkbox are selcted
     if(checkcount<=0)
     {
        return;
     }
     if(passwordlength<checkcount)
     {
        passwordlength=checkcount;
        handleslider();
     }

     //how to make passsword
     //remove old password
     password="";

     //let's put the stuff mentioned by the checkboxes
    //  if(uppercasecheck.checked)
    //  {
    //     password+=generaterandomuppercase();
    //  }
    //  if(lowercasecheck.checked)
    //  {
    //     password+=generatrandomlowercase();
    //  }
    //  if(numberscheck.checked)
    //  {
    //     password+=generaterandomnumber();
    //  }
    //  if(symbolcheck.checked)
    //  {
    //     password+=generaterandsymbol();
    //  }

    let funcarr=[];

    if(uppercasecheck.checked)
    {
        funcarr.push(generaterandomuppercase);
    }
    if(lowercasecheck.checked)
    {
        funcarr.push(generatrandomlowercase);
    }
    if(numberscheck.checked)
    {
        funcarr.push(generaterandomnumber);
    }
    if(symbolcheck.checked)
    {
        funcarr.push(generaterandsymbol);
    }

    //compulsory addition
    for(let i=0;i<funcarr.length;i++)
    {
        password+=funcarr[i]();
    }

    //remaining addition
    for(let i=0;i<passwordlength-funcarr.length;i++)
    {
        let randindex=getrandint(0,funcarr.length);
        password+=funcarr[randindex]();
    }
    console.log(password);
    //shuffle password
    password=shufflepassword(Array.from(password));

    passworddisplay.value=password;
    
    //calculate strength
    calcstrength();

})