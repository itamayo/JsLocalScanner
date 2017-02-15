(function(scope){
  var CSsim = {};
  CSsim.devicesIP = [];
  CSsim.requests = [];
  var ping = function(IP){
    var xhttp = new XMLHttpRequest();
    CSsim.requests.push(xhttp);
    xhttp.onreadystatechange = function() {
      if(this.readyState == 4 && this.status==200) {
        CSsim.gateWay = IP.substring(8,IP.length);
        console.log("Gateway founded");
      }
    }
    xhttp.onerror = function(e){
      CSsim.gateWay = IP.substring(8,IP.length);
      CSsim.log("Posible gateway found: "+CSsim.gateWay,"gateway");
      CSsim.requests.forEach(function(req){
        req.abort();
      });
      scanDevices();
    }
    xhttp.ontimeout = function () { CSsim.log(2,"progressbar"); }
    xhttp.open("GET", IP, true);
    xhttp.setRequestHeader('Access-Control-Allow-Origin','*');
    xhttp.setRequestHeader("Content-Type", "text/html");
    xhttp.setRequestHeader('Access-Control-Allow-Credentials',' true');
    xhttp.withCredentials = true;
    xhttp.timeout = 1500;
    xhttp.send();

  }
  var ping2 = function(IP){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if(this.readyState == 4 && this.status === 200) {
        console.log("Device IP",IP);
      }
    }
    xhttp.onerror = function(e){
      CSsim.devicesIP.push(IP.substring(8,IP.length-1));
      CSsim.log("Devices founded: " + CSsim.devicesIP.join(','),"device<br>");
    }
    xhttp.ontimeout = function () {  }
    xhttp.open("GET", IP, true);
    xhttp.timeout = 1500;
    xhttp.send();

  }

  var scanGateWay = function (){
    console.log("scanning gateway...");
    for (n=0;n<255;n++){
      (function(n,_this){
        setTimeout(function(){
          ping("https://192.168."+n+".1");
          CSsim.log(0.3,"progressbar");

        },n*250);
      })(n,this);

    }


  }
  var scanDevices = function (){
    CSsim.log("scanning for devices...","title");
    CSsim.log(0,"clearPb");
    var ip = CSsim.gateWay.substring(0,CSsim.gateWay.length-1);
    for (n=2;n<255;n++){
      (function(n,_this){
        setTimeout(function(){
          ping2("https://"+ip+n+"/");
          CSsim.log(2,"progressbar");
        },n*250);
      })(n,this);
    }
    setTimeout(function(){
      CSsim.log("scan Done!","done");
    },60000);

  }
  var log = function(txt,type){
    if (document.querySelectorAll('#container').length!=0){
      if (type=="progressbar"){
        var pg = document.querySelector('#progressbar');
        pg.style.width = parseInt(pg.style.width)+txt;
      }
      if (type=="clearPb"){
        var pg = document.querySelector('#progressbar');
        pg.style.width = '0px';
      }
      if (type=="title"){
        var title = document.querySelector('#title');
        title.innerHTML = txt;
      }
      if (type=="gateway"){
        var gateway = document.querySelector('#gateway');
	gateway.style.color="red";
        gateway.innerHTML = txt;
      }
      if (type=="device"){
        var device = document.querySelector('#device');
        device.innerHTML = txt+"<br>";
      }
      if (type=="done"){
        var done = document.querySelector('#done');
        done.innerHTML = txt;
      }
    }
    else {
      var div = document.createElement('div');
      div.id="container";
      div.style.width="600px";
      div.innerHTML = '<h2>Scanning Devices</h2>'+
      '<p id="title">Scanning gateWay </p>'+
      '<p id="gateway"></p>'+
      '<div id="progressbar" style="background:orange;width:0px;height:40px"></div>'+
      '<p id="device" style="width:800px"></p>'+
      '<p id="done"></p>';
      document.body.appendChild(div);

    }

  }
  CSsim.scan = scanGateWay;
  CSsim.log = log;
  scope.CSsim = CSsim;
})(window);


document.addEventListener('DOMContentLoaded',function(e){CSsim.scan();});
