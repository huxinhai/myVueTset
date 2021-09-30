//验证AK
var is_uses=verifyKey();
var box_deletion_flag=false;
var box_deletion_rectangle=null;
var box_circle_flag=false;
var box_selt_circle=null;
var apimaps=null;
function verifyKey() {
	var scripts = document.getElementsByTagName('script');
	var js_src = scripts[scripts.length - 1].src;
	if (js_src.indexOf("ak") == -1) {
		console.log("缺少AK!!!");
		return false;
	} else {
		var st = js_src.indexOf("?");
		if (st == -1) {
			console.log("缺少AK!!!");
			return false;
		} else {
			var res=false;
			js_src = js_src.substring(st);
			var user_ak = getQueryString("ak");
			if (user_ak) {
				/*var url = "http://58.215.18.241:8093/WxGisApi/serviceApi/verifyKey/" + user_ak;
				var xhr = new XMLHttpRequest();
				xhr.open('GET', url, false);
				xhr.onreadystatechange = function() {
					if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) {
						var datas=JSON.parse(xhr.responseText);
						if(datas.stat==200){
							res= true;
						}else{
							console.log("错误的AK!!!");
							res= false;
						}
					}else{
						console.log("错误的AK!!!");
						res= false;
					}
				};
				xhr.send();*/
				res=true;
				return res;
			} else {
				console.log("缺少AK!!!");
				return false;
			}
		}
	}

	function getQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = js_src.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	}

}
if(is_uses==false){
	throw "AK无效";
}
var api_base_url = "https://zgf.cgj.suzhou.com.cn/web/gisapi/";
var gmurl = "https://zgf.cgj.suzhou.com.cn/arcgis/rest/services/Utilities/Geometry/GeometryServer"; //当前几何服务连接
var api_css_arr = ["arcgis322/esri/css/esri.css",
                   /*"arcgis322/ffcss/boxImg.css",
	"arcgis322/ffcss/new_map.css",
	"arcgis322/ffcss/hxq.css",
	"arcgis322/ffcss/public.css",
	"arcgis322/ffcss/areaManage.css",*/
    "arcgis322/ffcss/gis_maps.css",
	"arcgis322/ffcss/api.css"
];
//https://api.map.baidu.com/api?v=3.0&ak=mV7btZdNGsuR3a2RpDQ3PZ1kogMi8oYC
var api_js_arr = ["javascripts/bdmap.js", "javascripts/layui/layui.all.js"];

function addCSS(urls) {
	var link = document.createElement('link');
	link.type = 'text/css';
	link.rel = 'stylesheet';
	link.href = api_base_url + urls;
	document.getElementsByTagName("head")[0].appendChild(link);
}
for (var i = 0; i < api_css_arr.length; i++) {
	addCSS(api_css_arr[i]);
}
for (var i = 0; i < api_js_arr.length; i++) {
	addJs(api_js_arr[i]);
}

function addJs(path) {
	if (!path || path.length === 0) {
		throw new Error('argument "path" is required !');
	}
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.src = api_base_url + path;
	script.type = 'text/javascript';
	head.appendChild(script);
}
//**********************坐标转换开始********************************************
var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
var PI = 3.1415926535897932384626;
var a = 6378245.0;
var ee = 0.00669342162296594323;

function coordinateTransform(lng, lat, from, to) {
	var arr = [lng, lat];
	if (from == 'bd' && to == 'gd') {
		arr = bd09togcj02(lng, lat);
	} else if (from == 'bd' && to == '84') {
		arr = bdTo84(lng, lat);
	} else if (from == 'gd' && to == '84') {
		arr = gcj02towgs84(lng, lat);
	} else if (from == 'gd' && to == 'bd') {
		arr = gcj02tobd09(lng, lat);
	} else if (from == '84' && to == 'bd') {
		arr = wgs84ToBd(lng, lat);
	} else if (from == '84' && to == 'gd') {
		arr = wgs84togcj02(lng, lat);
	}
	return arr;
}

/**
 * 百度坐标系 (BD-09) 与 WGS84的转换
 * 即 百度 转 WGS84
 * @param bd_lon
 * @param bd_lat
 * @returns {*[]}
 */
