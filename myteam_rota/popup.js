/**
 * @file MyTeam Rota extension for Google Chrome
 * @author Miguel Sanz
 * @version 1.2
 */



var url = "https://spreadsheets.google.com/feeds/list/1XbZI5OyLMCTIXOsOriHM1XUc_gD15mFVzdYjmqamGT8/";
var debugMode = false;
var clicksPt = 0;
var clicksSp = 0;


/**
 * Debug to console
 *
 */
function debug(msg, obj){
	if (debugMode) {
		console.log(msg, obj)
	}
}


/**
  * Test function with data structure
  *
  */
function test() {
  var data = {
    "translators":[
      {"region":"emea", "language":"french", "name":"frechName", "id":"111111"},
      {"region":"emea", "language":"german", "name":"germanName", "id":"222222"},
      {"region":"emea", "language":"spanish", "name":"spanishName", "id":"333333"},
      {"region":"us", "language":"french", "name":"frechName", "id":"444444"},
      {"region":"us", "language":"german", "name":"germanName", "id":"555555"},
      {"region":"us", "language":"spanish", "name":"spanishName", "id":"666666"}
    ]
  };

  drawTable(data);
}


var flags = {
		"czech" : {"icon":"cz.gif"},
		"danish" : {"icon":"dk.gif"},
		"dutch" : {"icon":"nl.gif"},
		"finnish" : {"icon":"fi.gif"},
		"french" : {"icon":"fr.gif"},
		"german" : {"icon":"de.gif"},
		"greek" : {"icon":"gr.gif"},
		"hungarian" : {"icon":"hu.gif"},
		"italian" : {"icon":"it.gif"},
		"norwegian" : {"icon":"no.gif"},
		"polish" : {"icon":"pl.gif"},
		"portuguese" : {"icon":"pt.gif"},
		"portuguese_br" : {"icon":"br.gif"},
		"romanian" : {"icon":"ro.gif"},
		"russian" : {"icon":"ru.gif"},
		"spanish" : {"icon":"es.gif"},
		"swedish" : {"icon":"se.gif"},
};


/**
  * This handles onclick event from translators table
  *
  * @param {Object} e - The event object that contains the id of the action (copyId, call, IM, email)
  */
function clickHandler(e){	
  if (e.target.id == "copyId"){
    debug("copyId:", e.target.parentElement.parentElement.dataset);

    window.getSelection().removeAllRanges();
    var range = document.createRange();
    range.selectNode(e.target);
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();

    showInfoMessage('"' + e.target.innerText + '" has been copied to clipboard');
  }
  else if (e.target.parentElement.id == "call") {
    debug("call:", e.target.parentElement.parentElement.parentElement.dataset);

    var phone = e.target.parentElement.parentElement.parentElement.dataset.phone;
    var urlPhone = 'tel:' + phone;

    updateTab(urlPhone);
    showInfoMessage("Calling to: " + phone);
  }
  else if (e.target.parentElement.id == "im") {
    debug("im:", e.target.parentElement.parentElement.parentElement.dataset);

    var name = e.target.parentElement.parentElement.parentElement.dataset.name;
    var urlIm = "sip:" + name.replace(" ", ".").replace(/ /g, "") + "@email.com";

    updateTab(urlIm)
    showInfoMessage("Sending IM to: " + name)
  }
  else if (e.target.parentElement.id == "email") {
    debug("email:", e.target.parentElement.parentElement.parentElement.dataset);

    var name = e.target.parentElement.parentElement.parentElement.dataset.name;
    var urlEmail = "mailto:" + name.replace(" ", ".").replace(/ /g, "") + "@email.com";

    updateTab(urlEmail);
    showInfoMessage("Sending email to: " + name);
  }
  /********************** Easter egg START **********************/
  else if (e.target.id == "portuguese") {
	clicksPt++;
	switch (clicksPt % 2) {
		case 0:
			$("#portuguese").attr("src","icons/flags/pt.gif");
			break;
		case 1:
			$("#portuguese").attr("src","icons/flags/br.gif");
			break;
	}	
  }
  else if (e.target.id == "spanish") {
	clicksSp++;
	if (clicksSp > 9) {
		switch (clicksSp % 2) {
			case 0:
				$("#spanish").attr("src","icons/flags/es.gif");
				break;
			case 1:
				$("#spanish").attr("src","icons/flags/cu.gif");
				break;
		}
	}
	/********************** Easter egg END **********************/
  }
}


/**
  * Calls Chrome API to get the current tab and redirects to Lync, email, etc
  *
  */
function updateTab(url){
  debug("url:", url);

  chrome.tabs.update({url: url});
}


/**
  * This populates translators table calling drawRow and makes translatorsDiv visible
  *
  * @param {Object} data - The data object with translators data
  */
function drawTable(data) {
  debug("data:", data);

  var utcDate = new Date();
  var hour = utcDate.getHours();
  var team = "";
  //From 17:00 UTC to 23:00 it is US translations hours, the rest of the time is EMEA
  if (hour >= 17 && hour < 23) {
    team = "us";
  }
  else {
    team = "emea";
  }

  for (var i in data.translators) {
    if (data.translators[i].region.toLowerCase() == team || data.translators[i].sameLanguage == 1) {
      drawRow(data.translators[i]);
    }
  }

  $("#translatorsDiv").fadeIn();
}


/**
  * This appends the rows of the translators table
  *
  * @param {Object} rowData - The data object with one translator data
  */
