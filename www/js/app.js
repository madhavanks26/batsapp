var apiURL="http://10.1.71.114:8040/";
var adminToken="bRC7KXh561zWP7fL";
var batsapp = angular.module('BATS', ['ionic','ngMap','ngMaterial','highcharts-ng']);


batsapp.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'BatsCtrl'
  })

  .state('app.live_tracking', {
    url: '/live_tracking',
    views: {
      'menuContent': {
        templateUrl: 'templates/live_tracking.html'
      }
    }
  })

  .state('app.device_details', {
    url: '/device_details',
    views: {
      'menuContent': {
        templateUrl: 'templates/device_details.html'
      }
    }
  })

  .state('app.latest_location', {
    url: '/latest_location',
    views: {
      'menuContent': {
        templateUrl: 'templates/latest_location.html'
      }
    }
  })

  .state('app.min_max_speed', {
    url: '/min_max_speed',
    views: {
      'menuContent': {
        templateUrl: 'templates/min_max_speed.html'
      }
    }
  })

  .state('app.max_kilometer', {
    url: '/max_kilometer',
    views: {
      'menuContent': {
        templateUrl: 'templates/max_kilometer.html'
      }
    }
  })

  .state('app.asset_tracking', {
    url: '/asset_tracking',
    views: {
      'menuContent': {
        templateUrl: 'templates/asset_tracking.html'
      }
    }
  })

  .state('app.history', {
    url: '/history',
    views: {
      'menuContent': {
        templateUrl: 'templates/history.html',
        controller: 'batsHistory'	
      }
    }
  })

  .state('app.travel_route', {
    url: '/travel_route',
    views: {
      'menuContent': {
        templateUrl: 'templates/travel_route.html',
        controller:'batsRoute'
      }
    }
  })

  .state('app.analytics', {
    url: '/analytics',
    views: {
      'menuContent': {
        templateUrl: 'templates/analytics.html',
        controller:'batsAnalytics'
      }
    }
  })

  .state('app.nearby_devices', {
    url: '/nearby_devices',
    views: {
      'menuContent': {
        templateUrl: 'templates/nearby_devices.html'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/live_tracking');
});
