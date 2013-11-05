/*
[Name] controller.js

*/

$(document).on("pageinit", function(event, ui) {
	$(this).unbind(event);
	//document.addEventListener('deviceready', onDeviceReady, false);
	navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError, {maximumAge:10000, timeout:30000, enableHighAccuracy : true} );
	document.addEventListener("backbutton", onBackKeyDown, false);

})
function onGeoSuccess(position) {
	deviceSW = 1;
	clat = position.coords.latitude;
	clng = position.coords.longitude;
	//alert("[GPS success] position.coords.latitude: " +clat + ", position.coords.longitude: " + clng);
}

function onGeoError(error) {
	alert("[GPS Error]\ncode: " + error.code + "\nmessage: " + error.message + "\n");
	navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError, {maximumAge:10000, timeout:30000, enableHighAccuracy : true} );
}
function onBackKeyDown() {
	//alert($.mobile.activePage.attr("id"));
	if ($.mobile.activePage.attr("id") == baseLoc)
	{
		//alert("location: " + baseLoc);
		navigator.app.exitApp();
		event.preventDefault();
	} else if ($.mobile.activePage.attr("id") == indexLoc)
	{
		//alert("location: " + indexLoc);
		navigator.notification.confirm("프로그램을 종료하길 원하십니까?", onConfirm, "확인", "Yes,No");
	} else if ($.mobile.activePage.attr("id") == 'searchMap')
	{
		//pageLuncher('searchMain');
		history.go(-2);
	} else {
		navigator.app.backHistory();
	}
}
function onConfirm(button) { 
	if(button==2){ //If User selected No, then we just do nothing
		return;
	}else{
		navigator.app.exitApp(); // Otherwise we quit the app.
	}
}
$(document).on('mobileinit',function(){
	$.mobile.page.prototype.options.keepNative = "image";
})

// Prevent page caching for login page. (if page transfer to login page, cached page is removed
$(document).on('pagebeforeshow', function (event, ui) {
	console.log("controller document pagebeforeshow event fired..");
	if ($.mobile.activePage.attr("id") == baseLoc )  // || $.mobile.activePage.attr("id") == indexLoc
	{
		$("div[data-role='page']").each(function(element, object) { 
			if (object.id != $.mobile.activePage.attr("id"))
			{
				$("script[id='" + object.id + "']").remove();
				$("style[id=" + object.id + "CSS]").remove();
				// page remove
				$("#"+object.id).remove();
			}
		});
	}
})

jQuery(document).on('pagehide', 'div', function(event, ui) {
	var page = jQuery(event.target);
	//alert("page: " + page.attr("id"));
	if(page.attr('data-cache') == 'never'){
		$("script[id='" + page.attr("id") + "']").remove();
		$("style[id=" + page.attr("id") + "CSS]").remove();
		page.remove();
	}
})

function switchImage() {
	$('#bhlogo').attr('src', aImages[counter]);
	counter += 1;

	if (counter == aImages.length)
	{
		counter=0;
	}
}
function pageSwitch() {
	clearInterval(refreshIntervalId);
	clearInterval(pageIntervalId);
	$.mobile.changePage(objModel[pLoc].C_Template.attr.pId,{transition: 'slide'});
	$.mobile.activePage.trigger('create');
}

$(document).ready(function() {

	refreshIntervalId = setInterval(switchImage, 500);	
	//var url = $.mobile.path.parseUrl(document.location.href);

	$(document).foundation();

	console.log("controller document ready..");

	appInit();

	Number.prototype.toRad = function() 
	{ 
		return this * Math.PI / 180;
	};

	$.distanceFromCurrent = function(orgLat, orgLon, newLat, newLon) {
		var R = 6371;  // Radius of the earch in Km
		var dLat = (newLat - orgLat).toRad();
		var dLon = (newLon - orgLon).toRad();
		
		orgLat = orgLat.toRad();          //conversion to radians
		newLat = newLat.toRad();

		var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(orgLat) * Math.cos(newLat);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));   //must use atan2 as simple arctan cannot differentiate 1/1 and -1/-1
		var distance = R * c;   //sets the distance

		//alert("distance: " + distance);
		distance = Math.round(distance*10)/10;      //rounds number to closest 0.1 km
		
		return distance;    //returns the distance
	};
	
	pageIntervalId = setInterval(pageSwitch, 3000);

});

function appInit() {

	if (pLoc == null || pLoc == "")
	{
		pLoc = baseLoc;  // First Loading Page (Web Intro or Splash screen)
	}

	$.getJSON(dModel, function(data) {
		/* 
			[Asynchronous call for JSON data]
		    [Object Name] DataModel
		    [Page process]
		    1. EmailLogin  (DataModel.EmailLogin)
		    2. FindPwdLogin (DataModel.FindPwdLogin)
		    3. MemberRegLogin (DataModel.MemberRegLogin)
		*/
		objModel = data.DataModel;
		//alert(JSON.stringify(objModel));
		loadMustache();
	})
	.fail(function() { 
		alert("getJSON error..");
		console.log( "error" ); 
	});

}

