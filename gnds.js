var fs = require('fs');
var fileName = './config/cf.json';
var file = require(fileName);
var needle = require('needle');
var webScrpName = './backup/webScrp.json'
var webScrp = require(webScrpName);
var cdUpd = 0;
var ToS = file.FS;
var results = [];
const playlists = './playlists/';
const xor = require('lodash.xor');
const infoYTDL = require("ytdl-getinfo");
const coreYTDL = require("ytdl-core");
const searchYT = require("youtube-search");
const OpusS = require("opusscript");
const Discord = require('discord.js');
const gnds = new Discord.Client();
const Config = require ('./config/cf.json');
const prefix = Config.prefix;
const cheerio = require('cheerio');
const request = require('request');
const banan = require('moderation/ban');
const mute = require('moderation/mute');
const cls = require('moderation/cls');
const kick = require('moderation/kick');
const unmute = require('moderation/unmute');
const unban = require('moderation/unban');
const searcher = require('google-searcher');
var bffrName = './config/buffer.json';
var bffr = require(bffrName);
var url = "https://stopgame.ru/news";
var url1 = "https://stopgame.ru"
var servers={};
var chooseEn = 0;
var choose = 1;
var chooseSiteEn = false;
var resultsss = [];
var repeat = false;
var repeatall = false;
var qu = [];
var paused = false;
var q = "check"
var resultss = [];
var titles = [];
var maxResults = 5;
var titles0 = [];
var j = -1;
var choice = 0;
var stop = false;
var newStr = new String();
function translit(args){
    // Символ, на который будут заменяться все спецсимволы
    var space = '-';
    // Берем значение из нужного поля и переводим в нижний регистр
    var text = args[1];
        
    // Массив для транслитерации
    var transl = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
    'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
    'о': 'o', 'п': 'p', 'р': 'r','с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h',
    'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh','ъ': space, 'ы': 'y', 'ь': space, 'э': 'e', 'ю': 'yu', 'я': 'ya',
    ' ': space, '_': space, '`': space, '~': space, '!': space, '@': space,
    '#': space, '$': space, '%': space, '^': space, '&': space, '*': space,
    '(': space, ')': space,'-': space, '\=': space, '+': space, '[': space,
    ']': space, '\\': space, '|': space, '/': space,'.': space, ',': space,
    '{': space, '}': space, '\'': space, '"': space, ';': space, ':': space,
    '?': space, '<': space, '>': space, '№':space
    }
                   
    var result = '';
    var curent_sim = '';
                   
    for(i=0; i < text.length; i++) {
        // Если символ найден в массиве то меняем его
        if(transl[text[i]] != undefined) {
             if(curent_sim != transl[text[i]] || curent_sim != space){
                 result += transl[text[i]];
                 curent_sim = transl[text[i]];
                                                            }                                                                            
        }
        // Если нет, то оставляем так как есть
        else {
            result += text[i];
            curent_sim = text[i];
        }                             
    }         
                   
    result = TrimStr(result);              
                   
    // Выводим результат
    return result;
       
    }
    function TrimStr(s) {
        s = s.replace(/^-/, '');
        return s.replace(/-$/, '');
    }



function search(message, args){
    if(!args[1])return message.channel.send("Синтаксис: <<search ЗАПРОС");
    maxResults = 5;
new searcher()
    .host("www.google.ru")
    .lang("ru")
    .query(args[1])
    .exec()
    .then(results => {
        
        resultss = results.slice(0, maxResults);
        i = 0;
        titler(message, resultsss, i, results);
    });


}

function titler (message, resultsss, i, results){
    var url = resultss[i];
    if (url == undefined) return handler(message, titles, resultsss);
    needle.get(url, function(err, res){
    if(err){debug(err);}
    else{ 
        const $ = cheerio.load(res.body)
        titles.push($('title').text())
        i = i + 1;
        PreHandler (message, results,titles, i, resultsss);    
        }
    
    }) 
}

function PreHandler (message, results, titles, i, resultsss){
    titler(message, resultss, i, results);
}

