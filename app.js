const { request } = require('express');
const express = require('express');
const app = express();
const serv = require('http').Server(app);
const fs = require("fs");
//var gaming = false;
String.prototype.getFirstLetter = function() {return this.toString().slice(0,1)};
let requestedWords = JSON.parse(fs.readFileSync("addedWords.json","utf8"));
const print = function(string) {
    console.log(string);
};
function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1) ) + min;
}
app.get('/',function(req,res) {
    //print(res);
    //print(req);
    res.sendFile(__dirname + '/client/index.html');
});
app.get('/client/img/troll.png',function(req,res) {
    //print(res);
    //print(req);
    //res.redirect(302,"/client/img/mwiw.png");
    let script = `window.onload = function() {
        location.href = 'https://youtube.com';
    };`
    res.send(`<html style="height: 100%;"><head><meta name="viewport" content="width=device-width, minimum-scale=0.1"><title>troll.png (461×434)</title></head><body style="margin: 0px; background: #0e0e0e; height: 100%"><img style="-webkit-user-select: none;margin: auto;background-color: hsl(0, 0%, 90%);transition: background-color 300ms;" src="${__dirname + "/client/img/mwiw.png"}"></body><script>${script}</script></html>`);//(fs.readFileSync("client/img/troll.png","utf8")+"<script>console.log('fuck you lol')</script>")
    //res.sendFile(__dirname + '/client/index.html');
});
app.get('/request',function(req,res) {
    res.sendFile(__dirname + '/client/request.html');
    //gaming = false;
});
//app.get('/client/img/mwiw.png',function(req,res) {
    //res.redirect(302,"https://www.youtube.com/watch?v=dQw4w9WgXcQ"); 
//});
app.use('/client',express.static(__dirname + '/client'));

serv.listen(process.env.PORT || 2000);

print("doin' ur mom doin' doin' ur mom");

var io = require('socket.io')(serv,{});
var SOCKET_LIST = {};
var PLAYER_LIST = {};
var requestList = [];
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function choice(bruh) {
	return bruh[random(0,bruh.length-1)];
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
} 
const WORD_LIST = ["Couch","Bruh","Emoji","Website","Discord","Youtube","Instagram","Animal","Poop","Pooping","Toe","Neck","Head","Hair","Nose","Air pods","Among us","Suck","Cake","Keycard","Cheese","Wocky Slush","Rabbit","Troll","Bed","Volcano","Computer","GPU"];
console.log(requestedWords["added"]);
Object.entries(requestedWords["added"]).forEach((obj)=>{
    WORD_LIST.push(obj[0]);
});
//make a new page where it shows 
var bruh = 0;
var players = 0;
var time = 0;
var host = "";
var started;
var drawer;
var currentWord = choice(WORD_LIST);
var drawingInfo = {};
var passwordt = "pain"; //naruto reference!!!!

