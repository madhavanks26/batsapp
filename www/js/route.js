batsapp.controller('batsRoute', function($scope, $http) {
	$scope.token = adminToken;
	$scope.customer = {};
	$scope.customer.token = $scope.token;
	$scope.deviceSelected=false;
	$scope.yoData=true;
	$scope.noData=true;
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
	$scope.deviceSelected=function(deviceId){
		//console.log(deviceId);
		$scope.deviceSelected=false;
	};
	/**
	 * Date picker
	 */

	$scope.getCalendar = function(evt, param) {
		var minVal = 0;
		var maxVal = 0;
		if (param === 'min') {
			minVal = new Date('January 1, 2013');
		}
		if (param === 'max') {
			maxVal = new Date('December 31, 2020');
		}
		if (param === 'both') {
			minVal = new Date('January 1, 2013');
			maxVal = new Date('December 31, 2020');
		}
		app.handleDates(evt.target, {
			min : minVal,
			max : maxVal
		});
	};
	$scope.showRoute = function(hist) {
		var stVal=document.getElementById("startDt").value;
		var edVal=document.getElementById("endDt").value;
		var startDate = stVal;//hist.startDate;
		var endDate = edVal;//hist.endDate;
		var devID=hist.deviceId;
		var myStDate = startDate.split("/");
		var newStDate = myStDate[1] + "/" + myStDate[0] + "/" + myStDate[2];
		var std = new Date(new Date(newStDate).getTime());
		std.setHours(0);
		std.setMinutes(0);
		std.setSeconds(59);
		var sts = std.getTime();

		var myEdDate = endDate.split("/");
		var newEdDate = myEdDate[1] + "/" + myEdDate[0] + "/" + myEdDate[2];
		var d = new Date(new Date(newEdDate).getTime());
		d.setHours(23);
		d.setMinutes(59);
		d.setSeconds(59);
		var ets = d.getTime();
		//console.log(sts);
		//console.log(ets);
		historyApiCall(sts, ets,devID);
	};
	/**
	 * API call for history data 
	 */
	 
	function historyApiCall(sts, ets,devID) {
		$scope.deviceHistoryjson = {};
		$scope.deviceHistoryjson.token = $scope.token;
		$scope.deviceHistoryjson.devid = devID;
		$scope.deviceHistoryjson.sts = sts;
		$scope.deviceHistoryjson.ets = ets;
		$http({
			method : 'POST',
			url : apiURL + 'device/history',
			data : JSON.stringify($scope.deviceHistoryjson),
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function(data) {
			$scope.histData = data;
			//console.log($scope.histData.values.length);
			if ($scope.histData.values.length >= 1) {
				$scope.yoData = false;
				$scope.noData = true;
			} else {
				$scope.yoData = true;
				$scope.noData = false;
			}
			displayHistory();
		}).error(function(data, status, headers, config) {
			alert(data.err);
			console.log(data);
			console.log(status);
			console.log(headers);
			console.log(config);
		});
	}

	/**
	 * get Date formatted date based on TIMESTAMP
	 * -----------------------------------------------------------------------
	 */
	$scope.getDate = function(ts) {
		var d = new Date(Number(ts));
		// console.log(d.getDate()+"-"+d.getMonth()+"-"+d.getFullYear());
		var monthVal = d.getMonth() + 1;
		// Hours part from the timestamp
		var hours = d.getHours();
		// Minutes part from the timestamp
		var minutes = "0" + d.getMinutes();
		// Seconds part from the timestamp
		var seconds = "0" + d.getSeconds();

		// Will display time in 10:30:23 format
		var formattedTime = hours + ':' + minutes.substr(-2) + ':'
				+ seconds.substr(-2);
		return d.getDate() + "-" + monthVal + "-" + d.getFullYear() + " / "
				+ formattedTime;
	};
	/**
	1) Plot on Map History Path
	2) Display on Table
	-----------------------------------------------------------------------*/
	function displayHistory() {
		var lat_tot = 0, lg_tot = 0, lat_avg = 0, lg_avg = 0;
		var histData = $scope.histData.values;
		var hist_len = histData.length;
		var obj = [];
		var coordinates = [];
		for ( var inc = 0; inc < hist_len; inc++) {
			var arr = [];
			arr.push(Number(histData[inc].lat),Number(histData[inc].long));
			obj.push(arr);
			lat_tot += Number(histData[inc].lat);
			lg_tot += Number(histData[inc].long);
		}
		//console.log(obj);
		lt_avg = lat_tot / hist_len;
		lg_avg = lg_tot / hist_len;
		//console.log(lt_avg + " " + lg_avg);
		var centerVal=lt_avg+","+lg_avg;
		$scope.historyMap = {
			center : centerVal,			
			zoom : 12
		};
		//polyline for the history path
		//console.log(JSON.stringify(obj));
		$scope.historyMap.polylines = obj;
		//console.log(JSON.stringify($scope.historyMap));
	}
});