function drawRow(rowData) {
  var row = $('<tr />');
  $("#translatorsTable").append(row);     //this will append tr element to table... keep its reference for a while since we will add cells into it
  row.append($('<td>' + getFlag(rowData.language) + " " + rowData.language + '</td>'));
  row.append($('<td>' + rowData.name + '</td>'));
  row.append($('<td><a id="copyId" href="#" data-toggle="tooltip" title="click to copy">' + rowData.id + '</a></td>'));
  row.append($('<td><a id="im" href="#" data-toggle="tooltip" title="click to IM"><img src="icons/comments.png"></a></td>'));
  row.append($('<td><a id="email" href="#" data-toggle="tooltip" title="click to email"><img src="icons/email.png"></a></td>'));
  row.append($('<td><a id="call" href="#" data-toggle="tooltip" title="click to call"><img src="icons/telephone.png"></a></td>'));
  row.attr("data-name", rowData.name);    //this sets a custom data attribute with the name for the clickHandler function
  row.attr("data-phone", rowData.phone);  //the same with the phone
}


/**
  * This returns the img with the flag corresponding to each language
  *
  * @param {String} language - The language of the translator (French, German, Spanish...)
  * @returns {String} - The html code of the img tag
  */
function getFlag(language){
	var flag = flag = flags[language.toLowerCase()];
	
	if (flag != undefined) {
		return "<img id='" + language.toLowerCase() + "' src='icons/flags/" + flag.icon + "'>";
	}
	else {
		return "##";
	} 
}


/**
  * This returns the week number of the year
  *
  * @returns {Integer} - The week number [1..53]
  */
Date.prototype.getWeekNumber = function(){
  return $.datepicker.iso8601Week(this);
}


/**
  * This returns a JSON
  *
  * @param {String} str - The string with json like structure
  * @returns {Object} obj - The JSON
  */
function parseString(str){
  var properties = str.split(', ');
  var obj = {};

  for (var i = 0; i < properties.length; i++) {
    var tup = properties[i].split(':');
    obj[tup[0]] = tup[1].trim();
  }

  return obj;
}


/**
  * Count occurrences of a substring
  *
  * @returns {Integer} matches - The number of occurrences
  */
function countSubstring(str, subStr){
	var matches = str.match(new RegExp(subStr, "g"));
	return matches ? matches.length : 0;
}


/**
  * This calls Google spreadsheets api with the week number passed in the url.
  */
function getDataFromGoogleSheet(){
  var date = new Date();
  var weekNum = date.getWeekNumber();
  url = url + "default/public/basic?alt=json&sq=weeknum=" + weekNum;
  debug("weekNum:", weekNum);

  $.ajax({
  url: url,
  type: "GET",
  dataType: "json",
  beforeSend: function() {
    showLoadingMessage("Loading...")
  },
  success: function(response) {
    getDataSuccess(response)
  },
  error: function(response) {
    getDataError(response)
  }
  });
}


/**
  * This handles the HTTP response when the status is ok
  *
  * @param {Object} response - The http response object
  */
function getDataSuccess(response){
  var entryList = response.feed.entry;
  var data = {};
  data.translators = [];

  for (var i in entryList){
    var entry = entryList[i].content.$t;

    // push entry into translators array only if it contains: id, name, language, region and phone
    if (entry.indexOf("id:") != -1
    		&& entry.indexOf("name:") != -1
    		&& entry.indexOf("language:") != -1
    		&& entry.indexOf("region:") != -1
    		&& entry.indexOf("phone:") != -1)
    {
      data.translators.push(parseString(entry));
    }
  }

  if (data.translators.length > 0){
    var translatorsAll = JSON.stringify(data.translators).toLowerCase();

    // count translators for the same language and add property with the number
    for (var i in data.translators) {
      var translatorLang = '"language":"' + data.translators[i].language.toLowerCase() + '"';
      data.translators[i].sameLanguage = countSubstring(translatorsAll, translatorLang)
    }

    $("#messageDiv").hide();  // hide loading message
    drawTable(data);          // call drawTable function
  }
  else {
    showWarningMessage("No data available at this time");
  }

}


/**
  * This handles the HTTP response when the status is error
  *
  * @param {Object} response - The http response object
  */
function getDataError(response){
  console.log(response);

  if (response.readyState == 4) {
    showErrorMessage("HTTP error");
  }
  else if (response.readyState == 0) {
    showErrorMessage("Network error");
  }
  else {
    showErrorMessage(response.statusText);
  }
}


function showErrorMessage(msg){
  $("#messageIcon").attr("src","icons/exclamation.png");
  $("#message").text(msg);
  $("#messageDiv").show();
}

function showWarningMessage(msg){
  $("#messageIcon").attr("src","icons/error.png");
  $("#message").text(msg);
  $("#messageDiv").show();
}

function showInfoMessage(msg){
  $("#messageIcon").attr("src","icons/information.png");
  $("#message").text(msg);
  $("#messageDiv").slideDown("fast");
}

function showLoadingMessage(msg){
  $("#messageIcon").attr("src","icons/ajax-loader.gif");
  $("#message").text(msg);
  $("#messageDiv").show();
}

function handleHelpDiv(){
  $("#helpDiv").slideToggle();
}



/**
  * M A I N
  *
  * Add event listeners once the DOM has fully loaded by listening for the
  * `DOMContentLoaded` event on the document, and adding your listeners to
  * specific elements when it triggers.
  */
document.addEventListener('DOMContentLoaded', function () {

  document.querySelector('#translatorsTable').addEventListener('click', clickHandler);
  document.querySelector('#helpIcon').addEventListener('click', handleHelpDiv);

  //test();
  getDataFromGoogleSheet();
});