function bdTo84(bd_lon, bd_lat) {
	var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
	var x = bd_lon - 0.0065;
	var y = bd_lat - 0.006;
	var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
	var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
	var lng = z * Math.cos(theta);
	var lat = z * Math.sin(theta);

	if (out_of_china(lng, lat)) {
		return [lng, lat];
	} else {
		var dlat = transformlat(lng - 105.0, lat - 35.0);
		var dlng = transformlng(lng - 105.0, lat - 35.0);
		var radlat = lat / 180.0 * PI;
		var magic = Math.sin(radlat);
		magic = 1 - ee * magic * magic;
		var sqrtmagic = Math.sqrt(magic);
		dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
		dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
		mglat = lat + dlat;
		mglng = lng + dlng;
		return [lng * 2 - mglng, lat * 2 - mglat]
	}
}
/**
 * WGS84转百度坐标系 (BD-09)
 * @param lng
 * @param lat
 * @returns {*[]}
 */
function wgs84ToBd(lng, lat) {
	var pts = wgs84togcj02(lng, lat);
	return gcj02tobd09(pts[0], pts[1]);
}
/**
 * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
 * 即 百度 转 谷歌、高德
 * @param bd_lon
 * @param bd_lat
 * @returns {*[]}
 */
function bd09togcj02(bd_lon, bd_lat) {
	var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
	var x = bd_lon - 0.0065;
	var y = bd_lat - 0.006;
	var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
	var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
	var gg_lng = z * Math.cos(theta);
	var gg_lat = z * Math.sin(theta);
	return [gg_lng, gg_lat]
}

/**
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
 * 即谷歌、高德 转 百度
 * @param lng
 * @param lat
 * @returns {*[]}
 */
function gcj02tobd09(lng, lat) {
	var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
	var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
	var bd_lng = z * Math.cos(theta) + 0.0065;
	var bd_lat = z * Math.sin(theta) + 0.006;
	return [bd_lng, bd_lat]
}

/**
 * WGS84转GCj02
 * @param lng
 * @param lat
 * @returns {*[]}
 */
function wgs84togcj02(lng, lat) {
	if (out_of_china(lng, lat)) {
		return [lng, lat]
	} else {
		var dlat = transformlat(lng - 105.0, lat - 35.0);
		var dlng = transformlng(lng - 105.0, lat - 35.0);
		var radlat = lat / 180.0 * PI;
		var magic = Math.sin(radlat);
		magic = 1 - ee * magic * magic;
		var sqrtmagic = Math.sqrt(magic);
		dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
		dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
		var mglat = lat + dlat;
		var mglng = lng + dlng;
		return [mglng, mglat]
	}
}

/**
 * GCJ02 转换为 WGS84
 * @param lng
 * @param lat
 * @returns {*[]}
 */
function gcj02towgs84(lng, lat) {
	if (out_of_china(lng, lat)) {
		return [lng, lat]
	} else {
		var dlat = transformlat(lng - 105.0, lat - 35.0);
		var dlng = transformlng(lng - 105.0, lat - 35.0);
		var radlat = lat / 180.0 * PI;
		var magic = Math.sin(radlat);
		magic = 1 - ee * magic * magic;
		var sqrtmagic = Math.sqrt(magic);
		dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
		dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
		mglat = lat + dlat;
		mglng = lng + dlng;
		return [lng * 2 - mglng, lat * 2 - mglat]
	}
}

function transformlat(lng, lat) {
	var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
	ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
	ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
	ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
	return ret
}

function transformlng(lng, lat) {
	var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
	ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
	ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
	ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
	return ret
}

/**
 * 判断是否在国内，不在国内则不做偏移
 * @param lng
 * @param lat
 * @returns {boolean}
 */
function out_of_china(lng, lat) {
	return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
}
//**********************坐标转换结束********************************************


var initMap = null;
var addtools = null;
var addPoint2 = null;
var addPolyline2 = null;
var addPolygon2 = null;
var loadJs = null;
var initHeatLayer2=null;

function initHeatLayer(blurRadius, colors, arr, lng, lat) {
	if (initHeatLayer2 == null) {
		setTimeout(function() {
			initHeatLayer(blurRadius, colors, arr, lng, lat);
		}, 500);
	} else if (map == null) {
		setTimeout(function() {
			initHeatLayer(blurRadius, colors, arr, lng, lat);
		}, 500);
	} else {
		initHeatLayer2(blurRadius, colors, arr, lng, lat);
	}
}

function loadJsComlete(funcs) {
	if (loadJs == null) {
		setTimeout(function() {
			loadJsComlete(funcs);
		}, 500);
	} else {
		funcs();
	}
}

function addPoint(lng, lat, attr, url, width, height) {
	if (addPoint2 == null) {
		setTimeout(function() {
			addPoint(lng, lat, attr, url, width, height);
		}, 500);
	} else if (map == null) {
		setTimeout(function() {
			addPoint(lng, lat, attr, url, width, height);
		}, 500);
	} else {
		addPoint2(lng, lat, attr, url, width, height);
	}
}