function handler(message,titles, resultsss){
    message.channel.send({embed: {
        color: 3447003,
        author: {
          name: gnds.user.username,
          icon_url: gnds.user.avatarURL
        },
        title: "Выбор:",
        description: `Всё кликабельно`,
        fields: [
          {
            name: "1:",
            value: `[${titles[0]}](${resultsss[0]})`
          },
          {
            name: "2:",
            value: `[${titles[1]}](${resultsss[1]})`
          },          {
            name: "3:",
            value: `[${titles[2]}](${resultsss[2]})`
          },          {
            name: "4:",
            value: `[${titles[3]}](${resultsss[3]})`
          },          {
            name: "5:",
            value: `[${titles[4]}](${resultsss[4]})`
          },
        ],
        timestamp: new Date(),
        footer: {
          icon_url: gnds.user.avatarURL,
          text: `© ${gnds.user.username}`
        }
      }
    });
}

function PostHandler(resultsss,message){
    var regexp = /.*?[0-9].*?/;
    if (!choice.match(regexp)) return
    if (choice == 0) return;
    var chs = choice - 1;
    if (chs > maxResults) return;
    message.channel.send(`Ссылка: ${resultsss[chs]}`);
    chooseEn = 0;

}

debug("All consts and vars inited");
function play(connection, message){
    var server = servers[message.guild.id];
    
    /*debug(i);
   
    })*/
    server.dispatcher = connection.playStream(coreYTDL(server.queue[0], {filter: "audioonly"}));
    
    var server = servers[message.guild.id];
    server.dispatcher.on("end", function(){
       
        debug("Song Ended.");
        debug("Repeatall STATUS: " + repeatall + " | Repeat STATUS: " + repeat);
        if (repeat == false)server.queue.shift();
        if(stop == true) {
            server.queue = [];
            qu = [];
        }
        if (repeatall == true){
            server.queue = server.queue.concat(qu);
            debug("Server.queue[0] after concat: "+ server.queue[0]);
         }
        if(server.queue[0]){
            debug(`server.queue = ${server.queue[0]}`);
            if(stop)return debug("ok let's check"); 
            infoYTDL.getInfo(server.queue[0]).then(info => {
            title = info.items[0].title;
            message.channel.send("Сейчас играет: " + title);
            debug (`Title = ${title}`);
        });
            play(connection, message);
        }
        
        else{
            debug("Disconnecting");
            if(!stop) message.channel.send("Воспроизведение окончено.");
            connection.disconnect();
            return;
            }
    });
    }
    

function cdEnd(){
    cdUpd = 0;
}

function Update(url, url1, fun){
    request(url, function(err, res, body, fun){
        if(err){debug(err);}
        else{ 
        $ = cheerio.load(body);
        $('.lent-left').children().first().next(function(){
                bffr.title = $('.lent-title',this).text();
                bffr.url = url1 + $('a',this).attr('href');
             });

                 debug(bffr.title + "  ::  " + bffr.url);
                    fs.writeFile(bffrName, JSON.stringify( bffr , null, 2), function(err) {
                    if(err) console.error(err);
                    else{ debug('title & url saved to buffer(bffr.json)');
                    /*webScrp.title = bffr.title;
                    webScrp.url = bffr.url;*/
                    fs.readFile(bffrName, 'utf8', function (err, data) {
                        if (err) console.log(err);
                           webScrp = JSON.parse(data);
                        });
                        debug(webScrp.title);
                        if(bffr.title === webScrp.title){ 
                            if(fun === !0){
                            const channel = gnds.channels.get("508616728259854336", "game-news");
                            channel.send("Новых новостей нет!");
                        }
                        else debug("No new News");
                        }
                        
                        
                        else{
                            const channel = gnds.channels.get("508616728259854336", "game-news");
                            channel.send("Новости подъехали:") 
                            channel.send(bffr.title  +'\n' +"Полная статья на сайте: " + bffr.url);
                            fs.createReadStream(bffrName).pipe(fs.createWriteStream(webScrpName));
                        }
                    }
                });  

}
});
}
function timer(url, url1) {
    setTimeout(function tick(url, url1) {
    var fun = 0;
    var url = "https://stopgame.ru/news";
    var url1 = "https://stopgame.ru"
    Update(url, url1, fun)
    setTimeout(tick, 1860000);
  }, 2000);
}

function debug (text){
    console.log(text);
    fs.appendFile('debug', "["+Date()+"] " + text + '\n', function (err) {
        if (err) return debug(err);
    });  
};
function load(args){

}

