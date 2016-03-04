batsapp.controller('batsAnalytics', function($scope, $http) {
	$scope.token = adminToken;
	$scope.customer = {};
	$scope.customer.token = $scope.token;
	$scope.deviceSelected=false;
	$scope.yoData=true;
	$scope.noData=true;
	$scope.noanalyticsData=true;
	$scope.analyticsData=true;
	/**--------------------------------------------------------------------------------------------
		setting useUTC false for the highcharts is to show the time in 24hrs format and avoid UTC
							ref link : http://api.highcharts.com/highcharts#global
	--------------------------------------------------------------------------------------------*/
	Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });
    /**--------------------------------------------------------------------------------------------
    					basic settings for the HIGHCHARTS via this json
    						ref link http://jsfiddle.net/pablojim/cp73s/
    --------------------------------------------------------------------------------------------*/
    $scope.highchartsNG = {
          options: {
            chart: {
              type: 'spline'
            }, 
            xAxis: {
                  type: 'datetime',
                  dateTimeLabelFormats: { // don't display the dummy year
                    second: '%H:%M:%S',
                    minute: '%H:%M',
                    day: '%e of %b',
                    month:'%b \'%y',
                    year: '%y'
                }
              },
            yAxis: {
                  title: {
                    text: 'Snow depth (m)'
                  },
                  min: 0
                },
                title: {
                  text: 'Date'
                },
                plotOptions: {
                  spline: {
                    marker: {
                      enabled: true
                    }
                  }
                }
            },
          title: {text: 'Hello'},
          loading: false
        };
    
	$http({
		method : 'POST',
		url : apiURL + 'group/list',
		data : JSON.stringify($scope.customer),
		headers : {
			'Content-Type' : 'application/json'
		}
	}).success(function(data) {
		listGroup(data);
		//console.log(data);
		// console.log(JSON.stringify($scope.glist));
	}).error(function(data, status, headers, config) {
		alert(data.err);
		console.log(data.err);
		console.log(status);
		console.log(headers);
		console.log(config);
	});
	/**
	 * function to list the group id and name
	 */

	 function listGroup(data) {
	 	var glist = [];
	 	for ( var inc = 0; inc < data.glist.length; inc++) {
	 		glist.push(data.glist[inc]);
	 	}
	 	$scope.groupList = glist;
		// console.log($scope.groupList);
	}
	/**
	 * fetch device list based on group id
	 */
	 $scope.fetchDevicelist = function(groupID) {
		// console.log(groupID);
		$scope.groupdevicejson = {};
		$scope.groupdevicejson.token = $scope.token;
		$scope.groupdevicejson.gid = groupID;
		/**
		 * get device list based on group ID
		 */

		 $http({
		 	method : 'POST',
		 	url : apiURL + 'group/devlist',
		 	data : JSON.stringify($scope.groupdevicejson),
		 	headers : {
		 		'Content-Type' : 'application/json'
		 	}
		 }).success(function(data) {
		 	$scope.groupDevice = data;
		 	listDevice(data);
		 }).error(function(data, status, headers, config) {
		 	alert(data.err);
		 	console.log(data);
		 	console.log(status);
		 	console.log(headers);
		 	console.log(config);
		 });
		};
	/**
	 * ------------------dev list ends----------------------------*
	 */
	 function listDevice(deviceData) {
	 	var dev_len = deviceData.devlist.length;
	 	$scope.deviceList = [];
	 	for ( var inc = 0; inc < dev_len; inc++) {
	 		$scope.deviceList.push(deviceData.devlist[inc].devid);
	 	}
	 }

	 /**
	 	Analysis Choice based API call
	 	1)Speed Analytics Report
	 	2)Distance Analytics Report
*/
$scope.analysisChoice=function(choice){
	$scope.analysis={};
	$scope.analysis.token=$scope.token;
	$scope.durationChoice=function(duration){
	 		//current date
	 		if(duration=="1"){
	 			var st=new Date();
	 			st.setHours(0);
	 			st.setMinutes(0);
	 			st.setSeconds(0);
				//console.log(st.getTime());
				$scope.analysis.sts=st.getTime();//start timestamp for year set with 12:00AM 
				st.setHours(23);
				st.setMinutes(59);
				st.setSeconds(59);
				//console.log(st.getTime());		
				$scope.analysis.ets=st.getTime();//end timestamp for year set with 12:59PM 
				//console.log(JSON.stringify($scope.analysis));
				if(choice=="1")//call speed analysis
				{
					speedAnalysis($scope.analysis);
				}
				else{//call distance analysis
					distanceAnalysis($scope.analysis);
				}	
			}
	 		//current month
	 		else if(duration=="2"){
	 			var date = new Date();
	 			var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
	 			var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
	 			//console.log(firstDay);
	 			//console.log(lastDay);
	 			var st=new Date(firstDay);
	 			st.setHours(0);
	 			st.setMinutes(0);
	 			st.setSeconds(0);
	 			//console.log(st.getTime());
				$scope.analysis.sts=st.getTime();//start timestamp for month set with 12:00AM 
				var et=new Date(lastDay);
				et.setHours(23);
				et.setMinutes(59);
				et.setSeconds(59);
				//console.log(et.getTime());	
				$scope.analysis.ets=et.getTime();//end timestamp for month set with 12:59PM 
				if(choice=="1")//call speed analysis
				{
					speedAnalysis($scope.analysis);
				}
				else{//call distance analysis
					distanceAnalysis($scope.analysis);
				}	
			}
	 		//current year
	 		else{
	 			var date = new Date();
	 			var firstDay = new Date(date.getFullYear(),0, 1);
	 			var lastDay = new Date(date.getFullYear()+1,0, 0);
	 			//console.log(firstDay);
	 			//console.log(lastDay);
	 			var st=new Date(firstDay);
	 			st.setHours(0);
	 			st.setMinutes(0);
	 			st.setSeconds(0);
	 			//console.log(st.getTime());
				$scope.analysis.sts=st.getTime();//start timestamp for year set with 12:00AM 
				var et=new Date(lastDay);
				et.setHours(23);
				et.setMinutes(59);
				et.setSeconds(59);
				//console.log(et.getTime());	
				$scope.analysis.ets=et.getTime();//end timestamp for year set with 12:59PM 
				if(choice=="1")//call speed analysis
				{
					speedAnalysis($scope.analysis);
				}
				else{//call distance analysis
					distanceAnalysis($scope.analysis);
				}	
			}
		}
	 	//1)Speed Analytics Report API
if(choice==1){
	$scope.analysis.devlist=$scope.deviceList;
}
	 	//2)Distance Analytics Report API
else{
	$scope.analysis.devlist=$scope.deviceList;
}
};
	 /*
	 		-----------------------------------------------speedAnalysisAPI-----------------------------------------------
	 		*/
	 		function speedAnalysis(){
	 			//console.log(JSON.stringify($scope.analysis));
	 			$http({
	 				method : 'POST',
	 				url : apiURL + 'app/speed_analytic_report',
	 				data : JSON.stringify($scope.analysis),
	 				headers : {
	 					'Content-Type' : 'application/json'
	 				}
	 			}).success(function(data) {
		 	//console.log(JSON.stringify(data.values));
		 	plotSpeedGraph(data);
		 }).error(function(data, status, headers, config) {
		 	alert(data.err);
		 	console.log(data);
		 	console.log(status);
		 	console.log(headers);
		 	console.log(config);
		 });
		}
		function plotSpeedGraph(dataVal){
			var series=[];
			var perDevice={};
			var data=[];
		for(var inc=0;inc<dataVal.length;inc++){
				perDevice.id=dataVal[inc].dev_id;
				var values=dataVal[inc].values;
				if(values.length>0){
						$scope.noanalyticsData=true;
						$scope.analyticsData=false;
							for(var j=0;j<values.length;j++){
								var speedTSVal=[];
								speedTSVal.push(values[j].ts,values[j].Velocity);
								data.push(speedTSVal);
							}
						perDevice.data=data;
						series.push(perDevice);
					}
				else{
					$scope.noanalyticsData=false;
					$scope.analyticsData=true;
					}
			}
			//console.log(series);
			//console.log(JSON.stringify(series));
			$scope.highchartsNG.title.text="SPEED Analysis"
			$scope.highchartsNG.options.yAxis.title.text="Velocity in KMpH";
			$scope.highchartsNG.series=series;
			
		}
	 		/*
	 		-----------------------------------------------distanceAnalysisAPI-----------------------------------------------
	 		*/
	 	function distanceAnalysis(){
	 			//console.log(JSON.stringify($scope.analysis));
	 			$http({
	 				method : 'POST',
	 				url : apiURL + 'app/km_covered_analytic_report',
	 				data : JSON.stringify($scope.analysis),
	 				headers : {
	 					'Content-Type' : 'application/json'
	 				}
	 			}).success(function(data) {
	 				console.log(JSON.stringify(data));
	 			}).error(function(data, status, headers, config) {
	 				alert(data.err);
	 				console.log(data);
	 				console.log(status);
	 				console.log(headers);
	 				console.log(config);
	 			});
	 		}

	 		$scope.graph = {};
	 		$scope.graph.data = [
    //Awake
    [16, 15, 20, 12, 16, 12, 8],
    //Asleep
    [8, 9, 4, 12, 8, 12, 14]
    ];
    $scope.graph.labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    $scope.graph.series = ['Awake', 'Asleep'];
});
//Manually imported the angular-chart.js library because no CDN hosted it.
!function(t){"use strict";"function"==typeof define&&define.amd?define(["angular","chart.js"],t):"object"==typeof exports?module.exports=t(require("angular"),require("chart.js")):t(angular,Chart)}(function(t,e){"use strict";function n(){var n={},r={Chart:e,getOptions:function(e){var r=e&&n[e]||{};return t.extend({},n,r)}};this.setOptions=function(e,r){return r?(n[e]=t.extend(n[e]||{},r),void 0):(r=e,n=t.extend(n,r),void 0)},this.$get=function(){return r}}function r(n){function r(t,e){return t&&e&&t.length&&e.length?Array.isArray(t[0])?t.length===e.length&&t[0].length===e[0].length:e.reduce(a,0)>0?t.length===e.length:!1:!1}function a(t,e){return t+e}function o(e,r,a){if(r.data&&r.data.length){r.getColour="function"==typeof r.getColour?r.getColour:l,r.colours=c(e,r);var o=a[0],u=o.getContext("2d"),s=Array.isArray(r.data[0])?g(r.labels,r.data,r.series||[],r.colours):p(r.labels,r.data,r.colours),f=t.extend({},n.getOptions(e),r.options),h=new n.Chart(u)[e](s,f);return r.$emit("create",h),["hover","click"].forEach(function(t){r[t]&&(o["click"===t?"onclick":"onmousemove"]=i(r,h,t))}),r.legend&&"false"!==r.legend&&v(a,h),h}}function i(t,e,n){return function(r){var a=e.getPointsAtEvent||e.getBarsAtEvent||e.getSegmentsAtEvent;if(a){var o=a.call(e,r);t[n](o,r),t.$apply()}}}function c(r,a){for(var o=t.copy(a.colours||n.getOptions(r).colours||e.defaults.global.colours);o.length<a.data.length;)o.push(a.getColour());return o.map(u)}function u(t){return"object"==typeof t&&null!==t?t:"string"==typeof t&&"#"===t[0]?s(d(t.substr(1))):l()}function l(){var t=[f(0,255),f(0,255),f(0,255)];return s(t)}function s(t){return{fillColor:h(t,.2),strokeColor:h(t,1),pointColor:h(t,1),pointStrokeColor:"#fff",pointHighlightFill:"#fff",pointHighlightStroke:h(t,.8)}}function f(t,e){return Math.floor(Math.random()*(e-t+1))+t}function h(t,e){return"rgba("+t.concat(e).join(",")+")"}function d(t){var e=parseInt(t,16),n=e>>16&255,r=e>>8&255,a=255&e;return[n,r,a]}function g(e,n,r,a){return{labels:e,datasets:n.map(function(e,n){var o=t.copy(a[n]);return o.label=r[n],o.data=e,o})}}function p(t,e,n){return t.map(function(t,r){return{label:t,value:e[r],color:n[r].strokeColor,highlight:n[r].pointHighlightStroke}})}function v(t,e){var n=t.parent(),r=n.find("chart-legend"),a="<chart-legend>"+e.generateLegend()+"</chart-legend>";r.length?r.replaceWith(a):n.append(a)}function y(t,e,n){Array.isArray(n.data[0])?t.datasets.forEach(function(t,n){(t.points||t.bars).forEach(function(t,r){t.value=e[n][r]})}):t.segments.forEach(function(t,n){t.value=e[n]}),t.update(),n.$emit("update",t)}function C(t){return!t||Array.isArray(t)&&!t.length||"object"==typeof t&&!Object.keys(t).length}return function(e){return{restrict:"CA",scope:{data:"=",labels:"=",options:"=",series:"=",colours:"=?",getColour:"=?",chartType:"=",legend:"@",click:"=",hover:"="},link:function(n,a){function i(r,i){if(!C(r)&&!t.equals(r,i)){var u=e||n.chartType;u&&(c&&c.destroy(),c=o(u,n,a))}}var c,u=document.createElement("div");u.className="chart-container",a.replaceWith(u),u.appendChild(a[0]),"object"==typeof window.G_vmlCanvasManager&&null!==window.G_vmlCanvasManager&&"function"==typeof window.G_vmlCanvasManager.initElement&&window.G_vmlCanvasManager.initElement(a[0]),n.$watch("data",function(t,i){if(t&&t.length&&(!Array.isArray(t[0])||t[0].length)){var u=e||n.chartType;if(u){if(c){if(r(t,i))return y(c,t,n);c.destroy()}c=o(u,n,a)}}},!0),n.$watch("series",i,!0),n.$watch("labels",i,!0),n.$watch("options",i,!0),n.$watch("colours",i,!0),n.$watch("chartType",function(e,r){C(e)||t.equals(e,r)||(c&&c.destroy(),c=o(e,n,a))}),n.$on("$destroy",function(){c&&c.destroy()})}}}}e.defaults.global.responsive=!0,e.defaults.global.multiTooltipTemplate="<%if (datasetLabel){%><%=datasetLabel%>: <%}%><%= value %>",e.defaults.global.colours=["#97BBCD","#DCDCDC","#F7464A","#46BFBD","#FDB45C","#949FB1","#4D5360"],t.module("chart.js",[]).provider("ChartJs",n).factory("ChartJsFactory",["ChartJs",r]).directive("chartBase",["ChartJsFactory",function(t){return new t}]).directive("chartLine",["ChartJsFactory",function(t){return new t("Line")}]).directive("chartBar",["ChartJsFactory",function(t){return new t("Bar")}]).directive("chartRadar",["ChartJsFactory",function(t){return new t("Radar")}]).directive("chartDoughnut",["ChartJsFactory",function(t){return new t("Doughnut")}]).directive("chartPie",["ChartJsFactory",function(t){return new t("Pie")}]).directive("chartPolarArea",["ChartJsFactory",function(t){return new t("PolarArea")}])});
//# sourceMappingURL=angular-chart.min.js.map