function addPolyline(arr, attr, rgba, width) {
	if (addPolyline2 == null) {
		setTimeout(function() {
			addPolyline(arr, attr, rgba, width);
		}, 500);
	} else if (map == null) {
		setTimeout(function() {
			addPolyline(arr, attr, rgba, width);
		}, 500);
	} else {
		addPolyline2(arr, attr, rgba, width);
	}
}

function addPolygon(arr, attr, rgba_polygon, rgba_line, width) {
	if (addPolygon2 == null) {
		setTimeout(function() {
			addPolygon(arr, attr, rgba_polygon, rgba_line, width);
		}, 500);
	} else if (map == null) {
		setTimeout(function() {
			addPolygon(arr, attr, rgba_polygon, rgba_line, width);
		}, 500);
	} else {
		addPolygon2(arr, attr, rgba_polygon, rgba_line, width);
	}
}
//**********************服务类**********************
var localFunc = null;
var local = null;
var myGeo = null;
initBdMap();

function initBdMap() {
	if ((typeof BMap) != 'undefined') {
		local = new BMap.LocalSearch("苏州市", {
			onSearchComplete: function() {
				var result = local.getResults();
				if (localFunc) {
					localFunc(result);
				}
			}
		});
		myGeo = new BMap.Geocoder();
	} else {
		setTimeout(function() {
			initBdMap();
		}, 500);
	}
}
//兴趣点搜索
function getBdPois(str, funcs) {
	if (local == null) {
		setTimeout(function() {
			getBdPois(str, funcs);
		}, 500);
	} else {
		local.search(str);
		localFunc = funcs;
	}
}
//地址解析
function addressResolution(str, funcs) {
	if (myGeo == null) {
		setTimeout(function() {
			addressResolution(str, funcs);
		}, 500);
	} else {
		myGeo.getPoint(str, function(point) {
			funcs(point);
		}, "苏州市");
	}
}
//逆地址解析
function reverseAddressResolution(lng, lat, funcs) {
	if (myGeo == null) {
		setTimeout(function() {
			reverseAddressResolution(lng, lat, funcs);
		}, 500);
	} else {
		var pt = new BMap.Point(lng, lat);
		myGeo.getLocation(pt, function(rs) {
			funcs(rs);
		});
	}
}
//**********************服务类**********************
var ArcGISTiledMapServiceLayer = null;
var Point = null;
var GraphicsLayer = null;
var Graphic = null;
var PictureMarkerSymbol = null;
var InfoTemplate = null;
var SimpleMarkerSymbol = null;
var SimpleFillSymbol = null;
var ClassBreaksRenderer = null;
var Color = null;
var FeatureLayer = null;
var ArcGISDynamicMapServiceLayer = null;
var SimpleRenderer = null;
var SimpleLineSymbol = null;
var Polyline = null;
var Polygon = null;
var Circle = null;
var TextSymbol=null;
var LabelLayer=null;
var Font=null;
var Query=null;
var QueryTask=null;
var inputBoxSearch=null;
var Moveable=null;
var ClusterLayer=null;
var ClusterLayers=null;
var ClusterLayers=null;
var SpatialReference=null;
var webMercatorUtils=null;
var HeatmapRenderer=null;
var FeatureSet=null;
var InfoWindow=null;
var all_fflabel=null;
require(["esri/map", "ffjs/FfBookmarks", "ffjs/FfLabel", "ffjs/FfMeasurementDistance",
	"esri/layers/ArcGISTiledMapServiceLayer",
	"esri/geometry/Point", "esri/layers/GraphicsLayer", "esri/graphic",
	"esri/symbols/PictureMarkerSymbol", "esri/InfoTemplate",
	"esri/symbols/SimpleMarkerSymbol",
	"esri/dijit/OverviewMap", "esri/dijit/Scalebar",
	"esri/symbols/SimpleFillSymbol", "esri/renderers/ClassBreaksRenderer",
	"esri/Color", "esri/layers/FeatureLayer",
	"esri/layers/ArcGISDynamicMapServiceLayer",
	"ffjs/TiandiLayer", "ffjs/TiandiAnnoLayer",
	"ffjs/YxdiLayer", "ffjs/YxdiAnnoLayer",
	"esri/renderers/SimpleRenderer",
	"esri/symbols/SimpleLineSymbol",
	"esri/symbols/TextSymbol","esri/layers/LabelLayer","esri/symbols/Font",
	"esri/geometry/Polyline", "esri/geometry/Polygon",
	"esri/geometry/Circle","esri/tasks/query","esri/tasks/QueryTask","dojo/dnd/Moveable",
	"ffjs/ClusterLayer","ffjs/ClusterLayers",
	"esri/SpatialReference",
	"esri/geometry/webMercatorUtils",
	"esri/renderers/HeatmapRenderer", "esri/tasks/FeatureSet",
	"esri/dijit/InfoWindow",
	"dojo/domReady!"
], function(Map, FfBookmarks, FfLabel, FfMeasurementDistance,
	ArcGISTiledMapServiceLayer1, Point1, GraphicsLayer1, Graphic1, PictureMarkerSymbol1,
	InfoTemplate1, SimpleMarkerSymbol1, OverviewMap,
	Scalebar, SimpleFillSymbol1, ClassBreaksRenderer1,
	Color1, FeatureLayer1, ArcGISDynamicMapServiceLayer1,
	TiandiLayer, TiandiAnnoLayer, YxdiLayer, YxdiAnnoLayer, SimpleRenderer1,
	SimpleLineSymbol1, TextSymbol1, LabelLayer1, Font1, Polyline1, Polygon1, 
	Circle1,Query1,QueryTask1,Moveable1,ClusterLayer1,ClusterLayers1,SpatialReference1,
	webMercatorUtils1,HeatmapRenderer1,FeatureSet1,InfoWindow1) {
	// bundle.toolbars.draw.resume = "单击以继续绘制,右键取消绘制";
	// bundle.toolbars.draw.complete = "双击完成操作,右键取消绘制";
	// bundle.toolbars.draw.finish = "双击完成操作,右键取消绘制";
	ArcGISTiledMapServiceLayer = ArcGISTiledMapServiceLayer1;
	Point = Point1;
	GraphicsLayer = GraphicsLayer1;
	Graphic = Graphic1;
	PictureMarkerSymbol = PictureMarkerSymbol1;
	InfoTemplate = InfoTemplate1;
	SimpleMarkerSymbol = SimpleMarkerSymbol1;
	SimpleFillSymbol = SimpleFillSymbol1;
	ClassBreaksRenderer = ClassBreaksRenderer1;
	Color = Color1;
	FeatureLayer = FeatureLayer1;
	ArcGISDynamicMapServiceLayer = ArcGISDynamicMapServiceLayer1;
	SimpleRenderer = SimpleRenderer1;
	SimpleLineSymbol = SimpleLineSymbol1;
	Polyline = Polyline1;
	Polygon = Polygon1;
	Circle = Circle1;
	TextSymbol=TextSymbol1;
	LabelLayer=LabelLayer1;
	Font=Font1;
	Query=Query1;
	QueryTask=QueryTask1;
	Moveable=Moveable1;
	ClusterLayer=ClusterLayer1;
	ClusterLayers=ClusterLayers1;
	SpatialReference=SpatialReference1;
	webMercatorUtils=webMercatorUtils1;
	HeatmapRenderer=HeatmapRenderer1;
	FeatureSet=FeatureSet1;
	InfoWindow=InfoWindow1;
	var gly = new GraphicsLayer();
	var fflabel = null; //标注
	var ffmsdt = null; //测量
	var overviewMapDijit = null; //鹰眼
	var showoVer = 1;
	var ffbm = null; //书签
	var ffmsdtoptions = null;
	var fflabeloptions = null;
	var ffbmoptions = null;
	var tdlayer = null;
	var annolayer = null;
	var yxtdlayer = null;
	var yxannolayer = null;
	/*try{
		$(document).ajaxStart(function () {
			$(".public-loading").show();
		});
		$(document).ajaxStop(function () {
			$(".public-loading").hide();
		});
	}catch(e){
		console.log(e);
	}*/
	/**
	 * @param {Object} id
	 * @param {Object} center
	 * @param {Object} zoom
	 * 初始化地图
	 */
	initMap = function(id, options,areas) {
		var map = new Map(id, options);
		var scalebar = new Scalebar({
			map: map,
			attachTo: "bottom-left",
			scalebarStyle: "ruler",
			scalebarUnit: "metric",
		});
		if(areas=='苏州'){
			tdlayer =new ArcGISTiledMapServiceLayer("https://zgf.cgj.suzhou.com.cn/GIS_GMapCacheProxy/Tile/hashsz/suzhou.gis")
			map.addLayer(tdlayer);
			yxtdlayer=new ArcGISTiledMapServiceLayer("https://zgf.cgj.suzhou.com.cn/GIS_GMapCacheProxy/Tile/imagemap/suzhou.gis")
		}else{
			tdlayer = new TiandiLayer();
			annolayer = new TiandiAnnoLayer();
			map.addLayer(tdlayer);
			map.addLayer(annolayer);
			yxtdlayer = new YxdiLayer();
			yxannolayer = new YxdiAnnoLayer();
		}
		
		/*map.on("click", function(e) {
			console.log("[" + e.mapPoint.x + "," + e.mapPoint.y + "]");
		})*/
		
		//加减地图层级
		map.on("zoom-end", function () {
			document.querySelector(".zoom").innerHTML = map.getZoom();
		})
		$(".map-enlarge").on("click", function () {
			var curZoom = document.querySelector(".zoom").innerHTML;
			if (curZoom >= 19) {
				return;
			}
			map.setZoom(parseInt(curZoom) + 1);
		})
		$(".map-narrow").on("click", function () {
			var curZoom = document.querySelector(".zoom").innerHTML;
			if (curZoom <= 0) {
				return;
			}
			map.setZoom(parseInt(curZoom) - 1);
		})
		
		//var dnd = new Moveable(map.infoWindow.domNode);
		apimaps=map;
		return map;
	}
	/**
	 * 加载热力图层
	 */
	initHeatLayer2=function(blurRadius, colors, arr, lng, lat){
		if (!blurRadius) {
			blurRadius = 10;
		}
		if (!colors) {
			colors = ["rgba(0, 255, 150, 0)",
						"rgb(250, 250, 0)",
						"rgb(250, 150, 0)",
						"rgb(255, 50, 0)"
					];
		}
		var heatmapRenderer = new HeatmapRenderer({
			//field: "num",
			blurRadius: blurRadius,
			//颜色设置
			colors: colors,
			maxPixelIntensity: 100,
			minPixelIntensity: 0
		});
		var heat_style = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(
				SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 0.5), new Color([0, 0, 255, 1]));
		var layerDefinition = {
			"objectIdField": "FID",
			"geometryType": "esriGeometryPoint",
			"fields": [{
					"name": "FID",
					"type": "esriFieldTypeOID",
					"alias": "FID"
				}
			]
		};
		var wgs4326 = new SpatialReference({
			"wkid": 4326
		});
		var features = [];
		for (var i = 0; i < arr.length; i++) {
			var pob = arr[i];
			let lngs=parseFloat(pob[lng]);
			let lats=parseFloat(pob[lat]);
			var latlng = new Point(lngs, lats, wgs4326);
			var graphic = new esri.Graphic(latlng, heat_style, {
				"FID": i
			});
			features.push(graphic);
		}
		var featureSet = new FeatureSet();
		featureSet.features = features;
		featureSet.geometryType = 'esriGeometryPoint';
		featureSet.fieldAliases = {
			"FID": "FID"
		};
		featureSet.spatialReference =wgs4326;
		var featureCollection = {
			layerDefinition: layerDefinition,
			featureSet: featureSet
		};
		var heat_layer= new FeatureLayer(featureCollection, {
			mode: FeatureLayer.MODE_SNAPSHOT
		});
		heat_layer.setRenderer(heatmapRenderer);
		apimaps.addLayer(heat_layer);
		return heat_layer;
	}
	/**
	 * @param {Object} lng
	 * @param {Object} lat
	 * @param {Object} attr
	 * @param {Object} url
	 * @param {Object} width
	 * @param {Object} height
	 * 加载点
	 */
	addPoint2 = function(lng, lat, attr, url, width, height) {
		var point = new Point(lng, lat);
		if (!url) {
			url = "images/AmapLabel.png";
		}
		if (!width) {
			width = 26;
		}
		if (!height) {
			height = 35;
		}
		var pngs = new PictureMarkerSymbol(url, width, height);
		var graphic = new Graphic(point, pngs, attr, null);
		gly.add(graphic);
		map.removeLayer(gly);
		map.addLayer(gly);
	}
	/**
	 * @param {Object} arr
	 * @param {Object} attr
	 * @param {Object} rgba
	 * @param {Object} width
	 * 加载线
	 */
	addPolyline2 = function(arr, attr, rgba, width) {
		var lines = new Polyline(arr);
		if (!rgba) {
			rgba = [255, 0, 0];
		}
		if (!width) {
			width = 4;
		}
		var symbols = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
			new Color(rgba), width);
		var graphic = new Graphic(lines, symbols, attr, null);
		gly.add(graphic);
		map.removeLayer(gly);
		map.addLayer(gly);
	}
	/**
	 * @param {Object} arr
	 * @param {Object} attr
	 * @param {Object} rgba_polygon
	 * @param {Object} rgba_line
	 * @param {Object} width
	 * 加载面
	 */
	addPolygon2 = function(arr, attr, rgba_polygon, rgba_line, width) {
		var polygon = new Polygon(arr);
		if (!rgba_polygon) {
			rgba_polygon = [255, 0, 0];
		}
		if (!rgba_line) {
			rgba_line = [0, 255, 0];
		}
		if (!width) {
			width = 4;
		}
		var symbols = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
			new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
				new Color(rgba_line), width), new Color(rgba_polygon)
		);
		var graphic = new Graphic(polygon, symbols, attr, null);
		gly.add(graphic);
		map.removeLayer(gly);
		map.addLayer(gly);
	}
	/**
	 * 加载输入框搜索
	 */
	inputBoxSearch=function (maps,inputid,btnid,clearid){
		if(maps&&inputid&&btnid&&clearid){
			if ((typeof BMap) != 'undefined') {
				var graphicly = new GraphicsLayer();
				maps.addLayer(graphicly);
				var placepng = new PictureMarkerSymbol("https://zgf.cgj.suzhou.com.cn/web/gisapi/images/red.png", 64,64);
				var acs = new BMap.Autocomplete({
	                "input": inputid,
	                "location": "苏州市"
	            });
	            var locals = new BMap.LocalSearch("苏州", {
	                onSearchComplete: myFun
	            });
	            acs.addEventListener("onconfirm", function (e) { //鼠标点击下拉列表后的事件
	            	graphicly.clear();
	            	var value = e.item.value.business;
	                locals.search(value);
	            });
	            $("#"+btnid).on("click", function () {
	                $(".loading").show();
	                graphicly.clear();
	                var placekey = $("#"+inputid).val();
	                placekey = $.trim(placekey);
	                if (placekey.length == 0) {
	                    layui.layer.alert("请输入地址");
	                } else {
	                    locals.search(placekey);
	                }
	                $(".loading").hide();
	            })
	             $("#"+clearid).click(function () {
	                $("#"+inputid).val("");
	                graphicly.clear();
	            })
	             function myFun() {
	                var result = locals.getResults();
	                var num = result.getNumPois();
	                for (var i = 0; i < num; i++) {
	                    var pois = result.getPoi(i);
	                    if (pois != undefined) {
	                        var pp = result.getPoi(i).point;
	                        var zuobiao84 = bdTo84(pois.point.lng, pois.point.lat);
	                        var pt = new Point(zuobiao84);
	                        var content = "<div class='ffdialogdetail'>名称:<span  class='ffdialoginp'>" + pois
	                            .title +
	                            "</span></div>" +
	                            "<div class='ffdialogdetail'>地址:<span  class='ffdialoginp'>" + pois.address +
	                            "</span></div>";
	                        infoTemplate = new InfoTemplate("<center>搜索结果</center>", content);
	                        graphic = new Graphic(pt, placepng, null, infoTemplate);
	                        graphicly.add(graphic);
	                        if (i == 0) {
	                        	maps.centerAt(pt);
	                        }
	                    }
	                }
	            }
			} else {
				setTimeout(function() {
					inputBoxSearch(maps,inputid,btnid,clearid);
				}, 500);
			}
		}else{
			layui.layer.alert("缺少必须参数");
		}
	}
	/**
	 * 加载工具箱
	 */
	addtools = function(map, objs,funcs) {
		var endDraw=null;
		if(funcs){
			endDraw=funcs;
		}
		if(objs != "!@#"){
			var tools_htmls =
				'<div class="all_tool_box_parent"><div class="all_tool_box flexbox tool-boxnew" style="display:block;"><a id="tool_gongju"><i class="iconfont">&#xe61d;</i><span>标记</span><div class="gongju gongju1"><ul style="display:block;background:transparent"><li id="signPoint"><i class="iconfont">&#xe63a;</i><span>标点</span></li><li id="signLine"><i class="iconfont">&#xe63a;</i><span>标线</span></li><li id="signPolygon"><i class="iconfont">&#xe63a;</i><span>标面</span></li></ul></div></a><a id="cehuitool"><i class="iconfont iconcehuigongju"></i><span>测绘工具</span><div class="gongju gongju2"><ul style="display:block;background:transparent"><li id="measurepoint"><i class="iconfont">&#xe63b;</i><span>测点</span></li><li id="measureline"><i class="iconfont">&#xe63b;</i><span>测距</span></li><li id="measurepolygon"><i class="iconfont">&#xe63b;</i><span>测面</span></li></ul></div></a><div id="sqtool"></div><a id="qiehuan"><i class="iconfont">&#xe61e;</i><span>切换地图</span><ul title="" id="dtqhtool" style="width: 106px;left:0px;top: 46px;"><li><img class="bmap" name="ditu" src="https://zgf.cgj.suzhou.com.cn/web/gisapi/images/bmbk0.png" /> 矢量</li><li><img class="bmap" name="yxtu" src="https://zgf.cgj.suzhou.com.cn/web/gisapi/images/bmbk2.png" /> 影像</li></ul></a><a id="yingyan"><i class="iconfont">&#xeafa;</i><span>鹰眼</span></a><a id="box_circle_id"><i class="iconfont">&#xeafa;</i><span>半径筛选</span></a><a id="clearbiaozhu"><i class="iconfont">&#xeafd;</i><span>清空标注</span></a></div></div>'
			$("body").append(tools_htmls);
			if (objs) {
				var backgroundColor = objs["backgroundColor"];
				if (backgroundColor) {
					$(".all_tool_box_parent .tool-boxnew").css("background", backgroundColor);
					$(".all_tool_box_parent .tool-boxnew > a .gongju").css("background", backgroundColor);
					$(".esriSimpleSlider").css("background", backgroundColor);
					$(".esriSimpleSlider div").css("background", backgroundColor);
					$(".all_tool_box_parent .all_tool_box ul").css("background", backgroundColor);
				}
				var fontColor = objs["fontColor"];
				if (fontColor) {
					$(".all_tool_box_parent .tool-boxnew > a").css("color", fontColor);
					$(".esriSimpleSlider").css("color", fontColor);
					$(".all_tool_box_parent li").css("color", fontColor);
				}
				var mark = objs["mark"];
				if (false == mark) {
					$("#tool_gongju").hide();
				}
				var mapping = objs["mapping"];
				if (false == mapping) {
					$("#cehuitool").hide();
				}
				var switchMap = objs["switchMap"];
				if (false == switchMap) {
					$("#qiehuan").hide();
				}
				var overview = objs["overview"];
				if (false == overview) {
					$("#yingyan").hide();
				}
				var clearLabel = objs["clearLabel"];
				if (false == clearLabel) {
					$("#clearbiaozhu").hide();
				}
			}
		}
		// var tools_htmls2='<div class="toolBar"><div class="toolCase" id="showTools"><i class="iconfont icongongjuxiang"></i></div><div class="reset" id="refreshTools"><i class="iconfont iconshuaxin"></i></div></div>';
		// $("body").append(tools_htmls2);
		//注册书签
		/* ffbmoptions = {
			"map": map,
			"refreshurl": path + "dbGisBookmarks/saveBookmarks",
			"showurl": path + "dbGisBookmarks/showBookmarks",
			"divbm": "sqtool",
			"oper": clientoper,
		};
		ffbm = new FfBookmarks(ffbmoptions); */
		fflabeloptions = {
			"map": map,
			"btnpoint": "signPoint",
			"btnline": "signLine",
			"btnpolygon": "signPolygon",
			"btnCircle": "box_circle_id",
			"endDraw":endDraw
		};
		fflabel = new FfLabel(fflabeloptions);
		all_fflabel=fflabel;
		ffmsdtoptions = {
			"map": map,
			"btnpoint": "measurepoint",
			"btnline": "measureline",
			"btnpolygon": "measurepolygon",
			"gmurl": gmurl,
		};
		ffmsdt = new FfMeasurementDistance(ffmsdtoptions);
		//鹰眼功能
		overviewMapDijit = new OverviewMap({
			map: map,
			attachTo: "bottom-left",
			color: " #D84E13",
			opacity: 0.3
		});
		//调用鹰眼显示方法
		$("#yingyan").click(function() {
			if (showoVer == 1) {
				showoVer = 2;
				overviewMapDijit.show();
			} else {
				showoVer = 1;
				overviewMapDijit.hide();
			}
			$("#sqtool").hide(); //书签
			$(".all_tool_box .gongju").hide(); //标注测绘
			$("#dtqhtool").hide(); //底图切换
			$("#searchtable").hide();
			$("#objectTable").hide(); //部件标识码搜索

		})
		overviewMapDijit.startup(); //和用户一起交互
		toolBindEvent(map);
	}

	/**
	 * 给工具箱绑定事件
	 */
	function toolBindEvent(map) {
		//地图工具点击事件
		$(".all_tool_box>a").on("click", function() {
			var classs = $(this).attr("class");
			var id = $(this).attr("id");
			var clsName = $("#wangge").attr("class");

			if (classs == undefined || classs == '') {
				$(this).addClass('a_active').siblings().removeClass('a_active');
			} else {
				$(this).removeClass('a_active');
			}

			if (!id || id != "wangge") {
				if (clsName && clsName.indexOf("a_active") != -1) {
					$("#wangge").addClass("a_active");
				}
			}

		})

		$(".all_tool_box .new_view img").on("click", function() {
			$(this).addClass('img_border').parent("li").siblings('li').find('img').removeClass(
				'img_border');

		})
		$(".all_tool_box .new_view .hides").on("click", function(e) {
			e.stopPropagation();
			$(".all_tool_box .new_view").hide();

		})
		$("#shuqian").on("click", function() {
			$("#sqtool").slideToggle();
			overviewMapDijit.hide(); //鹰眼
			showoVer = 1;
			$(".all_tool_box .gongju").hide(); //标注测绘
			$("#dtqhtool").hide(); //底图切换
			$("#searchtable").hide();
			$("#objectTable").hide(); //部件标识码搜索
		})
		$("#placesearch").on("click", function() {
			$("#searchtable").slideToggle();
			$("#sqtool").hide();
			overviewMapDijit.hide(); //鹰眼
			showoVer = 1;
			$(".all_tool_box .gongju").hide(); //标注测绘
			$("#dtqhtool").hide(); //底图切换
			$("#objectTable").hide(); //部件标识码搜索
		})
		$("#tool_gongju").on("click", function() {
			$(".all_tool_box .gongju1").slideToggle();
			$(".all_tool_box .gongju2").hide();
			$("#sqtool").hide(); //书签
			overviewMapDijit.hide(); //鹰眼
			showoVer = 1;
			$("#dtqhtool").hide(); //底图切换
		})

		// 测绘工具
		$("#cehuitool").on("click", function() {
			$(".all_tool_box .gongju2").slideToggle();
			$(".all_tool_box .gongju1").hide();
			$("#sqtool").hide(); //书签
			overviewMapDijit.hide(); //鹰眼
			showoVer = 1;
			$("#dtqhtool").hide(); //底图切换
			$("#searchtable").hide();
		})
		// 切换地图
		$("#qiehuan").on("click", function() {
			$("#dtqhtool").slideToggle();
			$(".all_tool_box .gongju1").hide();
			$(".all_tool_box .gongju2").hide();
			$("#sqtool").hide(); //书签
			overviewMapDijit.hide(); //鹰眼
			showoVer = 1;
			$("#searchtable").hide();
			$("#objectTable").hide(); //部件标识码搜索
			$(".tool-bottomnew").hide(); // 新建结构面

			$(".shadow-formFilter").hide(); // 案件筛选
			if ($("#anjiansearch").find("i").hasClass('icon-fanzhuan')) {
				$("#anjiansearch").find("i").removeClass("icon-fanzhuan")
			}
		})

		$("#clearbiaozhu").on("click", function() {
			$("#sqtool").hide(); //书签
			if (overviewMapDijit) {
				overviewMapDijit.hide(); //鹰眼
			}
			showoVer = 1;
			$(".all_tool_box .gongju").hide(); //标注测绘
			if (fflabel) {
				fflabel.clear();
			}
			if (ffmsdt) {
				ffmsdt.clearMeasureDistance();
			}
			$("#dtqhtool").hide(); //底图切换
			$("#searchtable").hide();
			$("#objectTable").hide(); //部件标识码搜索
		})

		var bmap = "ditu";
		$("body").on("click", ".bmap", function() {
			var name = $(this).attr("name");
			if (name != bmap) {
				if (name == 'ditu') {
					//style.sheet.insertRule(map_css, 0);
					if(annolayer){
						map.addLayer(tdlayer);
						map.addLayer(annolayer);
						map.removeLayer(yxtdlayer);
						map.removeLayer(yxannolayer);
					}else{
						map.addLayer(tdlayer);
						map.removeLayer(yxtdlayer);
					}
				} else {
					if(annolayer){
						//style.sheet.deleteRule(0);
						map.removeLayer(tdlayer);
						map.removeLayer(annolayer);
						map.addLayer(yxtdlayer);
						map.addLayer(yxannolayer);
					}else{
						map.removeLayer(tdlayer);
						map.addLayer(yxtdlayer);
					}
				}
				bmap = name;
			}
		})
	}
	loadJs = "finished";
});