gnds.login("NTA3NTYwNzg1Nzk1NjEyNjk1.DryikQ.NALc3AX9y-u-TdP2NadED7EhSB0");
debug("Bot authed");
gnds.on('ready', (message) => {

debug("Bot ready to work");

if((ToS == "0") || ( ToS == 0 )){
    const channel = gnds.channels.get("508616728259854336","game-news");
        debug("Bot was started 1st time");
        channel.send("Всем привет! У меня появились новые функции! Чтобы с ними ознакомиться перейдите в канал \"#Info\", там мой создатель всё подробно описал.");
        //message.channel.send(Config.credits.Discord);
        debug("Introduction messages was sended");
        file.FS = 1;//Запись изменение переменной
        ////////////Функция записи в файл///////////////////////////////////////
        fs.writeFile(fileName, JSON.stringify(file, null, 2), function (err) {//
            if (err) return debug(err);                                 //
         debug('writing to ' + fileName);                            //
         });                                                                   //
        ////////////////////////////////////////////////////////////////////////
        debug("Var FS was edited ++ started update");
        //Update(url, url1);

        timer(url, url1);
        debug("updated");
    }
        
else{
debug("Bot started AGAIN ++ start update");
//Update(url, url1);

timer(url, url1);
debug("updated");
}
});

