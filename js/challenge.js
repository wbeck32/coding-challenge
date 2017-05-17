var appData = {};
var appsArray = [];
var uniqueHosts = [];

function initializeData() {

function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'data/host-app-data.json', true);
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    }
    xobj.send(null);
}

loadJSON(function(response) {
    jsonresponse = JSON.parse(response);
    for (var item in jsonresponse){
      var appItem = {};
      appItem.apdex = jsonresponse[item].apdex;
      appItem.version = jsonresponse[item].version;
      appItem.name = jsonresponse[item].name;
      appItem.host = jsonresponse[item].host;
      appData[item] = appItem;
    }
    findUniqueHosts(appData, attachAppsToHosts);
});

function findUniqueHosts(appData, cb){
  var tmpArray = [];
  for (var values in appData) {
      tmpArray.push(appData[values].host);
    }
      var flattened = [].concat.apply([],tmpArray);
      flattened = flattened.filter(function(v,i,a){
        if (uniqueHosts.indexOf(v) === -1){
          uniqueHosts.push(v);
        }
      });
    cb(uniqueHosts, rankApps);
};

function attachAppsToHosts(uniqueHosts, cb){
  for (var i = 0; i < uniqueHosts.length; i++) {
    var oneHostApps = [];
    oneHostApps.push(uniqueHosts[i]);
    for (apps in appData) {
        for (var m = 0; m < appData[apps].host.length; m++) {
          if (appData[apps].host[m].indexOf(uniqueHosts[i]) === 0) {
            oneHostApps.push(appData[apps]);
          }
        }
      }
      appsArray.push(oneHostApps);
  }
  cb(appsArray, getTopAppsByHost);
};

function rankApps(appsArray, cb) {
  for (var m = 0; m < appsArray.length; m++) {
    appsArray[m].sort(function(a,b){
      return parseFloat(b.apdex) - parseFloat(a.apdex);
    })
  }
  cb(appsArray);
}

};

function changeView() {
  var cw = document.getElementById('cardWrapper');
  var cb = document.getElementById('checkbox');
  var cards = document.getElementsByClassName('card');
  cb.checked ? cw.className = "cardWrapperList" : cw.className = "cardWrapper";
  for (var c = 0; c < cards.length; c++) {
    cb.checked ? cards[c].className = "card list" : cards[c].className = "card";
  }
}

function getTopAppsByHost(appsArray){
  for (var a = 0; a < appsArray.length; a++) {
    var cardDiv = document.createElement('div');
      cardDiv.className = "card";
    var hostDiv = document.createElement('div');
      hostDiv.className = "hostName";
      hostDiv.innerHTML = appsArray[a][0];
      cardDiv.appendChild(hostDiv);

    for (var f = 1; f <= 5; f++){
      var appDiv = document.createElement('div');
        appDiv.className = "appInfo";
      var apdexSpan = document.createElement('span');
        apdexSpan.className = "apdex";
        apdexSpan.innerHTML = appsArray[a][f].apdex;
        appDiv.appendChild(apdexSpan);
      var appNameSpan = document.createElement('span');
        appNameSpan.className = "appName";
        var version = appsArray[a][f].version;
        appNameSpan.innerHTML = "<a href=\"#\" onclick=\"return alert(\'version: "+version+"\')\">"+appsArray[a][f].name
        appDiv.appendChild(appNameSpan);
        cardDiv.appendChild(appDiv);
    }
    document.getElementById('cardWrapper').appendChild(cardDiv);
  }

}

//functions here to add an app to a specific hostname
//and to remove the same app
//choose the hostname and the app will be added or removed
//this is part of a separate monitoring page, monitor.html

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function initializeMonitorPage() {
  console.log(uniqueHosts); //uniqueHosts looks like an array, but it's typeof object
  console.log(typeof uniqueHosts);
  console.log(uniqueHosts.length);
  console.log(Object.keys(uniqueHosts).length);
  console.log(Object.keys(uniqueHosts));
  console.log(Object.size(uniqueHosts));

  var selectWrapperDiv = document.getElementById('selectWrapper');
  var hostList = document.createElement("select");
  hostList.id = "hostname";
  selectWrapperDiv.appendChild(hostList);

  for(keys in uniqueHosts) {
      console.log(uniqueHosts[keys]);
      var option = document.createElement("option");
      option.value = uniqueHosts[u];
      option.text = uniqueHosts[u];
      console.log(option);
      var selectList = document.getElementById('hostname');
      selectList.appendChild(option);
  }
}

var hostname = "7e6272f7-098e.dakota.biz";
var appToAdd = {
  name: 'Delightful Cotton Shirt',
  apdex: 99,
  version: 7
}

var appToRemove = {
  name: 'Delightful Cotton Shirt',
}

addAppToHosts(hostname, appToAdd);

function addAppToHosts(hostname, app) {
  // console.log(typeof appsArray);
  for (var h = 0; h < appsArray.length; h++) {
    console.log('h: ',h);
    if (appsArray[h][0] == hostname) {
      console.log(appsArray[h][0]);
    }
  }
};
//
// removeAppFromData(function(hostname,app){
//
//
// });
