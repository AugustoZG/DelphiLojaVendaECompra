/* websocket functions */

var mySocket;
var nome;
var chsv = "**";
var tam = 2;

const socketMessageListener = (event) => { 
	prefixo_msg = event.data.substring(0, tam);
	conteudo = event.data.substring(tam);
	if (prefixo_msg === chsv)
	{
		fakeMessage(conteudo);
	}
	
	
};

const socketOpenListener = (event) => { // Open
   console.log('Connected');
};

const socketCloseListener = (event) => { // Closed
   if (mySocket) {
      console.error('Disconnected.');
   }
   mySocket = new WebSocket('wss://demo.piesocket.com/v3/channel_1?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV');
   mySocket.addEventListener('open', socketOpenListener);
   mySocket.addEventListener('message', socketMessageListener);
   mySocket.addEventListener('close', socketCloseListener);
}; socketCloseListener();

/* chat functions */

var $messages = $('.messages-content'),
    d, h, m,
    i = 0;

$(window).load(function(){
    $messages.mCustomScrollbar();
	atualizarNome();
});

function atualizarNome(){
	if (nome == null){
		nome = "Usuario";
	}
	$(".nick").html('@'+nome);
}

function updateScrollbar(){
    $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
        scrollInertia: 10,
        timeout: 0
    });
}

function setDate(){
    d = new Date()
    if(m != d.getMinutes()){
        m = d.getMinutes();
        $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
    }
}

function insertMessage(){
    msg = $('.message-input').val();
    if($.trim(msg) == ''){
        return false;
    } sendMessage(msg);
    $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
    setDate();
    $('.message-input').val(null);
    updateScrollbar();
}

$('.message-submit').click(function(){
    insertMessage();
});

$(window).on('keydown', function(e){
    if (e.which == 13) {
        insertMessage(); return false;
    }
})

var Fake = [
    'Bem vindo!<br>Você está conectado!'
]

function fakeMessage(msg=''){
    if(i==0||msg!=''){
        $('<div class="message loading new"><figure class="avatar"><img src="https://w7.pngwing.com/pngs/419/473/png-transparent-computer-icons-user-profile-login-user-heroes-sphere-black-thumbnail.png" /></figure><span></span></div>').appendTo($('.mCSB_container'));
        updateScrollbar();
        setTimeout(function(){
            $('.message.loading').remove();
            $('<div class="message new" title=""><figure class="avatar"><img src="https://w7.pngwing.com/pngs/419/473/png-transparent-computer-icons-user-profile-login-user-heroes-sphere-black-thumbnail.png" /></figure>' + (msg!=''?msg:Fake[i]) + '</div>').appendTo($('.mCSB_container')).addClass('new');
            setDate();
            updateScrollbar();
            i++;
        }, 1000 + (Math.random() * 20) * 100);
    }
}

function sendMessage(msg){
	prefixo_cmd = msg.substring(0,1);
	if (prefixo_cmd === '/')
	{
		cmd = msg.substring(0,5);
		console.log(cmd);
		if (cmd === '/nome')
		{
			nome = msg.substring(6); 
			atualizarNome();
		}
		else if(cmd ==='/chsv')
		{
			chsv = msg.substring(6);
			fakeMessage('Canal alterado: ' + chsv);	
			tam = chsv.length; 
		}
		else
		{
			fakeMessage('Bot-Help: lista de comandos: <br> /nome -prnome ');
		}
		
	}else
	{
		msg = chsv + nome + ": " + msg;
		mySocket.send(msg);
	}
	
}