console.log(currentWord);
/*function hostInGame() {
    
    for (const property in PLAYER_LIST) {
        for(const prop in PLAYER_LIST[property]) {
            console.log(`${prop}: ${PLAYER_LIST[property][prop]}`);
            if(PLAYER_LIST[property][prop].host) {
                
            }
        }
    }
    console.log(shit);
    return shit;
}*/
function multicast(name,value) {
    for(var i in SOCKET_LIST) {
        SOCKET_LIST[i].emit(name,value);
    }
}
function multicastBoolCondition(name,value,condition) {
    for(var i in SOCKET_LIST) {
        if(PLAYER_LIST[i][condition]) {
            SOCKET_LIST[i].emit(name,value);
        }
    }
}
function getWordInfo() {
    let dung = "";
    for(let i = 0;i < currentWord.length; i++) {
        dung+=currentWord[i] == " " ? " " : "_";
    }
    return dung;
}
function changeDrawer(newPlayer) {
    for(var i in PLAYER_LIST) {
        PLAYER_LIST[i].answered = false;
    }
    currentWord = choice(WORD_LIST);
    newPlayer.answered = true;
    multicast('myTurn',{turn:false,word:getWordInfo()});
    newPlayer.socket.emit('myTurn',{turn:true,word: currentWord});
    multicast('chatted',`<bruh style='font-weight:bold;color:rgb(57, 117, 206);'>Its ${newPlayer.name}'s turn!</bruh>`);
    multicast('clear','');
    drawingInfo = {};
    drawer = newPlayer;
    console.log(currentWord);
}
function selectNextDrawer() {
    let check = false;
    let firstTime = true;
    let nextPerson = 0;
    for(var i in PLAYER_LIST) {
        console.log(PLAYER_LIST[i].name);
        if(PLAYER_LIST[i].name != "") {
            if(firstTime) {
                firstTime = false;
                nextPerson = i;
            }
            if(PLAYER_LIST[i] == drawer) {
                check = true;
            }else if(check) {
                nextPerson = i;
            }
        }
    }
    changeDrawer(PLAYER_LIST[nextPerson]);
}
var emojis = new Map();
emojis.set(':trort:','https://cdn.discordapp.com/emojis/745045522120835203.png?v=1');emojis.set(':troort:','https://cdn.discordapp.com/emojis/758022868872200332.png?v=1');emojis.set(':trolsmile:','https://cdn.discordapp.com/emojis/723229451709579306.png?v=1');emojis.set(':trolort:','https://cdn.discordapp.com/emojis/690075871196872727.png?v=1');emojis.set(':trollzombie:','https://cdn.discordapp.com/emojis/702520254919868536.png?v=1');emojis.set(':trollyou:','https://cdn.discordapp.com/emojis/741771561874489474.png?v=1');emojis.set(':trollyoda:','https://cdn.discordapp.com/emojis/690711040308150293.png?v=1');emojis.set(':trollyikes:','https://cdn.discordapp.com/emojis/719038391622303804.png?v=1');emojis.set(':trollyellow:','https://cdn.discordapp.com/emojis/760768945065689088.png?v=1');emojis.set(':trollyandere:','https://cdn.discordapp.com/emojis/710346428115058768.png?v=1');emojis.set(':trollwhynne:','https://cdn.discordapp.com/emojis/779974181378588672.png?v=1');emojis.set(':trollwhitecat:','https://cdn.discordapp.com/emojis/762649725714563093.png?v=1');emojis.set(':trollweird:','https://cdn.discordapp.com/emojis/699222873163825162.png?v=1');emojis.set(':trollwalter:','https://cdn.discordapp.com/emojis/762646979330834502.png?v=1');emojis.set(':trollwales:','https://cdn.discordapp.com/emojis/723223297583480863.png?v=1');emojis.set(':trollvatican:','https://cdn.discordapp.com/emojis/723223297155662006.gif?v=1');emojis.set(':trollvanish:','https://cdn.discordapp.com/emojis/739351280710844516.gif?v=1');emojis.set(':trollussr:','https://cdn.discordapp.com/emojis/694294513706991687.png?v=1');emojis.set(':trollusa:','https://cdn.discordapp.com/emojis/718505917737599068.png?v=1');emojis.set(':trollupvote:','https://cdn.discordapp.com/emojis/764598325785395223.png?v=1');emojis.set(':trollunitedkingdom:','https://cdn.discordapp.com/emojis/723223297508114472.png?v=1');emojis.set(':trollukraine:','https://cdn.discordapp.com/emojis/730820927884886119.png?v=1');emojis.set(':trolluganda:','https://cdn.discordapp.com/emojis/697139163354497064.png?v=1');emojis.set(':trollturkey:','https://cdn.discordapp.com/emojis/723223297227227229.png?v=1');emojis.set(':trolltrump:','https://cdn.discordapp.com/emojis/706215652544741426.png?v=1');emojis.set(':trolltraumatized:','https://cdn.discordapp.com/emojis/756669939955400845.png?v=1');emojis.set(':trolltransnistrial:','https://cdn.discordapp.com/emojis/723223297860567070.gif?v=1');emojis.set(':trolltrans:','https://cdn.discordapp.com/emojis/710814235151826965.png?v=1');emojis.set(':trolltiny:','https://cdn.discordapp.com/emojis/723226233101484033.png?v=1');emojis.set(':trollthinking2:','https://cdn.discordapp.com/emojis/801537662300323871.png?v=1');emojis.set(':trollthinking:','https://cdn.discordapp.com/emojis/767414809624707072.png?v=1');emojis.set(':trollswitzerland:','https://cdn.discordapp.com/emojis/723223297470496858.png?v=1');emojis.set(':trollstoned:','https://cdn.discordapp.com/emojis/711566287863808015.png?v=1');emojis.set(':trollstjohn:','https://cdn.discordapp.com/emojis/723223297507983401.gif?v=1');emojis.set(':trollstar:','https://cdn.discordapp.com/emojis/723226233076318229.png?v=1');emojis.set(':trollspook:','https://cdn.discordapp.com/emojis/693534685460168864.gif?v=1');emojis.set(':trollspain:','https://cdn.discordapp.com/emojis/723223297533149294.png?v=1');emojis.set(':trollsouthossetia:','https://cdn.discordapp.com/emojis/723223297403125790.gif?v=1');emojis.set(':trollsome:','https://cdn.discordapp.com/emojis/778392177226678272.png?v=1');emojis.set(':trollsmug:','https://cdn.discordapp.com/emojis/738059292497805395.png?v=1');emojis.set(':trollsmooth:','https://cdn.discordapp.com/emojis/690343721937403914.png?v=1');emojis.set(':trollsmiling:','https://cdn.discordapp.com/emojis/690723663317696512.png?v=1');emojis.set(':trollsmile:','https://cdn.discordapp.com/emojis/725404108609290292.png?v=1');emojis.set(':trollslovenia:','https://cdn.discordapp.com/emojis/723223297600520243.png?v=1');emojis.set(':trollslovakia:','https://cdn.discordapp.com/emojis/723223297650589736.png?v=1');emojis.set(':trollslideshow:','https://cdn.discordapp.com/emojis/799654405162401825.gif?v=1');emojis.set(':trollskullirl:','https://cdn.discordapp.com/emojis/799654282235215922.png?v=1');emojis.set(':trollskull:','https://cdn.discordapp.com/emojis/760452559345025074.png?v=1');emojis.set(':trollshade:','https://cdn.discordapp.com/emojis/701934054202671255.png?v=1');emojis.set(':trollserbia:','https://cdn.discordapp.com/emojis/723223297617297468.png?v=1');emojis.set(':trollscroll:','https://cdn.discordapp.com/emojis/799707615034605618.gif?v=1');emojis.set(':trollscotland:','https://cdn.discordapp.com/emojis/723223297507983402.png?v=1');emojis.set(':trollsatan:','https://cdn.discordapp.com/emojis/738067933581803550.gif?v=1');emojis.set(':trollsanta:','https://cdn.discordapp.com/emojis/781330007267999804.png?v=1');emojis.set(':trollsanmarino:','https://cdn.discordapp.com/emojis/723223297487274119.png?v=1');emojis.set(':trollsami:','https://cdn.discordapp.com/emojis/723223297529217033.gif?v=1');emojis.set(':trollrussia:','https://cdn.discordapp.com/emojis/723223297482948679.png?v=1');emojis.set(':trollromania:','https://cdn.discordapp.com/emojis/723223297537474690.png?v=1');emojis.set(':trollreddit:','https://cdn.discordapp.com/emojis/690344425356001320.png?v=1');emojis.set(':trollred:','https://cdn.discordapp.com/emojis/760768945690116117.png?v=1');emojis.set(':trollreal:','https://cdn.discordapp.com/emojis/700168969729998918.png?v=1');emojis.set(':trollrat:','https://cdn.discordapp.com/emojis/776734051306307614.png?v=1');emojis.set(':trollrainbow:','https://cdn.discordapp.com/emojis/760988424399355904.gif?v=1');emojis.set(':trollpurple:','https://cdn.discordapp.com/emojis/760768945656561685.png?v=1');emojis.set(':trollpumpkin:','https://cdn.discordapp.com/emojis/762075838849744919.png?v=1');emojis.set(':trollpride:','https://cdn.discordapp.com/emojis/710814234254245890.png?v=1');emojis.set(':trollpresident:','https://cdn.discordapp.com/emojis/690343721878945954.png?v=1');emojis.set(':trollportugal:','https://cdn.discordapp.com/emojis/723223297592131604.png?v=1');emojis.set(':trollpopbob:','https://cdn.discordapp.com/emojis/763399740033073201.png?v=1');emojis.set(':trollpoogers:','https://cdn.discordapp.com/emojis/723226232879185955.png?v=1');emojis.set(':trollpoland:','https://cdn.discordapp.com/emojis/723223297524760656.png?v=1');emojis.set(':trollpoggers:','https://cdn.discordapp.com/emojis/719042835390660688.png?v=1');emojis.set(':trollpog:','https://cdn.discordapp.com/emojis/714508976321986672.png?v=1');emojis.set(':trollpixel:','https://cdn.discordapp.com/emojis/719044450130722919.png?v=1');emojis.set(':trollpissing:','https://cdn.discordapp.com/emojis/738065741663961130.png?v=1');emojis.set(':trollpink:','https://cdn.discordapp.com/emojis/760768945300439060.png?v=1');emojis.set(':trollping:','https://cdn.discordapp.com/emojis/711565692603990016.png?v=1');emojis.set(':trollpill:','https://cdn.discordapp.com/emojis/764598270185308240.png?v=1');emojis.set(':trollpika:','https://cdn.discordapp.com/emojis/704462920209399901.png?v=1');emojis.set(':trollpfp:','https://cdn.discordapp.com/emojis/690714212485300344.png?v=1');emojis.set(':trollpeter:','https://cdn.discordapp.com/emojis/763045071460237322.png?v=1');emojis.set(':trollpepe:','https://cdn.discordapp.com/emojis/690712363678302228.png?v=1');emojis.set(':trollpeek:','https://cdn.discordapp.com/emojis/701943275082219540.png?v=1');emojis.set(':trollpatrol:','https://cdn.discordapp.com/emojis/695762891961532478.png?v=1');emojis.set(':trollpan:','https://cdn.discordapp.com/emojis/710814234459766876.png?v=1');emojis.set(':trollpalestine:','https://cdn.discordapp.com/emojis/779775711502008320.png?v=1');emojis.set(':trollosu:','https://cdn.discordapp.com/emojis/709511119915581510.png?v=1');emojis.set(':trollosu~1:','https://cdn.discordapp.com/emojis/710814234572881921.png?v=1');emojis.set(':trollorange:','https://cdn.discordapp.com/emojis/760768945812144128.png?v=1');emojis.set(':trolloilcovered:','https://cdn.discordapp.com/emojis/738065902322319492.png?v=1');emojis.set(':trollodd:','https://cdn.discordapp.com/emojis/701943264743391355.png?v=1');emojis.set(':trollobama:','https://cdn.discordapp.com/emojis/690075870924111878.png?v=1');emojis.set(':trollnorway:','https://cdn.discordapp.com/emojis/723223296979632169.png?v=1');emojis.set(':trollnorthernireland:','https://cdn.discordapp.com/emojis/723223297147535442.png?v=1');emojis.set(':trollnortherncyprus:','https://cdn.discordapp.com/emojis/723223297214513243.gif?v=1');emojis.set(':trollnonymous:','https://cdn.discordapp.com/emojis/706251277788774441.png?v=1');emojis.set(':trollninja:','https://cdn.discordapp.com/emojis/690075871146541088.png?v=1');emojis.set(':trollneutral:','https://cdn.discordapp.com/emojis/741821196714246265.png?v=1');emojis.set(':trollnetherlands:','https://cdn.discordapp.com/emojis/723223297466302545.png?v=1');emojis.set(':trollnatey:','https://cdn.discordapp.com/emojis/761274843437596672.png?v=1');emojis.set(':trollnaruto:','https://cdn.discordapp.com/emojis/690713810037637172.png?v=1');emojis.set(':trollmontenegro:','https://cdn.discordapp.com/emojis/723223297126432799.png?v=1');emojis.set(':trollmonkey:','https://cdn.discordapp.com/emojis/761144974749466625.png?v=1');emojis.set(':trollmonaco:','https://cdn.discordapp.com/emojis/723223297327890476.png?v=1');emojis.set(':trollmoldova:','https://cdn.discordapp.com/emojis/723223297218576416.png?v=1');emojis.set(':trollmexico:','https://cdn.discordapp.com/emojis/724277496534663189.png?v=1');emojis.set(':trollmexican:','https://cdn.discordapp.com/emojis/690713741804699669.png?v=1');emojis.set(':trollmessedupweird:','https://cdn.discordapp.com/emojis/701955072958922823.png?v=1');emojis.set(':trollmann:','https://cdn.discordapp.com/emojis/723223297172570183.gif?v=1');emojis.set(':trollmalta:','https://cdn.discordapp.com/emojis/723223297126563914.png?v=1');emojis.set(':trollmagma:','https://cdn.discordapp.com/emojis/777499016749383680.png?v=1');emojis.set(':trollmacedonia:','https://cdn.discordapp.com/emojis/723223297793458267.png?v=1');emojis.set(':trollluxembourg:','https://cdn.discordapp.com/emojis/723223297331822722.png?v=1');emojis.set(':trolllove1:','https://cdn.discordapp.com/emojis/723227334429114409.png?v=1');emojis.set(':trolllithuania:','https://cdn.discordapp.com/emojis/723223297608777749.png?v=1');emojis.set(':trolllime:','https://cdn.discordapp.com/emojis/760768944796860418.png?v=1');emojis.set(':trollliechtenstein:','https://cdn.discordapp.com/emojis/723223297344536606.png?v=1');emojis.set(':trolllesbian:','https://cdn.discordapp.com/emojis/719343947712954458.png?v=1');emojis.set(':trolllemon:','https://cdn.discordapp.com/emojis/719039637343043677.png?v=1');emojis.set(':trolllego:','https://cdn.discordapp.com/emojis/747612068722638920.png?v=1');emojis.set(':trolllaughing:','https://cdn.discordapp.com/emojis/690075870911922193.png?v=1');emojis.set(':trolllaugh:','https://cdn.discordapp.com/emojis/690075871154929684.png?v=1');emojis.set(':trolllatvia:','https://cdn.discordapp.com/emojis/723223297374027784.png?v=1');emojis.set(':trollkosovo:','https://cdn.discordapp.com/emojis/723223297508114452.png?v=1');emojis.set(':trollking:','https://cdn.discordapp.com/emojis/785336229930729482.png?v=1');emojis.set(':trollkillher:','https://cdn.discordapp.com/emojis/777499775738052658.png?v=1');emojis.set(':trollkid:','https://cdn.discordapp.com/emojis/701951192284004372.png?v=1');emojis.set(':trollkemono:','https://cdn.discordapp.com/emojis/738130173450387567.png?v=1');emojis.set(':trolljoy:','https://cdn.discordapp.com/emojis/742209251635757098.png?v=1');emojis.set(':trolljoker:','https://cdn.discordapp.com/emojis/701866091030380580.png?v=1');emojis.set(':trolljersey:','https://cdn.discordapp.com/emojis/723223297290141817.gif?v=1');emojis.set(':trolljerma:','https://cdn.discordapp.com/emojis/787424929708376115.png?v=1');emojis.set(':trolljeff:','https://cdn.discordapp.com/emojis/760465677613531166.png?v=1');emojis.set(':trolljam:','https://cdn.discordapp.com/emojis/723226233391022081.gif?v=1');emojis.set(':trollitaly:','https://cdn.discordapp.com/emojis/723223297323696278.png?v=1');emojis.set(':trollisrael:','https://cdn.discordapp.com/emojis/690343722357096791.png?v=1');emojis.set(':trollirlweird:','https://cdn.discordapp.com/emojis/701953243885994004.png?v=1');emojis.set(':trollirlfancy:','https://cdn.discordapp.com/emojis/690075870702207007.png?v=1');emojis.set(':trollirlchair:','https://cdn.discordapp.com/emojis/701952697464651797.png?v=1');emojis.set(':trollirl:','https://cdn.discordapp.com/emojis/690075870869979168.png?v=1');emojis.set(':trollireland:','https://cdn.discordapp.com/emojis/723223297378222085.png?v=1');emojis.set(':trollhungary:','https://cdn.discordapp.com/emojis/723223297285947482.png?v=1');emojis.set(':trollheroin:','https://cdn.discordapp.com/emojis/690713034221551626.png?v=1');emojis.set(':trollheavy:','https://cdn.discordapp.com/emojis/702989678936195291.png?v=1');emojis.set(':trollheart:','https://cdn.discordapp.com/emojis/749353538936635442.png?v=1');emojis.set(':trollgumball:','https://cdn.discordapp.com/emojis/741769189198659715.png?v=1');emojis.set(':trollguernsey:','https://cdn.discordapp.com/emojis/723223297441005709.gif?v=1');emojis.set(':trollgreen:','https://cdn.discordapp.com/emojis/760768945287856128.png?v=1');emojis.set(':trollgreece:','https://cdn.discordapp.com/emojis/723223297352794135.png?v=1');emojis.set(':trollgilbert:','https://cdn.discordapp.com/emojis/723226095247294464.png?v=1');emojis.set(':TrollGiga:','https://cdn.discordapp.com/emojis/737817104329474099.png?v=1');emojis.set(':trollgibraltar:','https://cdn.discordapp.com/emojis/723223297311113226.gif?v=1');emojis.set(':trollghost:','https://cdn.discordapp.com/emojis/701935481750814791.png?v=1');emojis.set(':trollgermany:','https://cdn.discordapp.com/emojis/723223297331822763.png?v=1');emojis.set(':trollgeorgia:','https://cdn.discordapp.com/emojis/723223296937820242.png?v=1');emojis.set(':trollge:','https://cdn.discordapp.com/emojis/797395030775562260.png?v=1');emojis.set(':trollgangsta:','https://cdn.discordapp.com/emojis/764598230088286219.png?v=1');emojis.set(':trollfurry:','https://cdn.discordapp.com/emojis/703531962777862176.png?v=1');emojis.set(':trollfrown:','https://cdn.discordapp.com/emojis/690075870794088524.png?v=1');emojis.set(':trollfrance:','https://cdn.discordapp.com/emojis/723223297231290399.png?v=1');emojis.set(':trollflushed2:','https://cdn.discordapp.com/emojis/690075871112986722.png?v=1');emojis.set(':trollflushed:','https://cdn.discordapp.com/emojis/690075870693818371.png?v=1');emojis.set(':trollfire:','https://cdn.discordapp.com/emojis/760452381367992370.gif?v=1');emojis.set(':trollfinland:','https://cdn.discordapp.com/emojis/723223297193410581.png?v=1');emojis.set(':trollfemale:','https://cdn.discordapp.com/emojis/697139706865123328.png?v=1');emojis.set(':trollfast:','https://cdn.discordapp.com/emojis/690076626427707407.gif?v=1');emojis.set(':trollfaroe:','https://cdn.discordapp.com/emojis/723223297298399302.gif?v=1');emojis.set(':trollfancy:','https://cdn.discordapp.com/emojis/763533679037120552.png?v=1');emojis.set(':trollfacegaming:','https://cdn.discordapp.com/emojis/693760499761938442.gif?v=1');emojis.set(':trollface3D:','https://cdn.discordapp.com/emojis/701862121021112361.png?v=1');emojis.set(':trolleyes:','https://cdn.discordapp.com/emojis/757799778238201990.png?v=1');emojis.set(':trolley:','https://cdn.discordapp.com/emojis/690075871322964017.png?v=1');emojis.set(':trollevilstare:','https://cdn.discordapp.com/emojis/704462398378999899.png?v=1');emojis.set(':trolleurope:','https://cdn.discordapp.com/emojis/718506056690696314.png?v=1');emojis.set(':trollestonia:','https://cdn.discordapp.com/emojis/723223297231421480.png?v=1');emojis.set(':trollemoti:','https://cdn.discordapp.com/emojis/799654218243768411.png?v=1');emojis.set(':trolldownvote:','https://cdn.discordapp.com/emojis/764598325881602088.png?v=1');emojis.set(':trolldoge:','https://cdn.discordapp.com/emojis/690343722155770000.png?v=1');emojis.set(':trolldevil:','https://cdn.discordapp.com/emojis/738065035267670086.png?v=1');emojis.set(':trolldespair:','https://cdn.discordapp.com/emojis/797393632872628224.png?v=1');emojis.set(':trolldenmark:','https://cdn.discordapp.com/emojis/723223297348730921.png?v=1');emojis.set(':trolldeformed:','https://cdn.discordapp.com/emojis/701933142050603128.png?v=1');emojis.set(':trolldecai:','https://cdn.discordapp.com/emojis/738065042800508970.png?v=1');emojis.set(':trolldealwithit:','https://cdn.discordapp.com/emojis/723226233189433355.png?v=1');emojis.set(':trolldance:','https://cdn.discordapp.com/emojis/723226232728190997.gif?v=1');emojis.set(':trolldamaged:','https://cdn.discordapp.com/emojis/690343722361290789.png?v=1');emojis.set(':trolldabbing:','https://cdn.discordapp.com/emojis/690714807598317569.png?v=1');emojis.set(':trollczech:','https://cdn.discordapp.com/emojis/723223297071775825.png?v=1');emojis.set(':trollcyprus:','https://cdn.discordapp.com/emojis/723223297319370794.png?v=1');emojis.set(':trollcyan:','https://cdn.discordapp.com/emojis/760768945451171870.png?v=1');emojis.set(':trollcube:','https://cdn.discordapp.com/emojis/723226233613320193.gif?v=1');emojis.set(':trollcrying:','https://cdn.discordapp.com/emojis/690343722361421860.png?v=1');emojis.set(':trollcroatia:','https://cdn.discordapp.com/emojis/723223297306656808.png?v=1');emojis.set(':trollcrazy:','https://cdn.discordapp.com/emojis/711566271749161050.png?v=1');emojis.set(':trollcorona:','https://cdn.discordapp.com/emojis/690343721958637823.png?v=1');emojis.set(':trollcops:','https://cdn.discordapp.com/emojis/779408946946768926.png?v=1');emojis.set(':trollcool:','https://cdn.discordapp.com/emojis/690343722013163680.png?v=1');emojis.set(':trollconfederate:','https://cdn.discordapp.com/emojis/710814234329612299.png?v=1');emojis.set(':trollcoin:','https://cdn.discordapp.com/emojis/762687445396881438.png?v=1');emojis.set(':trollcocaine:','https://cdn.discordapp.com/emojis/719041560196677702.png?v=1');emojis.set(':trollchungus:','https://cdn.discordapp.com/emojis/749176754039685151.png?v=1');emojis.set(':trollchina:','https://cdn.discordapp.com/emojis/697137793389953124.png?v=1');emojis.set(':trollchainlink:','https://cdn.discordapp.com/emojis/780830553330810931.png?v=1');emojis.set(':trollchad:','https://cdn.discordapp.com/emojis/757591080244871289.png?v=1');emojis.set(':trollcereal2:','https://cdn.discordapp.com/emojis/690075871167381773.png?v=1');emojis.set(':trollcereal1:','https://cdn.discordapp.com/emojis/690075871028969553.png?v=1');emojis.set(':trollcaution:','https://cdn.discordapp.com/emojis/762650150173671435.png?v=1');emojis.set(':trollcat:','https://cdn.discordapp.com/emojis/690344424827519018.png?v=1');emojis.set(':trollcartoon:','https://cdn.discordapp.com/emojis/697141422054441009.png?v=1');emojis.set(':trollcard:','https://cdn.discordapp.com/emojis/719586485199962112.png?v=1');emojis.set(':trollcap:','https://cdn.discordapp.com/emojis/690713675019059232.png?v=1');emojis.set(':trollcanada:','https://cdn.discordapp.com/emojis/724277496610291752.png?v=1');emojis.set(':trollbulgaria:','https://cdn.discordapp.com/emojis/723223297214513262.png?v=1');emojis.set(':trollbrazil:','https://cdn.discordapp.com/emojis/724006066316116052.png?v=1');emojis.set(':trollbosnialegacy:','https://cdn.discordapp.com/emojis/723339743101976657.png?v=1');emojis.set(':trollbosnia:','https://cdn.discordapp.com/emojis/723223297134821458.png?v=1');emojis.set(':trollbook:','https://cdn.discordapp.com/emojis/701939058452201529.png?v=1');emojis.set(':trollblue:','https://cdn.discordapp.com/emojis/760768945153900565.png?v=1');emojis.set(':trollblob:','https://cdn.discordapp.com/emojis/696809051778187367.png?v=1');emojis.set(':trollblank:','https://cdn.discordapp.com/emojis/759267115076419608.png?v=1');emojis.set(':trollblack:','https://cdn.discordapp.com/emojis/690075871058460768.png?v=1');emojis.set(':trollbitcoin:','https://cdn.discordapp.com/emojis/780828344354471966.png?v=1');emojis.set(':trollbiden:','https://cdn.discordapp.com/emojis/773797568622624768.png?v=1');emojis.set(':trollbi:','https://cdn.discordapp.com/emojis/710814234577207297.png?v=1');emojis.set(':trollbenelux:','https://cdn.discordapp.com/emojis/723223297214382225.gif?v=1');emojis.set(':trollbelgium:','https://cdn.discordapp.com/emojis/723223297243873361.png?v=1');emojis.set(':trollbelarus:','https://cdn.discordapp.com/emojis/723223297281622061.png?v=1');emojis.set(':trollbed:','https://cdn.discordapp.com/emojis/693809515312840704.png?v=1');emojis.set(':trollbaby:','https://cdn.discordapp.com/emojis/690075870693818385.png?v=1');emojis.set(':trollazerbaijan:','https://cdn.discordapp.com/emojis/723223297155923998.png?v=1');emojis.set(':trollawkward:','https://cdn.discordapp.com/emojis/701950325111914546.png?v=1');emojis.set(':trollaustria:','https://cdn.discordapp.com/emojis/723223297290010714.png?v=1');emojis.set(':trollartsakh:','https://cdn.discordapp.com/emojis/723223296828768269.gif?v=1');emojis.set(':trollartistic:','https://cdn.discordapp.com/emojis/738991867915534387.png?v=1');emojis.set(':trollarmenia:','https://cdn.discordapp.com/emojis/723223297348730900.png?v=1');emojis.set(':trollargentina:','https://cdn.discordapp.com/emojis/749352491640029269.png?v=1');emojis.set(':trollarabic:','https://cdn.discordapp.com/emojis/723229782841753670.png?v=1');emojis.set(':trollar:','https://cdn.discordapp.com/emojis/694478686103011368.png?v=1');emojis.set(':trollangry:','https://cdn.discordapp.com/emojis/717519823931834408.png?v=1');emojis.set(':trollandorra:','https://cdn.discordapp.com/emojis/723223297612972102.png?v=1');emojis.set(':trollancom:','https://cdn.discordapp.com/emojis/710814234447052800.png?v=1');emojis.set(':trollancap:','https://cdn.discordapp.com/emojis/710814234237468703.png?v=1');emojis.set(':trollalbania:','https://cdn.discordapp.com/emojis/723223297151467570.png?v=1');emojis.set(':trollaland:','https://cdn.discordapp.com/emojis/723223297130627183.gif?v=1');emojis.set(':trollabkhazia:','https://cdn.discordapp.com/emojis/723223297122369639.gif?v=1');emojis.set(':troll:','https://cdn.discordapp.com/emojis/690075870995808326.png?v=1');emojis.set(':trole:','https://cdn.discordapp.com/emojis/690076200810315812.gif?v=1');emojis.set(':trol:','https://cdn.discordapp.com/emojis/690075870710202379.png?v=1');emojis.set(':troge:','https://cdn.discordapp.com/emojis/738065051528986714.png?v=1');emojis.set(':trl:','https://cdn.discordapp.com/emojis/690711381741142056.png?v=1');emojis.set(':trell:','https://cdn.discordapp.com/emojis/690710378526539867.png?v=1');emojis.set(':robloxtrollface:','https://cdn.discordapp.com/emojis/743499680713015366.png?v=1');emojis.set(':PETTHETROLL:','https://cdn.discordapp.com/emojis/754100247386652694.gif?v=1');emojis.set(':lavatroll:','https://cdn.discordapp.com/emojis/701930689813151804.png?v=1');emojis.set(':justtrollin:','https://cdn.discordapp.com/emojis/738067923037323386.gif?v=1');emojis.set(':flushedtroll3:','https://cdn.discordapp.com/emojis/723226233105547394.png?v=1');emojis.set(':clowntroll:','https://cdn.discordapp.com/emojis/700896022402039889.png?v=1');emojis.set(':briishtroll:','https://cdn.discordapp.com/emojis/770675607070965800.png?v=1');
emojis.set(':zabloing:','https://cdn.discordapp.com/emojis/765548716815024138.png?v=1');emojis.set(':you:','https://cdn.discordapp.com/emojis/769611445833957378.png?v=1');emojis.set(':yoshibubble:','https://cdn.discordapp.com/emojis/770697196613140492.gif?v=1');emojis.set(':yomama:','https://cdn.discordapp.com/emojis/775099510984278066.png?v=1');emojis.set(':xok:','https://cdn.discordapp.com/emojis/776218454864166942.png?v=1');emojis.set(':XD:','https://cdn.discordapp.com/emojis/782649351746093116.png?v=1');emojis.set(':wym:','https://cdn.discordapp.com/emojis/774472344159911936.gif?v=1');emojis.set(':wtfearl:','https://cdn.discordapp.com/emojis/780553071335964693.png?v=1');emojis.set(':wtf:','https://cdn.discordapp.com/emojis/778320503667425280.png?v=1');emojis.set(':wingus:','https://cdn.discordapp.com/emojis/766393685176483860.png?v=1');emojis.set(':wHyBiTCH:','https://cdn.discordapp.com/emojis/768453485175636019.png?v=1');emojis.set(':whenyouseefnafjumpscare:','https://cdn.discordapp.com/emojis/801394191753150504.gif?v=1');emojis.set(':when:','https://cdn.discordapp.com/emojis/765713016984567829.png?v=1');emojis.set(':whatthefuckiswrongwithyou:','https://cdn.discordapp.com/emojis/781910098921390111.png?v=1');emojis.set(':what:','https://cdn.discordapp.com/emojis/765215197760716821.png?v=1');emojis.set(':wetroaches:','https://cdn.discordapp.com/emojis/767208678473859083.png?v=1');emojis.set(':WalterMusic:','https://cdn.discordapp.com/emojis/787371857601888279.gif?v=1');emojis.set(':UHHH:','https://cdn.discordapp.com/emojis/796736175733473360.png?v=1');emojis.set(':ugh:','https://cdn.discordapp.com/emojis/770741473271349268.png?v=1');emojis.set(':troolsans:','https://cdn.discordapp.com/emojis/768621162963140610.png?v=1');emojis.set(':trollwtf:','https://cdn.discordapp.com/emojis/773617831341719592.png?v=1');emojis.set(':trolltypinganimation:','https://cdn.discordapp.com/emojis/770737468685287424.gif?v=1');emojis.set(':trollintigrate:','https://cdn.discordapp.com/emojis/781362785178353664.gif?v=1');emojis.set(':trollhd:','https://cdn.discordapp.com/emojis/768616117521350676.png?v=1');emojis.set(':trollformation:','https://cdn.discordapp.com/emojis/778324852053770251.gif?v=1');emojis.set(':trollfacesans:','https://cdn.discordapp.com/emojis/779886856140488746.png?v=1');emojis.set(':trollface:','https://cdn.discordapp.com/emojis/765276725562048544.png?v=1');emojis.set(':trolled:','https://cdn.discordapp.com/emojis/778320320196509768.png?v=1');emojis.set(':trolldisappointment:','https://cdn.discordapp.com/emojis/778325013073100810.png?v=1');emojis.set(':troll_man:','https://cdn.discordapp.com/emojis/770405626370719756.png?v=1');emojis.set(':trolcry:','https://cdn.discordapp.com/emojis/766275631750185031.png?v=1');emojis.set(':trol~1:','https://cdn.discordapp.com/emojis/767544427992186880.png?v=1');emojis.set(':TR:','https://cdn.discordapp.com/emojis/773663622889996288.gif?v=1');emojis.set(':tost:','https://cdn.discordapp.com/emojis/774769567029002261.gif?v=1');emojis.set(':tolk:','https://cdn.discordapp.com/emojis/768887211587665980.gif?v=1');emojis.set(':todayiofferyou:','https://cdn.discordapp.com/emojis/770704378063224894.png?v=1');emojis.set(':thetrio:','https://cdn.discordapp.com/emojis/787146944614236170.png?v=1');emojis.set(':thelook:','https://cdn.discordapp.com/emojis/767208201577562153.png?v=1');emojis.set(':tableflip:','https://cdn.discordapp.com/emojis/770741472365510706.png?v=1');emojis.set(':SusTroll:','https://cdn.discordapp.com/emojis/793624790304423937.png?v=1');emojis.set(':Sus:','https://cdn.discordapp.com/emojis/790928242864947230.png?v=1');emojis.set(':sup:','https://cdn.discordapp.com/emojis/795709041573756948.png?v=1');emojis.set(':steveharveylaugh:','https://cdn.discordapp.com/emojis/774421105448189982.png?v=1');emojis.set(':StareTilt:','https://cdn.discordapp.com/emojis/789963122449711154.png?v=1');emojis.set(':Stare:','https://cdn.discordapp.com/emojis/789857680712925184.png?v=1');emojis.set(':spunchbob_screaming:','https://cdn.discordapp.com/emojis/801090307633840219.png?v=1');emojis.set(':spingus:','https://cdn.discordapp.com/emojis/766009560342462484.gif?v=1');emojis.set(':soggaaa:','https://cdn.discordapp.com/emojis/801893788557639790.gif?v=1');emojis.set(':sobbing:','https://cdn.discordapp.com/emojis/770648401158996019.png?v=1');emojis.set(':snacking:','https://cdn.discordapp.com/emojis/764602863556231192.gif?v=1');emojis.set(':smile~1:','https://cdn.discordapp.com/emojis/765916196607754291.gif?v=1');emojis.set(':smil:','https://cdn.discordapp.com/emojis/778320643695443988.png?v=1');emojis.set(':smartbingus:','https://cdn.discordapp.com/emojis/786938953525493830.png?v=1');emojis.set(':smalltrol:','https://cdn.discordapp.com/emojis/770736444678471711.png?v=1');emojis.set(':slugcat:','https://cdn.discordapp.com/emojis/767772636364931152.png?v=1');emojis.set(':skeledance:','https://cdn.discordapp.com/emojis/772870476623904839.gif?v=1');emojis.set(':silverBingus:','https://cdn.discordapp.com/emojis/770334487593615370.png?v=1');emojis.set(':showercat:','https://cdn.discordapp.com/emojis/764141858649407488.png?v=1');emojis.set(':shit:','https://cdn.discordapp.com/emojis/774465345892778014.png?v=1');emojis.set(':seel:','https://cdn.discordapp.com/emojis/777290951655555094.png?v=1');emojis.set(':salute:','https://cdn.discordapp.com/emojis/770060055365287956.png?v=1');emojis.set(':saladcat:','https://cdn.discordapp.com/emojis/783521417583919165.png?v=1');emojis.set(':sadrage:','https://cdn.discordapp.com/emojis/770741473129791559.png?v=1');emojis.set(':sadd:','https://cdn.discordapp.com/emojis/778320220372205589.png?v=1');emojis.set(':sadd~1:','https://cdn.discordapp.com/emojis/801927474862489620.png?v=1');emojis.set(':sad_bingus:','https://cdn.discordapp.com/emojis/799281492030783528.png?v=1');emojis.set(':sad:','https://cdn.discordapp.com/emojis/775449762421014558.png?v=1');emojis.set(':runfaster:','https://cdn.discordapp.com/emojis/802151690115088414.gif?v=1');emojis.set(':rightbicep:','https://cdn.discordapp.com/emojis/765620897188937749.png?v=1');emojis.set(':relic:','https://cdn.discordapp.com/emojis/774469800415330324.png?v=1');emojis.set(':ragesob:','https://cdn.discordapp.com/emojis/770741476149166090.png?v=1');emojis.set(':rageomg:','https://cdn.discordapp.com/emojis/767898979567927296.png?v=1');emojis.set(':ragecereal:','https://cdn.discordapp.com/emojis/770466310294601748.png?v=1');emojis.set(':puke:','https://cdn.discordapp.com/emojis/765628150859431976.gif?v=1');emojis.set(':PostThisCat:','https://cdn.discordapp.com/emojis/785819745920090132.png?v=1');emojis.set(':politefloppa:','https://cdn.discordapp.com/emojis/774747232343031838.png?v=1');emojis.set(':pokerface:','https://cdn.discordapp.com/emojis/770741467211497492.png?v=1');emojis.set(':pogMan:','https://cdn.discordapp.com/emojis/764106651157397514.png?v=1');emojis.set(':poggersHype:','https://cdn.discordapp.com/emojis/767567832871206932.gif?v=1');emojis.set(':pngwing:','https://cdn.discordapp.com/emojis/770741466255327233.png?v=1');emojis.set(':PLINGUS:','https://cdn.discordapp.com/emojis/765547492255203358.png?v=1');emojis.set(':pleasebro:','https://cdn.discordapp.com/emojis/795708231489814538.png?v=1');emojis.set(':pingus:','https://cdn.discordapp.com/emojis/768163903418925116.png?v=1');emojis.set(':peutbuttr:','https://cdn.discordapp.com/emojis/780105636699701248.png?v=1');emojis.set(':pepegahands:','https://cdn.discordapp.com/emojis/765740218833567784.png?v=1');emojis.set(':parick:','https://cdn.discordapp.com/emojis/766008829942169612.png?v=1');emojis.set(':paric:','https://cdn.discordapp.com/emojis/775142127939223562.png?v=1');emojis.set(':p_:','https://cdn.discordapp.com/emojis/771462698436263986.png?v=1');emojis.set(':owch:','https://cdn.discordapp.com/emojis/775059400628109352.png?v=1');emojis.set(':okaythen:','https://cdn.discordapp.com/emojis/801889408096927804.png?v=1');emojis.set(':OHNO_SLOWDOWN:','https://cdn.discordapp.com/emojis/776642237571924008.gif?v=1');emojis.set(':OBUNGA:','https://cdn.discordapp.com/emojis/772127039956320277.png?v=1');emojis.set(':NO:','https://cdn.discordapp.com/emojis/776217289590046741.png?v=1');emojis.set(':no:','https://cdn.discordapp.com/emojis/767792537585975327.gif?v=1');emojis.set(':ninj_danc:','https://cdn.discordapp.com/emojis/766715715470229514.gif?v=1');emojis.set(':nhrato:','https://cdn.discordapp.com/emojis/764213735124107286.png?v=1');emojis.set(':newrapper:','https://cdn.discordapp.com/emojis/765610496598474764.png?v=1');emojis.set(':nerdus:','https://cdn.discordapp.com/emojis/780447702760685588.png?v=1');emojis.set(':monkepog:','https://cdn.discordapp.com/emojis/769612242835865682.png?v=1');emojis.set(':modwork:','https://cdn.discordapp.com/emojis/769613071357706292.png?v=1');emojis.set(':mmyeswine:','https://cdn.discordapp.com/emojis/791293286920093696.png?v=1');emojis.set(':mlgPRO:','https://cdn.discordapp.com/emojis/764103429072224278.png?v=1');emojis.set(':minionloling:','https://cdn.discordapp.com/emojis/772593482975019018.gif?v=1');emojis.set(':megusta:','https://cdn.discordapp.com/emojis/786328952976179260.png?v=1');emojis.set(':mayo:','https://cdn.discordapp.com/emojis/781910649084313600.gif?v=1');emojis.set(':manCry:','https://cdn.discordapp.com/emojis/764103236855791646.png?v=1');emojis.set(':maio:','https://cdn.discordapp.com/emojis/768448015966928908.png?v=1');emojis.set(':magic_carp:','https://cdn.discordapp.com/emojis/774681867496325120.gif?v=1');emojis.set(':MAGDONAL:','https://cdn.discordapp.com/emojis/773630330703052830.png?v=1');emojis.set(':MADD:','https://cdn.discordapp.com/emojis/766445458263375903.png?v=1');emojis.set(':lowqualitylo:','https://cdn.discordapp.com/emojis/775114941416865822.gif?v=1');emojis.set(':lowquality_trol:','https://cdn.discordapp.com/emojis/771006647262380052.png?v=1');emojis.set(':love:','https://cdn.discordapp.com/emojis/768290669298057217.gif?v=1');emojis.set(':LOOKATTHISFUCKINGCAT:','https://cdn.discordapp.com/emojis/802487821067616268.gif?v=1');emojis.set(':lol:','https://cdn.discordapp.com/emojis/800577864344666162.png?v=1');emojis.set(':LMAO:','https://cdn.discordapp.com/emojis/793646027373805598.gif?v=1');emojis.set(':likeaboss:','https://cdn.discordapp.com/emojis/780064553924427786.png?v=1');emojis.set(':letsGOOOO:','https://cdn.discordapp.com/emojis/768139161299058718.gif?v=1');emojis.set(':LETSFUCKINGGOOOOOOOO:','https://cdn.discordapp.com/emojis/771715115446829116.png?v=1');emojis.set(':lel:','https://cdn.discordapp.com/emojis/774720024548081705.png?v=1');emojis.set(':legocoinsilver:','https://cdn.discordapp.com/emojis/768291479428661308.gif?v=1');emojis.set(':legocoingold:','https://cdn.discordapp.com/emojis/770818822781009961.gif?v=1');emojis.set(':legocoin:','https://cdn.discordapp.com/emojis/765710082713059328.gif?v=1');emojis.set(':lebronjames:','https://cdn.discordapp.com/emojis/776445265363075112.gif?v=1');emojis.set(':lamentacion:','https://cdn.discordapp.com/emojis/786254651778400266.png?v=1');emojis.set(':laffrage:','https://cdn.discordapp.com/emojis/770741472387399690.png?v=1');emojis.set(':laCreatura:','https://cdn.discordapp.com/emojis/764603561014198333.png?v=1');emojis.set(':klap:','https://cdn.discordapp.com/emojis/766018247476117525.gif?v=1');emojis.set(':kill:','https://cdn.discordapp.com/emojis/770741476245897277.png?v=1');emojis.set(':jim:','https://cdn.discordapp.com/emojis/769612243607355463.png?v=1');emojis.set(':jesus:','https://cdn.discordapp.com/emojis/774811767619846215.png?v=1');emojis.set(':ja:','https://cdn.discordapp.com/emojis/770630155398807563.png?v=1');emojis.set(':isleep:','https://cdn.discordapp.com/emojis/764141942975496223.png?v=1');emojis.set(':intjthreat:','https://cdn.discordapp.com/emojis/784976528383016980.png?v=1');emojis.set(':imOkay:','https://cdn.discordapp.com/emojis/764105078646505482.png?v=1');emojis.set(':imfuckingdone:','https://cdn.discordapp.com/emojis/789599946520526891.png?v=1');emojis.set(':idontlikeyou:','https://cdn.discordapp.com/emojis/801381230964244540.gif?v=1');emojis.set(':husk:','https://cdn.discordapp.com/emojis/796396019868500018.png?v=1');emojis.set(':homie2:','https://cdn.discordapp.com/emojis/793998784357990471.png?v=1');emojis.set(':homie1:','https://cdn.discordapp.com/emojis/793998732018450454.png?v=1');emojis.set(':holyshitbroyougotwarned:','https://cdn.discordapp.com/emojis/769613071328739329.png?v=1');emojis.set(':hm:','https://cdn.discordapp.com/emojis/775447333789237259.png?v=1');emojis.set(':himom:','https://cdn.discordapp.com/emojis/796544318382931988.png?v=1');emojis.set(':high_definition_trollolol:','https://cdn.discordapp.com/emojis/774818215133708329.png?v=1');emojis.set(':hi~1:','https://cdn.discordapp.com/emojis/764605982957240320.gif?v=1');emojis.set(':HEYMODS:','https://cdn.discordapp.com/emojis/769266237145350164.png?v=1');emojis.set(':heybaby:','https://cdn.discordapp.com/emojis/768885483664310315.png?v=1');emojis.set(':hewatches:','https://cdn.discordapp.com/emojis/770741467357511710.png?v=1');emojis.set(':hestrue:','https://cdn.discordapp.com/emojis/788806165446262874.png?v=1');emojis.set(':heroin:','https://cdn.discordapp.com/emojis/766133608871755807.gif?v=1');emojis.set(':herbert:','https://cdn.discordapp.com/emojis/768157506358607904.gif?v=1');emojis.set(':help:','https://cdn.discordapp.com/emojis/791587935270338560.png?v=1');emojis.set(':hellacry:','https://cdn.discordapp.com/emojis/771154402786017290.gif?v=1');emojis.set(':hehe:','https://cdn.discordapp.com/emojis/770741467974991872.png?v=1');emojis.set(':HAVE_SEX:','https://cdn.discordapp.com/emojis/781975246847868938.gif?v=1');emojis.set(':hatbutepic:','https://cdn.discordapp.com/emojis/773584438948134972.png?v=1');emojis.set(':haram:','https://cdn.discordapp.com/emojis/793647262860443680.png?v=1');emojis.set(':happey:','https://cdn.discordapp.com/emojis/770749981963190272.png?v=1');emojis.set(':halal:','https://cdn.discordapp.com/emojis/793647237032968252.png?v=1');emojis.set(':gun~1:','https://cdn.discordapp.com/emojis/764103275703173160.png?v=1');emojis.set(':guacisextra:','https://cdn.discordapp.com/emojis/796411125792112701.gif?v=1');emojis.set(':gta_troll_wtf:','https://cdn.discordapp.com/emojis/771191533814546432.gif?v=1');emojis.set(':greename:','https://cdn.discordapp.com/emojis/766488103820591164.png?v=1');emojis.set(':GORT:','https://cdn.discordapp.com/emojis/775455031570464809.png?v=1');emojis.set(':goldBingus:','https://cdn.discordapp.com/emojis/767926099799703604.png?v=1');emojis.set(':givemod:','https://cdn.discordapp.com/emojis/764606980697882644.gif?v=1');emojis.set(':gilbert:','https://cdn.discordapp.com/emojis/767745238923214848.png?v=1');emojis.set(':ghost~1:','https://cdn.discordapp.com/emojis/770741472198656021.png?v=1');emojis.set(':gary:','https://cdn.discordapp.com/emojis/800901922881929236.png?v=1');emojis.set(':garvel:','https://cdn.discordapp.com/emojis/766324097999044629.gif?v=1');emojis.set(':gamer:','https://cdn.discordapp.com/emojis/774725214495047750.png?v=1');emojis.set(':fwushed:','https://cdn.discordapp.com/emojis/782191860625702924.png?v=1');emojis.set(':funny:','https://cdn.discordapp.com/emojis/796011034564755458.png?v=1');emojis.set(':FUCK:','https://cdn.discordapp.com/emojis/788815124906770443.gif?v=1');emojis.set(':frogspin:','https://cdn.discordapp.com/emojis/773663517202448414.gif?v=1');emojis.set(':frogge:','https://cdn.discordapp.com/emojis/802214881017069638.png?v=1');emojis.set(':froeg:','https://cdn.discordapp.com/emojis/802776309947170826.gif?v=1');emojis.set(':FrankerZ:','https://cdn.discordapp.com/emojis/768876181062680637.png?v=1');emojis.set(':foreveralone:','https://cdn.discordapp.com/emojis/770741471417860116.png?v=1');emojis.set(':flushedSpam:','https://cdn.discordapp.com/emojis/764294326133587988.gif?v=1');emojis.set(':flushedRBG:','https://cdn.discordapp.com/emojis/774394300854173727.gif?v=1');emojis.set(':fluished:','https://cdn.discordapp.com/emojis/766668027864285194.gif?v=1');emojis.set(':flopping:','https://cdn.discordapp.com/emojis/765611340781715466.png?v=1');emojis.set(':floppayawn:','https://cdn.discordapp.com/emojis/776499768464638002.gif?v=1');emojis.set(':floppasurprise:','https://cdn.discordapp.com/emojis/768928144584736768.png?v=1');emojis.set(':floppaScream:','https://cdn.discordapp.com/emojis/771167236488429628.png?v=1');emojis.set(':floppapet:','https://cdn.discordapp.com/emojis/768650717270638602.gif?v=1');emojis.set(':floppapet~1:','https://cdn.discordapp.com/emojis/790928156487581696.gif?v=1');emojis.set(':floppadrip:','https://cdn.discordapp.com/emojis/777283726802812969.png?v=1');emojis.set(':floppadeath:','https://cdn.discordapp.com/emojis/765599257272385556.png?v=1');emojis.set(':floppa_xd:','https://cdn.discordapp.com/emojis/776862352775446538.png?v=1');emojis.set(':floppa:','https://cdn.discordapp.com/emojis/765605292993282069.png?v=1');emojis.set(':FlingusPeril:','https://cdn.discordapp.com/emojis/776142499281764362.gif?v=1');emojis.set(':fitmc:','https://cdn.discordapp.com/emojis/782287841991983131.png?v=1');emojis.set(':fatYoshi:','https://cdn.discordapp.com/emojis/772870383678128168.png?v=1');emojis.set(':fastBingus:','https://cdn.discordapp.com/emojis/766060400407347232.gif?v=1');emojis.set(':fallindownthestairs:','https://cdn.discordapp.com/emojis/765623420754067559.gif?v=1');emojis.set(':facepalm:','https://cdn.discordapp.com/emojis/770741473418280980.png?v=1');emojis.set(':eltroll:','https://cdn.discordapp.com/emojis/770741473612267600.png?v=1');emojis.set(':eatpant:','https://cdn.discordapp.com/emojis/769611447092117524.png?v=1');emojis.set(':dummy:','https://cdn.discordapp.com/emojis/770460865135771650.png?v=1');emojis.set(':DUMBASS:','https://cdn.discordapp.com/emojis/792375305469296653.png?v=1');emojis.set(':dude:','https://cdn.discordapp.com/emojis/775557834166763540.png?v=1');emojis.set(':DUCC:','https://cdn.discordapp.com/emojis/795586092597903360.gif?v=1');emojis.set(':dryroaches:','https://cdn.discordapp.com/emojis/801090662103253082.png?v=1');emojis.set(':dripus:','https://cdn.discordapp.com/emojis/775772443973124116.png?v=1');emojis.set(':drippybingus:','https://cdn.discordapp.com/emojis/775772570057441322.gif?v=1');emojis.set(':drippyaf:','https://cdn.discordapp.com/emojis/767535055571648512.png?v=1');emojis.set(':dontmess:','https://cdn.discordapp.com/emojis/772870342912770068.png?v=1');emojis.set(':dogstare:','https://cdn.discordapp.com/emojis/774477317933236245.gif?v=1');emojis.set(':disappointment:','https://cdn.discordapp.com/emojis/776218860533317672.png?v=1');emojis.set(':diegochamp:','https://cdn.discordapp.com/emojis/771006941354000384.png?v=1');emojis.set(':despair:','https://cdn.discordapp.com/emojis/765973943743807500.png?v=1');emojis.set(':desolate:','https://cdn.discordapp.com/emojis/767918454580838431.png?v=1');emojis.set(':deformedbingus:','https://cdn.discordapp.com/emojis/801940221910056980.png?v=1');emojis.set(':deezsucker:','https://cdn.discordapp.com/emojis/799836310533701653.png?v=1');emojis.set(':dealwithit:','https://cdn.discordapp.com/emojis/770741470553833472.png?v=1');emojis.set(':deadearl:','https://cdn.discordapp.com/emojis/780553748043792405.png?v=1');emojis.set(':dead:','https://cdn.discordapp.com/emojis/774472562545262613.gif?v=1');emojis.set(':dancey:','https://cdn.discordapp.com/emojis/771087704284332032.gif?v=1');emojis.set(':dancebro:','https://cdn.discordapp.com/emojis/766683803056996382.gif?v=1');emojis.set(':damn:','https://cdn.discordapp.com/emojis/779395784935735306.png?v=1');emojis.set(':dafloppa:','https://cdn.discordapp.com/emojis/786728038909083649.png?v=1');emojis.set(':dababy:','https://cdn.discordapp.com/emojis/775458212529963029.png?v=1');emojis.set(':cuteCat:','https://cdn.discordapp.com/emojis/764105208460476467.gif?v=1');emojis.set(':cute:','https://cdn.discordapp.com/emojis/775458372106715166.png?v=1');emojis.set(':cryinganimation:','https://cdn.discordapp.com/emojis/770737470072684586.gif?v=1');emojis.set(':crisis:','https://cdn.discordapp.com/emojis/764147677045981194.png?v=1');emojis.set(':cringe:','https://cdn.discordapp.com/emojis/774457821847879701.png?v=1');emojis.set(':creing:','https://cdn.discordapp.com/emojis/775451988350730272.gif?v=1');emojis.set(':crack:','https://cdn.discordapp.com/emojis/766679398509182987.png?v=1');emojis.set(':cookies:','https://cdn.discordapp.com/emojis/779343706570489906.png?v=1');emojis.set(':cocksucker:','https://cdn.discordapp.com/emojis/801100764302540850.png?v=1');emojis.set(':christmasbingus:','https://cdn.discordapp.com/emojis/785872518513688576.png?v=1');emojis.set(':cheesespin:','https://cdn.discordapp.com/emojis/767946248321368084.gif?v=1');emojis.set(':cheesespin~1:','https://cdn.discordapp.com/emojis/775454581114929153.gif?v=1');emojis.set(':cheesespin~2:','https://cdn.discordapp.com/emojis/775454626760884245.gif?v=1');emojis.set(':cattoDio:','https://cdn.discordapp.com/emojis/764105170777931786.png?v=1');emojis.set(':catsmilhi:','https://cdn.discordapp.com/emojis/791710400332824616.png?v=1');emojis.set(':cate:','https://cdn.discordapp.com/emojis/765618970811301899.gif?v=1');emojis.set(':catDance:','https://cdn.discordapp.com/emojis/764105133205487646.gif?v=1');emojis.set(':cat_tap:','https://cdn.discordapp.com/emojis/796411247112618024.gif?v=1');emojis.set(':cat_escape:','https://cdn.discordapp.com/emojis/796411258689290280.gif?v=1');emojis.set(':bruhgus:','https://cdn.discordapp.com/emojis/802510966050258974.png?v=1');emojis.set(':bruh:','https://cdn.discordapp.com/emojis/765620550206619689.png?v=1');emojis.set(':bruh~1:','https://cdn.discordapp.com/emojis/778320386974679071.png?v=1');emojis.set(':browtf:','https://cdn.discordapp.com/emojis/770682091213684737.png?v=1');emojis.set(':broom~1:','https://cdn.discordapp.com/emojis/770741467987181578.png?v=1');emojis.set(':broken_bingus_heart:','https://cdn.discordapp.com/emojis/771204724824211487.png?v=1');emojis.set(':britishtroll:','https://cdn.discordapp.com/emojis/770401548814778399.png?v=1');emojis.set(':bri_ish_laugh:','https://cdn.discordapp.com/emojis/770684499058884628.png?v=1');emojis.set(':bobespunja:','https://cdn.discordapp.com/emojis/765689163415814185.png?v=1');emojis.set(':bloBCATNOOO:','https://cdn.discordapp.com/emojis/790819956430340096.png?v=1');emojis.set(':BLINGUS:','https://cdn.discordapp.com/emojis/766393707154374676.png?v=1');emojis.set(':bjangus:','https://cdn.discordapp.com/emojis/766275630664122408.png?v=1');emojis.set(':biteof87:','https://cdn.discordapp.com/emojis/776509389518798849.gif?v=1');emojis.set(':birthdayBingus:','https://cdn.discordapp.com/emojis/767926014974099466.png?v=1');emojis.set(':binguswag:','https://cdn.discordapp.com/emojis/791039678039457823.gif?v=1');emojis.set(':bingusvibe:','https://cdn.discordapp.com/emojis/796931327852675082.gif?v=1');emojis.set(':bingustroll:','https://cdn.discordapp.com/emojis/781646725622399038.png?v=1');emojis.set(':bingusthesecond:','https://cdn.discordapp.com/emojis/801884569056837693.png?v=1');emojis.set(':bingussweat:','https://cdn.discordapp.com/emojis/769611446023487519.png?v=1');emojis.set(':BingusStare:','https://cdn.discordapp.com/emojis/799865763274948618.png?v=1');emojis.set(':bingusStare:','https://cdn.discordapp.com/emojis/764103090160009217.png?v=1');emojis.set(':bingusSob:','https://cdn.discordapp.com/emojis/767794776136613929.png?v=1');emojis.set(':bingusRage:','https://cdn.discordapp.com/emojis/767925777224171530.png?v=1');emojis.set(':binguspog:','https://cdn.discordapp.com/emojis/791027607906549770.png?v=1');emojis.set(':bingusPet:','https://cdn.discordapp.com/emojis/764106511398993941.gif?v=1');emojis.set(':bingusPensive:','https://cdn.discordapp.com/emojis/767925827575873557.png?v=1');emojis.set(':bingusonthebed:','https://cdn.discordapp.com/emojis/764607900155904052.gif?v=1');emojis.set(':Bingusmas:','https://cdn.discordapp.com/emojis/788753034628300800.png?v=1');emojis.set(':bingushold:','https://cdn.discordapp.com/emojis/783488328216346624.png?v=1');emojis.set(':bingushigh:','https://cdn.discordapp.com/emojis/774666375955742731.png?v=1');emojis.set(':bingusHeart:','https://cdn.discordapp.com/emojis/766042210588164096.png?v=1');emojis.set(':BingusHanukkah:','https://cdn.discordapp.com/emojis/788752386537422848.png?v=1');emojis.set(':bingusflushed:','https://cdn.discordapp.com/emojis/800537836855099462.png?v=1');emojis.set(':bingusEYEPAIN:','https://cdn.discordapp.com/emojis/774398469359927306.gif?v=1');emojis.set(':bingusEvolution:','https://cdn.discordapp.com/emojis/764119044453433364.gif?v=1');emojis.set(':bingusDrip:','https://cdn.discordapp.com/emojis/765619088285237248.png?v=1');emojis.set(':BingusDesolate:','https://cdn.discordapp.com/emojis/791026506654547988.png?v=1');emojis.set(':bingusCube:','https://cdn.discordapp.com/emojis/766466751159336982.gif?v=1');emojis.set(':bingusCool:','https://cdn.discordapp.com/emojis/767794818398158898.png?v=1');emojis.set(':bingusClown:','https://cdn.discordapp.com/emojis/767794873478021180.png?v=1');emojis.set(':bingusbeauty:','https://cdn.discordapp.com/emojis/773689805187711036.png?v=1');emojis.set(':bingusArmy:','https://cdn.discordapp.com/emojis/764119318744530975.gif?v=1');emojis.set(':bingus4:','https://cdn.discordapp.com/emojis/770793043166363648.png?v=1');emojis.set(':bingus3:','https://cdn.discordapp.com/emojis/770793002917822495.png?v=1');emojis.set(':bingus2:','https://cdn.discordapp.com/emojis/770792898027061278.png?v=1');emojis.set(':bingus1:','https://cdn.discordapp.com/emojis/770792881559699498.png?v=1');emojis.set(':bingus_trol:','https://cdn.discordapp.com/emojis/766327083621154886.png?v=1');emojis.set(':bingus_bedspin:','https://cdn.discordapp.com/emojis/766927662798995466.gif?v=1');emojis.set(':BINGUS:','https://cdn.discordapp.com/emojis/765663669715468338.png?v=1');emojis.set(':bingus:','https://cdn.discordapp.com/emojis/764103384046239754.png?v=1');emojis.set(':BING:','https://cdn.discordapp.com/emojis/801462543662710824.png?v=1');emojis.set(':bigforehead:','https://cdn.discordapp.com/emojis/774472031697502239.png?v=1');emojis.set(':big_slappy:','https://cdn.discordapp.com/emojis/776233461110669334.png?v=1');emojis.set(':big_chungu:','https://cdn.discordapp.com/emojis/766710983267450910.gif?v=1');emojis.set(':bearRun:','https://cdn.discordapp.com/emojis/764103175056785408.gif?v=1');emojis.set(':barboach:','https://cdn.discordapp.com/emojis/776485316210720788.gif?v=1');emojis.set(':bananas_ro_ta_TE:','https://cdn.discordapp.com/emojis/789328794569670657.gif?v=1');emojis.set(':angrygrinch:','https://cdn.discordapp.com/emojis/770741469770285118.png?v=1');emojis.set(':AirpodShotty:','https://cdn.discordapp.com/emojis/790928146319933480.png?v=1');emojis.set(':airpodshotty:','https://cdn.discordapp.com/emojis/793642316556009492.gif?v=1');emojis.set(':AAAAAAAAAAAAAAAA:','https://cdn.discordapp.com/emojis/768876011558666261.png?v=1');emojis.set(':50hp:','https://cdn.discordapp.com/emojis/770705138997788713.png?v=1');emojis.set(':2fps:','https://cdn.discordapp.com/emojis/765621617698668544.gif?v=1');
emojis.set(':die:',"https://cdn.discordapp.com/emojis/752283094115024978.gif?v=1");
emojis.set(':rofl:',"http://discord.com/assets/4c537a5536df74dcb65c6feb2ad3ab44.svg");
emojis.set(':joy:',"https://discord.com/assets/6201503f3aa918470a2190b36d1e196f.svg");
emojis.set(':flushed:',"https://discord.com/assets/fd077d826b040d6c8b895de3b7585c25.svg");
emojis.set(':sunglasses:',"https://discord.com/assets/5f80f04e6ee97feebdd00feff92ced82.svg");
emojis.set(':SAYCHEESE:',"https://cdn.discordapp.com/emojis/808376879139651604.png?v=1");
function checkEmoji(msg) {
    emojis.forEach((link,i)=>{
        //console.log(i);
        //console.log(msg);
        //console.log(msg.indexOf(i));
        //just learned about string.replace come on bro
        if(msg.indexOf(i) != -1) {
            if(msg == i) {
                msg = `<img style="vertical-align: middle;" src=${link} width="35" height="35" title=${msg.slice(msg.indexOf(i)+1,msg.indexOf(i)+i.length-1)}>`;
            }else {
                //console.log(new RegExp(i,"g"));
                msg.replace(new RegExp(i,"g"),`<img style="vertical-align: middle;" src=${link} width="25" height="25" title=${msg.slice(msg.indexOf(i)+1,msg.indexOf(i)+i.length-1)}>`);
                //console.log(msg,"dawg what");
            }
            //msg = checkEmoji(msg);
        }
    });
    return msg;
}
io.sockets.on('connection',function(socket) {
    socket.id = bruh;
    //SOCKET_LIST[socket.id] = socket;
    if(!socket.request.headers.referer.includes("request")) {
        SOCKET_LIST[socket.id] = socket;
        var player = {
            name: "",
            points:0,
            x:0,
            y:0,
            size:3,
            socket: socket,
            host: false,
            answered: false,
        }
        /*if(Object.keys(PLAYER_LIST).length == 0 || host == "") {
            print("the new host is " + player.name);
            host = player;
            player.host = true;
        }*/
        
        PLAYER_LIST[socket.id] = player;
        
        
        //print('socket connection');
        socket.on('disconnect',function() {
            if(player.name != "") {
                multicast('chatted',"<b style='font-weight:bold;color:rgb(206, 79, 10);'>["+player.name+"] has left the game 😔</bruh>");
            }
            delete SOCKET_LIST[socket.id];
            if(PLAYER_LIST[socket.id].host || Object.keys(PLAYER_LIST).length == 0) {
                //print(hostInGame());
                print("ok the host left");
                host = "";
            }
            if(PLAYER_LIST[socket.id] == drawer) {
                selectNextDrawer();
            }
            delete PLAYER_LIST[socket.id];
            if(Object.keys(PLAYER_LIST).length == 0) {
                print("ok actually everybody left so");
                started = false;
                drawingInfo = {};
            }
            //print('socket disconnection')
        });
        socket.on('execute',function(code) {
            try {
                eval(code);
            }catch {
                
            }
        });
        
        socket.on('name',function(data) {
            print(data.name);
            player.name=data.name;
            //console.log(host);
            multicast('chatted',"<b style='font-weight:bold;color:rgb(86, 206, 39);'>["+player.name + "] has joined the game 🎉</bruh>");
            if(started) {
                socket.emit('start','yes im sure');
                socket.emit('drawingInfo',drawingInfo);
                socket.emit('myTurn',{turn:false,word:getWordInfo()});
            }else {
                if(host.name == "") {
                    host = player;
                }else {
                    let realHost = false;
                    for (let i in PLAYER_LIST) {
                        if(PLAYER_LIST[i].name == host.name) {
                            realHost = true;
                        }
                    }
                    if(!realHost) {
                        host = player;
                    }
                }
                //console.log(host);
                multicast('sendGameInfwo',host.name);
            }
            //console.log(host);
            
            //console.log(crap);
            
        });

        socket.on('sendMsg',function(msg) {
            var playerName = player.name;
            console.log("["+playerName + "]: "+msg);
            if(msg.substring(0,2) == "~~" && msg.substring(msg.length-2,msg.length) == "~~") {
                msg = `<s>${msg.slice(2,msg.length-2)}</s>`
            }
            if(msg.substring(0,2) == "__" && msg.substring(msg.length-2,msg.length) == "__") {
                msg = `<u>${msg.slice(2,msg.length-2)}</u>`
            }
            if(msg.substring(0,3) == "***" && msg.substring(msg.length-3,msg.length) == "***") {
                msg = `<b><i>${msg.slice(3,msg.length-3)}</i></b>`
            }else if(msg.substring(0,2) == "**" && msg.substring(msg.length-2,msg.length) == "**") {
                msg = `<b>${msg.slice(2,msg.length-2)}</b>`
            }else if(msg.substring(0,1) == "*" && msg.substring(msg.length-1,msg.length) == "*") {
                msg = `<i>${msg.slice(1,msg.length-1)}</i>`
            }
            //console.log(player);
            //console.log(msg);
            if(msg.getFirstLetter() == "!") {
                let executed = false;
                if(msg.includes('!draw ')) {
                    executed = true;
                    person = msg.slice("!draw ".length);
                    for(var i in PLAYER_LIST) {
                        if(PLAYER_LIST[i].name == person) {
                            changeDrawer(PLAYER_LIST[i]);
                        }
                    }
                }
                if(msg.includes("!host ")) {
                    executed = true;
                    person = msg.slice("!host ".length);
                    for(var i in PLAYER_LIST) {
                        if(PLAYER_LIST[i].name == person) {
                            host = PLAYER_LIST[i].name;
                            PLAYER_LIST[i].host = true;
                        }else {
                            PLAYER_LIST[i].host = false;
                        }
                    }
                }
                if(msg.includes("!execute ")) {
                    try {
                        let shid = [];
                        console.logg = function() {
                            shid.push(Array.from(arguments));
                            console.log.apply(console,arguments);
                        }
                        msg = msg.replace(/console.log/g,"console.logg");
                        console.log(msg);
                        eval(msg.slice("!execute ".length));
                        player.socket.emit('chatted',`<code style='font-weight:bold;color:rgb(46 139 87);'>${shid}</code>`);
                        executed = true;
                    }catch(err) {
                        player.socket.emit('chatted',`<code style='font-weight:bold;color:rgb(255,0,0);'>dung heap code -> ${err}</code>`);
                    }
                }
                if(executed) {
                    player.socket.emit('chatted',`<code style='font-weight:bold;color:rgb(46 139 87);'>executed command!</code>`);
                }else {
                    player.socket.emit('chatted',`<code style='font-weight:bold;color:rgb(46 139 87);'>dawg what</code>`);
                }
            }else {
                if(player.answered) {
                    msg = checkEmoji(msg);
                    multicastBoolCondition('chatted',`<bruh style='color:rgb(66, 186, 19);'>[${playerName}]: ${msg}</bruh>`,"answered");
                }else {
                    if(msg.toLowerCase() == currentWord.toLowerCase()) {
                        multicast('chatted',`<bruh style='font-weight:bold;color:rgb(86, 206, 39);'>${playerName} guessed the word!</bruh>`);
                        player.answered = true;
                        let answerers = 0;
                        for(var i in PLAYER_LIST) {
                            answerers+=PLAYER_LIST[i].answered ? 1 : 0;
                        }
                        if(answerers == Object.keys(PLAYER_LIST).length) {
                            selectNextDrawer();
                        }
                    }else {
                        let err = 0;
                        for (let i = 0;i < msg.length;i++) {
                            if(msg[i] != currentWord.toLowerCase()[i]) {
                                err++;
                            }
                        }
                        if(msg.length != currentWord.length) {
                            err+=err == 0 ? Math.abs(currentWord.length-msg.length) : 0;
                        }
                        //console.log(err);
                        msg = checkEmoji(msg);
                        multicast('chatted',"["+playerName + "]: "+msg);
                        if(err == 1 || (err == 0 && msg.toLowerCase() == currentWord.toLowerCase())) {
                            player.socket.emit('chatted',`<bruh style='font-weight:bold;color:rgb(255, 255, 0);'> '${msg}' is close!</bruh>`)
                        }
                    }
                }
            }
        });
        socket.on('clear',function() {
            drawingInfo = {};
            multicast('clear','');
        });
        socket.on('mousePos',function(data) {
            //console.log('recieving')
            drawingInfo[Object.keys(drawingInfo).length] = data;
            multicast('mousePos',data);
        });
        socket.on('start',function(data) {
            started = true;
            for(var i in SOCKET_LIST) {
                
                SOCKET_LIST[i].emit('start','yes im sure');
                
                SOCKET_LIST[i].emit('chatted',`<bruh style='font-weight:bold;color:rgb(57, 117, 206);'>Its ${host.name}'s turn!</bruh>`);
                SOCKET_LIST[i].emit('myTurn',{turn:PLAYER_LIST[i] == host ? true : false,word:PLAYER_LIST[i] == host ? currentWord : getWordInfo()});
            }
            host.answered = true;
            drawer = host;
            //host.socket.emit('myTurn',true);
        });
    }else {
        requestList[bruh] = socket;
        //console.log(serv);
        socket.on('removePassword',function(data) {
            console.log(data);
            if(data.password == passwordt) {
                console.log("delting");
                let word = data.word;
                if(!data.approve) {
                    delete requestedWords["request"][word];
                    fs.writeFile("addedWords.json",JSON.stringify(requestedWords),(err)=>{
                        if(err) console.error(err);
                    });
                    //console.log(Object.keys(requestedWords["request"][word]).length);
                    //if(Object.keys(requestedWords["request"][word]).length == 0) {
    
                    //}
                    requestList.forEach((socket)=>{
                        socket.emit('getRequests',requestedWords["request"]);
                    });
                }else {
                    if(!requestedWords["added"]) requestedWords["added"] = {};
                    delete requestedWords["request"][word];
                    //console.log(Object.keys(requestedWords["request"][word]).length);
                    //if(Object.keys(requestedWords["request"][word]).length == 0) {
    
                    //}
                    requestList.forEach((socket)=>{
                        socket.emit('getRequests',requestedWords["request"]);
                    });
                    requestedWords["added"][word] = 0; 
                    fs.writeFile("addedWords.json",JSON.stringify(requestedWords),(err)=>{
                        if(err) console.error(err);
                    });
                    WORD_LIST.push(word);
                }
            }
        });
        socket.on('submit',function(command) {
            //if(password == passwordt) {
            //    socket.emit('submit');
            //}
            if(command.includes("!remove ")) {
                let word = command.slice("!remove ".length);
                delete requestedWords["request"][word];
                fs.writeFile("addedWords.json",JSON.stringify(requestedWords),(err)=>{
                    if(err) console.error(err);
                });
                //console.log(Object.keys(requestedWords["request"][word]).length);
                //if(Object.keys(requestedWords["request"][word]).length == 0) {

                //}
                requestList.forEach((socket)=>{
                    socket.emit('getRequests',requestedWords["request"]);
                });
            }
        });
        socket.on('postRequest',function(word){
            console.log(`word: ${word}`);
            let acceptable = false;
            for(let i = 0;i < word.length;i++) {
                console.log(word[i]);
                if(word[i] != " ") {
                    acceptable = true;
                    break;
                }
            }
            if(acceptable) {
                if(!requestedWords["request"]) requestedWords["request"] = {};
                if(requestedWords["added"]) {
                    console.log(requestedWords["added"][word]);
                    if(requestedWords["added"][word] != 0) {
                        requestedWords["request"][word] = 0;
                        fs.writeFile("addedWords.json",JSON.stringify(requestedWords),(err)=>{
                            if(err) console.error(err);
                        });
                        requestList.forEach((socket)=>{
                            socket.emit('getRequests',requestedWords["request"]);
                        });
                    }else {
                        socket.emit('postRequest');
                    }
                }else {
                    requestedWords["request"][word] = 0;
                    fs.writeFile("addedWords.json",JSON.stringify(requestedWords),(err)=>{
                        if(err) console.error(err);
                    });
                    requestList.forEach((socket)=>{
                        socket.emit('getRequests',requestedWords["request"]);
                    });
                }
            }
        });
        socket.on('disconnect',function() {
            delete requestList[bruh];
        });
        socket.emit('getRequests',requestedWords["request"]);
    }
    
    
    bruh++;
});
/*setInterval(function() {
    players = Object.keys(PLAYER_LIST).length
    //print(Object.keys(SOCKET_LIST).length);
    var pack = [];

    for(var i in PLAYER_LIST) {
        var player = PLAYER_LIST[i];
        //print(player.score);
        pack.push({
            x:player.x,
            y:player.y,

        });
    }
    for(var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.emit('newData',pack);
        
    }
    
},1000/30)*/
//setInterval(function() {
    //if(host) {
        //print(host.name);
    //}
    
//},1000);