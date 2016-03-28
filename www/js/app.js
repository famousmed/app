// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngCordova','ionic-datepicker'])

 .run(function($ionicPlatform,$rootScope) {
  $rootScope.SERVICE_URL =
       //"http://120.55.165.176:9090/medroad/mobile";
      "http://180.96.11.22:8080/sci/mobile"
       //    "http://localhost:8080/pdsci/mobile";
  $rootScope.cfg = {selectTyle:'default'};
  $rootScope.user = {username: null, password: null, token: null};
  $ionicPlatform.ready(function() {
      //Ionic.io();

     //var push = new Ionic.Push({
      //    "debug": true
      //});

      //push.register(function(token) {
       //   console.log("Device token:",token.token);
      //});

      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})
.run(function($rootScope, $templateCache) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (typeof(current) !== 'undefined'){
            $templateCache.remove(current.templateUrl);
        }
    });
})
.config(function($ionicConfigProvider,$stateProvider, $urlRouterProvider,$httpProvider) {
    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('standard');

    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('left');

    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');

        $httpProvider.defaults.transformRequest = [function(data) {
        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function(obj) {
            var query = '';
            var name, value, fullSubName, subName, subValue, innerObj, i;

            for (name in obj) {
                value = obj[name];

                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + '='
                        + encodeURIComponent(value) + '&';
                }
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };

        return angular.isObject(data) && String(data) !== '[object File]'
            ? param(data)
            : data;
    }];
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

    $stateProvider.state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'MainCtrl'
  })



  // Each tab has its own nav history stack:

  .state('main', {
      url: '/main',
      templateUrl: 'templates/main.html',
      controller: 'MainCtrl'
  })
  .state('proj-list', {
    url: '/proj-list',
    cache: false,
   templateUrl: 'templates/proj-list.html',
   controller: 'ProjCtrl'
  })
// setup an abstract state for the tabs directive
    .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
        controller: 'PatientCtrl'
    })
  .state('tab.sdv', {
      url: '/sdv',
      cache: true,
      views: {
        'tab-sdv': {
          templateUrl: 'templates/tabs-sdv.html',
          controller: 'PatientCtrl'
        }
      }
    })
    .state('tab.proj-visit', {
      url: '/visit',
      views: {
        'tab-visit': {
          templateUrl: 'templates/proj-visit.html',
          controller: 'PatientCtrl'
        }
      }
    })
    .state('tab.module-list', {
        url: '/module-list',
       // params:{'visitFlow': ''},
        views: {
            'tab-module': {
                templateUrl: 'templates/module-list.html',
                controller: 'PatientCtrl'
            }
        }
    })
      .state('tab.input', {
         url: '/input',
         cache: false,
         views: {
            'tab-module': {
                templateUrl: 'templates/input.html',
                controller: 'PatientCtrl'
            }
        }
      })
        .state('tab.serialInput', {
            url: '/serialInput',
            cache: false,
            views: {
                'tab-module': {
                    templateUrl: 'templates/serialInput.html',
                    controller: 'PatientCtrl'
                }
            }
        })
        .state('tab.serialSdv', {
            url: '/serialSdv',
            cache: false,
            views: {
                'tab-sdv': {
                    templateUrl: 'templates/serialSdv.html',
                    controller: 'PatientCtrl'
                }
            }
        })
        .state('tab.query', {
            url: '/query',
            cache: false,
            views: {
                'tab-sdv': {
                    templateUrl: 'templates/query-list.html',
                    controller: 'PatientCtrl'
                }
            }
        })
    .state('paper', {
      url: '/paper',
      templateUrl: 'templates/paper.html',
      controller: 'PaperCtrl'
    })
  .state('fllow', {
      url: '/fllow',
      templateUrl: 'templates/fllow.html',
      controller: 'PatientCtrl'
  })
  .state('commenu', {
      url: '/commenu',
      abstract: true,
      templateUrl: 'templates/commenu.html',
      controller: 'MenuCtrl'
  })
  .state('projmenu', {
      url: '/projmenu',
      abstract: true,
      templateUrl: 'templates/projmenu.html',
      controller: 'MenuCtrl'
  })
  .state('projmenu.patient', {
      url: '/patient',
      cache: false,
      views: {
          'menuContent': {
              templateUrl:'templates/patient.html',
              controller: 'PatientCtrl'
          }
      }
  })

  .state('commenu.patient-add', {
      url: '/patient-add',
      cache: false,
      views: {
          'menuContent': {
              templateUrl: 'templates/patient-add.html',
              controller: 'PatientCtrl'
          }
      }
  })
    .state('commenu.patient-random', {
        url: '/patient-random',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/patient-random.html',
                controller: 'PatientCtrl'
            }
        }
    })
    .state('tab.input_tpl', {
        url: '/input_tpl',
        cache: false,
        views: {
            'tab-module': {
                templateUrl: 'templates/input_tpl.html',
                controller: 'PatientCtrl'
            }
        }
    })
  .state('account', {
    url: '/account',
   templateUrl: 'templates/account.html',
    controller: 'AccountCtrl'
  })
        .state('demo', {
            url: '/demo',
            templateUrl: 'templates/weixin.html',
            controller: 'DemoCtrl'
        })
        .state('camera', {
            url: '/camera',
            templateUrl: 'templates/camera.html',
            controller: 'DemoCtrl'
        })
        .state('tab.case', {
            url: '/case',
            cache: false,
            views: {
                'tab-sdv': {
                    templateUrl: 'templates/original-case.html',
                    controller: 'PatientCtrl'
                }
            }
        });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

  $httpProvider.defaults.useXDomain = true;
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  $httpProvider.interceptors.push('authInterceptor');
})
.factory('authInterceptor', function( $q, $rootScope, $injector) {
    function clearAndShowLogin() {
        var $ionicLoading = $injector.get('$ionicLoading');
        var $cordovaToast = $injector.get('$cordovaToast');
        var $cordovaSplashscreen = $injector.get('$cordovaSplashscreen');
        var GhostDB = $injector.get('GhostDB');
        $ionicLoading.hide();
        $cordovaSplashscreen.hide();
        $cordovaToast.showShortBottom('登录信息失效，请重新登录');
        // 清除登录信息
        $rootScope.user = {};
        GhostDB.removeUserInfo();
        // 弹出登录框
        if ($rootScope.blog.modal.login) {
            $rootScope.blog.modal.login.show();
        }
    };

    return {
        // Add authorization token to headers
        request: function (config) {
            config.default = 5000;
            config.headers = config.headers || {};
            if ($rootScope.user.password && $rootScope.user.token) {
                config.headers['Authorization'] = 'Bearer ' + $rootScope.user.token.access_token;
            }
            return config;
        },

        // Intercept 401s and redirect you to login
        responseError: function(response) {
            // 登录身份过期
            if(response.status === 401) {
                // 401后重新发送登录请求，成功后再次执行之前的请求，如果还是错误，则登录信息失效
                var GhostOauth = $injector.get('GhostOauth');
                var $http = $injector.get('$http');
                var defer = $q.defer();
                GhostOauth.loginWidthStored().then(defer.resolve, function() {
                    clearAndShowLogin();
                    return defer.promise;
                }).then(function() {
                    return $http(response.config);
                });
                return defer.promise;
            }
            else {
                // 统一处理，未做详细区别
                clearAndShowLogin();
                return $q.reject(response);
            }
        }
    };
});
