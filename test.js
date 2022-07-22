var ws = require("nodejs-websocket");
//记录当前连接的客户端
var conns = [];
// 记录当前是谁发送的消息
var current_key = 0;
function sendMessage(message){
  for (var i=0; i<conns.length; i++) {
    if(conns[i].readyState == 1){
      var msg = {
        'type': "message",
        'message': message,
        'key':current_key
      }
      conns[i].sendText(JSON.stringify(msg));
    }
  }
}
var server = ws.createServer(function(conn){
    conn.on("text", function (data) {
      var msg = JSON.parse(data);
      var str = '';
      if(msg.type == 'join'){
        str = conn.key + '连接成功';
        var msg = {
          'type': "join",
          'message': '连接成功',
          'key':conn.key
        }
        //谁发送的消息，就转发给谁
        conn.sendText(JSON.stringify(msg));
        conns.push(conn);
      }else{
        str = conn.key + ':' + msg.message;
      }
      current_key = conn.key;
      sendMessage(str);
    })
    conn.on("close", function (code, reason) {
        console.log("关闭连接")
        sendMessage(conn.key + '退出了');
    });
    conn.on("error", function (code, reason) {
        console.log("异常关闭")
        console.log(code)
        console.log(reason)
    });
}).listen(8001)
console.log("WebSocket建立完毕")