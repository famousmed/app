// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngCordova','ionic-datepicker'])

 .run(function($ionicPlatform,$rootScope) {

  $rootScope.configData = {
        pharmasun:{
            sysTitle:"法默生",
            SERVICE_URL:"http://180.96.11.22:8080/sci/mobile",
            appid:"wx152f0049d166931e",
            signUrl:"http://www.pharmasun.net:8080/app/#/tab/case"
        },
        famousmed:{
            sysTitle:"法迈生",
            SERVICE_URL:"http://edc.medroad.cn/sci/mobile",
            appid:"wx1315bff62e20057d",
            signUrl:"http://app.medroad.cn:80/app/#/tab/case"
        },
      ctfh:{
          sysTitle:"正大丰海",
          SERVICE_URL:"http://120.55.165.176:8080/fhedc/mobile",
          appid:"wxf2b31a95e09781ed",
          signUrl:"http://suqian.medroad.cn:8080/fhapp/"
      },
       local:{
           sysTitle:"本地测试",
           SERVICE_URL: "http://localhost:8080/pdsci/mobile",
           appid:"wx1315bff62e20057d",
           signUrl:"http://localhost:63342/edc/www/index.html"
       }
  }
  var compStr = "pharmasun";
  $rootScope.SERVICE_URL = $rootScope.configData[compStr].SERVICE_URL;
  $rootScope.appid = $rootScope.configData[compStr].appid;
  $rootScope.signUrl =  $rootScope.configData[compStr].signUrl;
  $rootScope.sysTitle =  $rootScope.configData[compStr].sysTitle;

  $rootScope.cfg = {selectTyle:'default'};
  $rootScope.wxInitConfigFlag = false;
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
        .state('statis', {
            url: '/statis',
            templateUrl: 'templates/statis.html',
            controller: 'StatisCtrl'
        })
    .state('paper', {
      url: '/paper',
      templateUrl: 'templates/paper.html',
      controller: 'PaperCtrl'
    })
  .state('follow-list', {
      url: '/follow-list',
      templateUrl: 'templates/follow/follow-list.html',
      controller: 'FollowCtrl'
  })
    .state('follow-detail', {
        url: '/follow-detail',
        templateUrl: 'templates/follow/follow-detail.html',
        controller: 'FollowCtrl'
    })
        .state('follow-edit', {
            url: '/follow-edit',
            templateUrl: 'templates/follow/follow-edit.html',
            controller: 'FollowCtrl'
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
                'tab-case': {
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
       // GhostDB.removeUserInfo();
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
                //clearAndShowLogin();
                return $q.reject(response);
            }
        }
    };
}).directive("bar", function() {
        return {
            restrict: 'AE',
            scope: {
                'id': '@',
                'item': '=',
                'data': '=',
                'title': '=',
                'subtitle': '='
            },
            replace: true,
            template: '<div style="height:250px;" ></div>',
            link: function($scope, element, attrs, controller){
                option = {

                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {

                        data:['总病例数','入组','完成','脱落/终止']
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            data : [$scope.title]
                        }
                    ],

                    yAxis : [
                        {

                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'总病例数',
                            type:'bar',
                            data:[$scope.subtitle],
                            color:[ '#3498db'],
                            itemStyle: {
                                normal: {
                                    label : {
                                        show: true, position: 'top'
                                    }
                                }
                            }
                        },
                        {
                            name:'入组',
                            type:'bar',
                            data:[$scope.data.inCount],
                            color:[ '#62cb31'],
                            itemStyle: {
                                normal: {
                                    label : {
                                        show: true, position: 'top'
                                    }
                                }
                            }
                        }
                        ,
                        {
                            name:'完成',
                            type:'bar',
                            data:[$scope.data.finishCount],
                            color:[ '#9b59b6'],
                            itemStyle: {
                                normal: {
                                    label : {
                                        show: true, position: 'top'
                                    }
                                }
                            }
                        }
                        ,
                        {
                            name:'脱落/终止',
                            type:'bar',
                            data:[$scope.data.offCount],
                            color:[ '#e74c3c'],
                            itemStyle: {
                                normal: {
                                    label : {
                                        show: true, position: 'top'
                                    }
                                }
                            }
                        }
                    ]
                };

                var div = document.getElementById($scope.id)

                var chart = echarts.init(element[0])
                chart.setOption(option)
            }
        }
    }).directive("pie", function() {
        return {
            restrict: 'AE',
            scope: {
                'id': '@',
                'item': '=',
                'data': '=',
                'title': '=',
                'subtitle': '='
            },
            replace: true,
            template: '<div style="height:250px;" ></div>',
            link: function($scope, element, attrs, controller){
                option = {
                    title : {
                        text: $scope.title ,
                        x:'left'
                    },
                    tooltip : {
                        show: true,
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    series : [
                        {
                            name: '病例录入状态',
                            type: 'pie',
                            radius : '60%',
                            center: ['50%', '50%'],
                            data: $scope.data,
                            label: {
                                normal: {
                                    position: 'outside'
                                }
                            },
                            color:[ '#62cb31','#3498db', '#c4ccd3'],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                var div = document.getElementById($scope.id)

                var chart = echarts.init(element[0])
                chart.setOption(option)
            }
        }
    })
    .directive("gauge", function() {
        return {
            restrict: 'AE',
            scope: {
                'id': '@',
                'item': '=',
                'data': '=',
                'title': '=',
                'subtitle': '='
            },
            replace: true,
            template: '<div style="height:250px;"></div>',
            link: function($scope, element, attrs, controller){
                option = {
                    title : {
                        text: $scope.title ,
                        x:'left'
                    },
                    tooltip : {
                        formatter: "{a} <br/>{b} : {c}%"
                    },
                    series: [
                        {
                            name: '业务指标',
                            type: 'gauge',
                            radius : '85%',
                            center: ['50%', '50%'],
                            detail: {formatter:'{value}%'},
                            data: [{value:$scope.data, name: ''}]
                        }
                    ]
                };
                var div = document.getElementById($scope.id)
                var chart = echarts.init(element[0])
                chart.setOption(option)
            }
        }
    })