gnds.on('message', (message)=>{
    debug("messages listner inited");
    if(!message.content.startsWith(prefix)) return;
    //var args = message.content.substring(prefix.length).split(" ");
    var title = [];
    var args =[];
    debug("message listened");
    if(!message.content.startsWith(prefix)) return;
    var title = [];
    debug("args init start");
    var args2 = message.content.substring(prefix.length).split(", ");
    debug("Args2: " + args2[0]);
    args[2] = args2[1];
    var args1 = message.content.substring(2).split(" ");
    debug("args1:" + args1);
    args[1] = args2[0].replace(args1[0], "").substring(1);
    args[0] = args1[0];
    if(args[1].startsWith(" ")){
        args[1].substring(1);
        debug(`Findend unexpected space. Delete.. ${args[1]}`)
    }
    debug("args inited " + args[0] + "::" + args[1]);
	if(!servers[message.guild.id]) servers[message.guild.id] = {
		queue: []
    };
    
	switch(args[0].toLowerCase()){
        case "help":
        debug("Help command");
		message.channel.send("Команды бота: " + '\n' + "<<help - выводит список команд. " + '\n' + "<<update - обновление новостей \n<<play [url | поисковой запрос] - воспроизведение трека." + '\n' + "<<stop - остановка воспроизведения." + '\n' + "<<pause - приостановка воспрозиведния." + '\n' + "<<resume - возобновление воспроизведения." + '\n' + "<<skip - пропуск трека." + '\n' + "<<repeat [1 | all] - создание цикла воспроизведения." + '\n' + "<<unrepeat [1 | all] - удаление цикла воспроизведения. \n <<ban @user [, причина] - Ban Hummer \n <<unban user [, причина] - разбан \n <<mute @user [, причина] - мут \n <<unmute @user [, причина] - размут \n <<cls количество_отчищаемых_сообщений - удаляет сообщения \n <<kick @user [, причина] - шагом марш с сервера!\n <<search ЗАПРОС - поиск в Интернете.");
		break;
	

		case "cl_L":
            fs.truncate('./CONSOLE.log', 0, function(){debug('Logs CLEARED')});
            break;
        case "play":
            if(!args[1]){
                message.reply("Мне нужна ссылка или поисковой запрос.");
                break;
            }
            
            if(!message.member.voiceChannel){
                message.reply("Войдите в голосовой канал."); 
                break;
            }
    
    
            var server = servers[message.guild.id];
            if (message.content.includes('www.youtube.com')){
            if (server.queue === undefined || 0){
            infoYTDL.getInfo(args[1]).then(info => {
            title = info.items[0].title;
            message.channel.send("Сейчас играет: " + title);
            });
        }
        else {
            infoYTDL.getInfo(args[1]).then(info => {
                title = info.items[0].title;
                console.log("WARN: " + server.queue);
                if(server.queue)message.channel.send("Трек " + title + " добавлен в очередь.");
                //else message.channel.send()
        
    });
        }
        server.queue.push(args[1]);
        qu.push(args[1]);
            console.log("OK");
            }
            else {
                var m = message.content.substring(7);
                console.log(m);
                var opts = {
                    maxResults: 3,
                    key: 'AIzaSyDNO00F6Bie4tpkmXq03Aa4gzLajjP2_ec',
                  };
                searchYT(m, opts, function(err, results) { 
                    if(err) return console.log(err); 
                    resultss = results;
                    message.channel.send("Выберите (<<choose 1-3): " + '\n' + '\n' + "1. " + results[0].title + '\n' + "2. " + results[1].title + '\n' + "3. " + results[2].title); 
                    chooseEn = 1;    
                }); 
                break;
                  
            }
             
            if (!message.guild.voiceConnection) {
                message.member.voiceChannel.join().then(function(connection, err){
                    if(err) debug(err);
                    else play(connection, message);
            });
        }
    
            break;


        case "remove":

        if(!args[1]) return message.channel.send('Синтаксис <<remove ПЛЕЙЛИСТ');
        fs.unlink(`./playlists/${args[1]}.json`, function(err){
            if(err)return message.channel.send("Такой плейлист не существует. Введите <<save ПЛЕЙЛИСТ для его создания.");    
            if(!err)return message.channel.send(`Плейлист ${args[1]} успешно удалён`);
        });
        
        break;

        case "save":
        if(!args[1]) return message.channel.send('Синтаксис: <<save Название_Плейлиста');
        fs.stat(args[1], function (err) { 
        if(!err)return message.channel.send("Такой плейлист уже существует. Введите <<remove ПЛЕЙЛИСТ для его удаления.");
        if(err) debug("Try To SAve");
        });
        var server = servers[message.guild.id];
        //var newStr = translit(args[1]);
        fs.writeFile(`${playlists}/${args[1]}.json`, JSON.stringify(server.queue,null, 2),function(err){
            if(err){
            message.channel.send("Ошибка сохранения, обратитесь к Заместителю Администратора сервера.");
            debug(err);
            }
            message.channel.send(`Плейлист ${args[1]} сохранён.`);    
        });
        break;
        case "choose":
                if(!args[1]) return message.channel.send(`Ситаксис <<choose 1-3`);
                    if(chooseEn == 1){
                    choose = args[1];
                   // if (!args[1]) return message.channel.send("Синтаксис: <<choose 1-3");
                    if(choose == !'1'|| !'2' || !'3') return message.channel.send("Синтаксис: <<choose 1-3");
                    if ((choose > 3) || (choose < 0)){ 
                      message.channel.send("Такого варианта нет.");
                      //chooseEn = false;
                      break;
                  }
                 else{
                           var j = choose - 1;
                      message.channel.send("Трек " + resultss[j].title + " добавлен в очередь воспроизведения.");

                        var server = servers[message.guild.id];
    
                
                     server.queue.push(resultss[j].link);
                     qu.push(resultss[j].link);
    
                        if (!message.guild.voiceConnection) {
                            chooseEn = 0;
                          message.member.voiceChannel.join().then(function(connection, err){
                             if(err) debug(err);
                                else play(connection, message);
                          
                  });
                }
            }
        }
            if(chooseEn == !'2' && !'1') return message.channel.send("Нет выбора!")
            if(chooseEn==2){
                if(!args[1])return message.channel.send(`Синатксис: <<choose 1-${maxResults}`);
                choice = args[1];
                PostHandler(resultss, message);
                break;
            }
        
        break;
        
        //STOP
        case "stop":
        var server = servers[message.guild.id];
        if(!servers[message.guild.id]) servers[message.guild.id] = {
            queue: []
        };
            if(message.guild.voiceConnection) {
                stop = true;
                message.member.voiceChannel.leave();
               // server.queue.splice(0,server.queue.length);
                //debug(server.queue);
               /// qu.splice(0,qu.length);
                //debug(qu);
                message.channel.send("Выход из канала и очистка очереди воспроизведения.");
                
                break;
            }
            else message.reply("Музыка не воспроизводится!");
            break;
    
        case "pause":
        var server = servers[message.guild.id];
        if(!paused){
            server.dispatcher.pause();
            paused = true;
            message.channel.send("Воспроизведение приостановлено.");
            break;
            }
        case "resume":
        var server = servers[message.guild.id];
            if(paused){
                paused = false;
                server.dispatcher.resume();
                message.channel.send("Воспроизведение возобновлено.");
                break;
            }
            else{
                message.channel.send("Воспроизведение не приостановлено.");
                break;
            }
    
        case "skip":
            var server = servers[message.guild.id];
            if(server.dispatcher) server.dispatcher.end();
            if (server.queue[0] === !undefined){
                infoYTDL.getInfo(server.queue[1]).then(info => {
                title =(info.items[0].title);
                message.reply("Трек пропущен. Следующий трек: " + title);
                });
            }
            break;
        case "repeat":
            var server = servers[message.guild.id];
            if(!args[1]) {
                message.channel.send("Синтаксис: <<repeat 1 | all");
                break;
            }
            if (args[1] === !"all" || !'1'){
                message.channel.send("Синтаксис <<repeat 1 | all");
                break;
            }
            if (server.queue[0] === undefined || 0){
                message.channel.send("Очередь пуста.");
                break;
            }
            if (args[1] === '1'){
                if (repeat == false) {
                    repeat = true;
                    message.channel.send("Трек " + title + " помещён в цикл");
                    break;
                }
                else{
                    message.channel.send("Используйте команду <<unrepeat 1 для удаления цикла.");
                    break
                }
            }
            if (args[1] === 'all'){
                if(repeatall == false){
                    repeatall = true;
                    //repeat = true;
                    message.channel.send("Цикл для всей очереди создан.")
                    break;
                }
            }
    
    
            break;
    
        case "unrepeat":
        var server = servers[message.guild.id];
        if(!args[1]) {
            message.channel.send("Синтаксис: <<unrepeat 1 | all");
            break;
        }
        if (args[1] === !'all' || !'1'){
            message.channel.send("Синтаксис <<unrepeat 1 | all");
            break;
        }
        if (server.queue[0] === undefined || 0){
            message.channel.send("Очередь пуста.");
            break;
        }
        if (args[1] === '1'){
            if (repeat == false) {
                repeat = true;
                message.channel.send("Цикл для трека " + title + " удалён");
                break;
            }
            else{
                message.channel.send("Цикл не найден. Используйте команду <<repeat 1 для его создания.");
                break
            }
        }
        if (args[1] === 'all'){
            if(repeatall == true){
                repeatall = false;
                message.channel.send("Цикл для всей очереди удалён.")
                break;
            }
            else{
                message.channel.send("Цикл не найден. Используйте <<repeat all");
                break;
            }
        }
        case "update":

        debug("Update command taken");
                    
        if (cdUpd === 0) {  
        debug("Updating...");
        var fun = 1;
        Update(url, url1, fun);
        setTimeout(cdEnd,300000);
        debug("timeout setted");
        cdUpd = 1;
        break;
        }
        else {
            message.channel.send("обновлять новости можно только раз в 5 минут.");
            break;
        }

        case "mute":
            mute(gnds, message, args);
            break;
        case "kick":
            kick(gnds, message, args);
            break;
        case "ban":
            banan(gnds, message, args);
            break;
        case "cls":
            cls(gnds, message, args);
            break;
        case "unban":
            unban(gnds, message, args);
            break;
        case "unmute":
            unmute(gnds, message, args);
            break;
        case "newcmds":
            message.channel.send("<<search ЗАПРОС - поиск в Интернете.");
            break;

        case "search":
            search(message, args);
            break;
        case "stopbot":
            message.channel.send("Заканчиваю работу...");
            process.exit(1);
            break;
        case "load":
        var server = servers[message.guild.id];
        fs.readFile(`${playlists}/${args[1]}.json`, 'utf8', function (err, data) {
        if (err){ 
            debug(err);
            message.channel.send("Указанного плейлиста не существует, или он повреждён.");
        }
               var loaded = JSON.parse(data);
               server.queue = loaded;
               if (!message.guild.voiceConnection) {
                message.member.voiceChannel.join().then(function(connection, err){
                    if(err) debug(err);
                    else play(connection, message);
            
            });
        }
            });

        break;
		default:
        message.channel.send("Неизвестная команда!");
        break;
        }
        });    