function pageLuncher(newPage) {
	if (newPage != null)
	{
		pLoc = newPage;
		funMustache();
	}
}

function checkjsfile() {
	var target="script";
	var targetattr="src";
	var allelements = document.getElementsByTagName(target);
	for (var i=allelements.length; i>=0 ; i-- )
	{
		if (allelements[i] != null && allelements[i] != '' && (typeof allelements[i] != 'undefined'))
		{
			console.log("JS file: " + allelements[i] + ": " + allelements[i].getAttribute(targetattr));
		}
	}
}
function checkcssfile() {
	var target="style";
	var targetattr="id";
	var allelements = document.getElementsByTagName(target);
	for (var i=allelements.length; i>=0 ; i-- )
	{
		if (allelements[i] != null && allelements[i] != '' && (typeof allelements[i] != 'undefined'))
		{
			console.log("CSS file: " + allelements[i] + ": " + allelements[i].getAttribute(targetattr));
		}
	}
}
function loadMustache() {
	if ((pLoc != "") || (pLoc != Null))
	{
		var tmpPath = tplPath + objModel[pLoc].C_Template.template;  // Template name
		var cssPath = tplPath + objModel[pLoc].Style + ".css";		  // This page stylesheet
		var jsPath = tplPath + objModel[pLoc].Code + ".js";		  // This page javascript
		
		if ($(objModel[pLoc].C_Template.attr.pId).length > 0) { // This page is already loaded, so for reusing it. (cache)
			$.mobile.changePage(objModel[pLoc].C_Template.attr.pId,{transition: 'none'});
			console.log(objModel[pLoc].C_Template.attr.pId + " already loaded..");
		} else {
			// Style (css) file loading
			$.get(cssPath, function(css)
			{
				$('<style type="text/css" id=' + objModel[pLoc].Style + '></style>')
					.html(css)
					.appendTo("head");
				console.log(objModel[pLoc].Style + " css loading successed..");
			})
			.fail(function() {
				console.log("css loading failed..");
			});
			var s = document.createElement("script");
			s.type = "text/javascript";
			s.id = objModel[pLoc].Code;
			s.src = jsPath;
			$("head").append(s);

			$.get(tmpPath, function(templates, status){
				var contents = $(templates).filter(objModel[pLoc].C_Template.module).html();
				var html = Mustache.render(contents, objModel[pLoc].C_Template.attr);
				$("#mainbody").append(html);
			})
			.fail(function() {
				alert("template loading failed..");
			});
		}
	} 
}

function funMustache() {
	// dynamically create the page using template engine (Mustache)

	// check the information that loaded js & css
	//checkjsfile();
	//checkcssfile();
	if ((pLoc != "") || (pLoc != Null))
	{
		//alert("fun.." + objModel[pLoc].Style);
		var tmpPath = tplPath + objModel[pLoc].C_Template.template;  // Template name
		var cssPath = tplPath + objModel[pLoc].Style + ".css";		  // This page stylesheet
		var jsPath = tplPath + objModel[pLoc].Code + ".js";		  // This page javascript
		
		if ($(objModel[pLoc].C_Template.attr.pId).length > 0) { // This page is already loaded, so for reusing it. (cache)
			//alert($(objModel[pLoc].C_Template.attr.pId).length);
			$.mobile.changePage(objModel[pLoc].C_Template.attr.pId,{transition: 'none'});
			console.log(objModel[pLoc].C_Template.attr.pId + " already loaded..");
		} else {
			/* == 아래코드는 android 브라우저에서는 동작 안함... ===
			  $('<style type="text/css"></style>')
				.html('@import url("' + cssPath + '")')
				.appendTo("head");*/

			// Style (css) file loading
			$.get(cssPath, function(css)
			{
				$('<style type="text/css" id=' + objModel[pLoc].Style + '></style>')
					.html(css)
					.appendTo("head");
				console.log(objModel[pLoc].Style + " css loading successed..");
			})
			.fail(function() {
				console.log("css loading failed..");
			});
			// script file loading
			var s = document.createElement("script");
			s.type = "text/javascript";
			s.id = objModel[pLoc].Code;
			s.src = jsPath;
			// Use any selector
			$("head").append(s);
			// Template (tpl_...html) file loading
			$.get(tmpPath, function(templates, status){
				//alert("templates: " + templates);
				var contents = $(templates).filter(objModel[pLoc].C_Template.module).html();
				//alert(contents);
				var html = Mustache.render(contents, objModel[pLoc].C_Template.attr);
				//var newPage = $(html);
				$("#mainbody").append(html);
				$.mobile.changePage(objModel[pLoc].C_Template.attr.pId,{transition: 'none'});
				$.mobile.activePage.trigger('create');
			})
			.fail(function() {
				alert("template loading failed..");
			});
		}
	} 
	
}

