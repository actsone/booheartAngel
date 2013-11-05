/*
[Name] global.js
#purpose : for global variables
#
*/
var pLoc;  // Global variables for page location
var baseLoc = "indexEmail";
var indexLoc = "indexMain";
var tplPath = "./framework/tpl/"; // Template path for mustache
var imgRoot = "./images/";
var imgPath = imgRoot + "BH_0708/";	  // base images directory
var dModel = "datamodel1.json"; // Data Model-based frame information
var objModel;

// 초기 맵 위치 값 (Geolocation 또는 사용자 설정 값에 의해서 변경)
// 현재 37.497231, 127.027352 값은 강남역 사거리
var baseLat = 37.497231;
var baseLot = 127.027352;
var clat; // 현재 사용자 위치 기본 좌표 (좌표 인식 안되었을 경우  default: baseLat 값으로 사용)
var clng;
var plat; // 특정 사용자 지정 좌표 (특정 카페 위치등 확인 용도)
var plng;
var baseRadius = 100000; // 검색 범위 (m) 설정 (100Km)
var markersData;  		// Marker 위한 위치 정보 데이터
var mData;
var tPoint;		// personal points.
var searchId;   // for Shop searching.
var donationId; // for Donation searching.
var deviceSW = 0;	// for phonegap (0 is accssed from web, 1 is accessed from phonegap)

// splash image animation
var counter = 1;
var refreshIntervalId;
var pageIntervalId;
var aImages = [
	"./images/splash_logo_1.png",
	"./images/splash_logo_2.png",
	"./images/splash_logo_3.png"
];