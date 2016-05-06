angular.module('starter.controllers', [])
    .directive('formatDate', function($filter){
        return {
            require: 'ngModel',
            link: function(scope, elem, attr, ngModelCtrl) {
                ngModelCtrl.$formatters.push(function(modelValue){
                    if(modelValue) {
                        return new Date(modelValue);
                    }
                });
                ngModelCtrl.$parsers.push(function(value){
                    if(value) {
                        return $filter('date')(value, 'yyyy-MM-dd');
                    }
                });
            }
        };
    })
.controller('LoginCtrl', function($rootScope,$scope,$location, $ionicLoading,LoginService,$ionicPopup) {
    $rootScope.user = {userCode:localStorage.userCode,userPassword:localStorage.userPasswd};
    var weekDayLabels = new Array("星期日","星期一","星期二","星期三","星期四","星期五","星期六");
    var now = new Date();
    var year=now.getFullYear();
    var month=now.getMonth()+1;
    var day=now.getDate()
    var currentime = year+"-"+month+"-"+day+" "+weekDayLabels[now.getDay()]
    $rootScope.user.date=currentime;

    console.log("user.date=="+currentime);
    //$rootScope.user.userCode= localStorage.userCode
    //$rootScope.user.userPassword = localStorage.userPasswd;
    if(localStorage.hasLogin){
        console.log(" cache user for no login");
        LoginService.login(localStorage.userCode,localStorage.userPasswd).success(function (data) {
            $location.path("/main");
        }).error(function (data) {
            var alertPopup = $ionicPopup.alert({
                title: '登录失败',
                template:  data
            });
        });
    }
    $scope.login = function(){
        $ionicLoading.show({
            template: '登录中...'
        });
        LoginService.login($rootScope.user.userCode, $rootScope.user.userPassword).success(function (data) {
            //登录成功
            $location.path("/main");
        }).error(function (data) {
            var alertPopup = $ionicPopup.alert({
                title: '登录失败',
                template:  data
            });
        });
        $ionicLoading.hide();
    }
})
.controller('MainCtrl', function($rootScope,$state,$scope,$location) {
    $scope.demo = function(){
        $state.go("demo");
    };
    $scope.main = function(){
        $state.go("main");
    };
    $scope.dailyWork = function(){
        $location.path("/paper");
    };
    $scope.exit = function(){
        $location.path("/logn");
    };
    $scope.fllowRemaid = function(){
        $location.path("/fllow");
    };
    $scope.input = function(){
        $location.path("/input");
    };

})

.controller('ProjCtrl', function($rootScope,$scope,$location,ProjService,$state, $ionicLoading,$ionicScrollDelegate) {
    $scope.projs = ProjService.all();

    $scope.$on('$ionicView.enter', function(e) {

        var delegate = $ionicScrollDelegate.$getByHandle('projScroll');
        delegate.scrollTo($rootScope.projListPosition.left, $rootScope.projListPosition.top);
    });


    $scope.projList = function(){
        $ionicLoading.show({
            template: '加载中...'
        });
        ProjService.projlist($rootScope.user.userFlow).success(function () {
            $state.go("proj-list");
            $ionicLoading.hide();
        }).error(function () {

        });

    };



})
    /*
*  projData={
*       projFlow:"",
*       orgFlow:"",
*       orgs:[{}],
*       patients:[{}],
*       patient:{},
*       visits:[{}],
*       visit:{},
*       modules:[{}],
*       module:{},
*       inputs:[{}]
*  }
*
* */

.controller('PatientCtrl', function(WeiXinService,$ionicScrollDelegate,$timeout,$cordovaCamera,$ionicSlideBoxDelegate,$ionicModal,$ionicActionSheet,$scope, $rootScope,$state,$location,$ionicLoading,$ionicPopup,$stateParams,PatientService,ProjService) {

    $scope.projData = PatientService.all();

    $scope.projData.showInputSaveBtnFlag = false;
    $scope.$on('$ionicView.enter', function(e) {
        $scope.projData.uri = $location.url();

        if ($location.url()=="/tab/input" ||$location.url()=="/tab/serialInput" ) {
            if ($scope.projData.inputs.inputStatusId == "Checked" || $scope.projData.inputs.inputStatusId == "Submit") {
                $scope.projData.showInputSaveBtnFlag = false;
            } else {
                $scope.projData.showInputSaveBtnFlag = true;
            }
        }
        if($location.url()=="/tab/case"){
            console.log("url="+location.href.split('#')[0]);
            if(!$rootScope.wxInitConfigFlag){
                //$rootScope.signUrl
                WeiXinService.getSign(location.href.split('#')[0]).success(function () {
                    var sign =  $rootScope.signData;
                    console.log("jsapi_ticket="+sign.jsapi_ticket);
                    console.log("url="+sign.url);
                    wx.config({
                        debug: false,
                        appId: $rootScope.appid,
                        timestamp:  sign.timestamp,
                        nonceStr: sign.noncestr,
                        signature: sign.signature,
                        jsApiList: [
                            'checkJsApi',
                            'chooseImage',
                            'previewImage',
                            'uploadImage',
                            'downloadImage'
                        ]
                    });
                }).error(function (resultName) {
                    $ionicPopup.alert({
                        title: '操作失败',
                        template:  resultName
                    });
                    $ionicLoading.hide();
                });
                wx.ready(function(){
                    $rootScope.wxInitConfigFlag = true;
                });
                wx.error(function(res){
                   alert("微信脚本初始化失败!");
                });
            }
        }
        //console.log("url=="+$location.url() + "===");
    });
        //向下传播
    //$scope.$broadcast('projData', $scope.projData);

     $scope.projData.orgs = ProjService.orgs($scope.projData.projFlow);

    $scope.newPatient = PatientService.newPatient();

    $scope.patient = function(projFlow,orgFlow){
        $ionicLoading.show({
            template: '加载中...'
        });
        PatientService.patientlist(projFlow,orgFlow).success(function () {
            $state.go("projmenu.patient");

            //记录滚动位置，silde操作不记录
            var delegate = $ionicScrollDelegate.$getByHandle('projScroll');
            if(delegate.getScrollPosition()){
                $rootScope.projListPosition =  delegate.getScrollPosition();
            }

            $ionicLoading.hide();
        }).error(function () {

        });
    };
    $scope.addPatient= function() {

        /* var alertPopup = $ionicPopup.alert({
            title: '提示',
            template:  "权限不足，无法添加受试者!"
        });
        $state.go("commenu.patient-add");*/
        $state.go("commenu.patient-random");
    };
    $scope.savePatient = function() {
        $scope.newPatient.projFlow = $scope.projData.projFlow;
        $scope.newPatient.orgFlow = $scope.projData.orgFlow;

        PatientService.savePatient($scope.newPatient).success(function () {
            var alertPopup = $ionicPopup.alert({
                title: '提示信息',
                template: '受试者入组成功!'
            });
            alertPopup.then(function (res) {
                //用户点击确认登录后跳转
                PatientService.patientlist($scope.projData.projFlow,$scope.projData.orgFlow);
                $state.go("projmenu.patient");
            });
        }).error(function () {

        });
    };

    $scope.assignPatient = function() {
        $scope.newPatient.projFlow = $scope.projData.projFlow;
        $scope.newPatient.orgFlow = $scope.projData.orgFlow;
        $scope.newPatient.userFlow = $rootScope.user.userFlow;

//        alert($scope.newPatient.patientName);
//        alert($scope.newPatient.sexId);
//        alert($scope.newPatient.patientBirthday);
        if($scope.newPatient.patientName == ""){
            $ionicPopup.alert({
                title: '提示',
                template:  "姓名不能为空!"
            });
            return;
        }
        if($scope.newPatient.sexId == ""){
            $ionicPopup.alert({
                title: '提示',
                template:  "性别不能为空!"
            });
            return;
        }
        if($scope.newPatient.patientBirthday == ""){
            $ionicPopup.alert({
                title: '提示',
                template:  "出生日期不能为空!"
            });
            return;
        }

        var confirmPopup = $ionicPopup.confirm({
            title: '提示信息',
            template: '确认申请？'
        });
        confirmPopup.then(function (res){
            if(res){
                PatientService.assignPatient($scope.newPatient).success(function () {
                    var alertPopup = $ionicPopup.alert({
                        title: '提示信息',
                        template: '申请成功!'
                    });
                    alertPopup.then(function (res) {
                        //用户点击确认登录后跳转
                        PatientService.patientlist($scope.projData.projFlow,$scope.projData.orgFlow);
                        $state.go("projmenu.patient");
                    });
                }).error(function (resultName) {
                    $ionicPopup.alert({
                        title: '操作失败',
                        template:  resultName
                    });
                });
            }else {

            }

        });
    };
    $scope.patientDetail = function(patientFlow) {

        $state.go("tab.drug");
    };
    $scope.loglist = function(patientFlow) {
        $state.go("tab.log");
    };

    $scope.projData.visits = ProjService.getvisits();

    $scope.visitlist = function(patientFlow) {
        $scope.projData.patient = PatientService.get(patientFlow)
        $ionicLoading.show({
            template: '加载中...'
        });
        ProjService.visits($scope.projData.projFlow,patientFlow,$rootScope.user.userFlow).success(function () {
            $state.go("tab.proj-visit");
            $ionicLoading.hide();
        }).error(function () {

        });
    };
    $scope.moduleList = function(visitFlow) {
        if(visitFlow) {
            $scope.projData.modules = ProjService.getmodules(visitFlow);
            $scope.projData.visit = ProjService.getvisit(visitFlow);
            $state.go("tab.module-list");
        }else {
            console.log("no visit choose!");
            var alertPopup = $ionicPopup.alert({
                title: '提示',
                template:  "请先选择访视!"
            });
            alertPopup.then(function (res) {
                $state.go("tab.proj-visit");
            });
        }
    };
    $scope.datainput = function(moduleCode) {

        $scope.projData.module = ProjService.getmodule($scope.projData.visit.visitFlow,moduleCode);
        $ionicLoading.show({
            template: '加载中...'
        });
        PatientService.datainput($scope.projData.projFlow, $scope.projData.visit.visitFlow,moduleCode, $scope.projData.patient.patientFlow)
            .success(function () {
                $scope.projData.dataForm =  PatientService.getDatas($scope.projData.inputs) ;
                $scope.projData.dataForm.projFlow = $scope.projData.projFlow;
                $scope.projData.dataForm.visitFlow = $scope.projData.visit.visitFlow;
                $scope.projData.dataForm.moduleCode = moduleCode;
                $scope.projData.dataForm.patientFlow = $scope.projData.patient.patientFlow;
                $scope.projData.dataForm.userFlow = $rootScope.user.userFlow;
                console.log($scope.projData.dataForm['c3948b307e644520b6041d237a22305b'])
                $state.go("tab.input");
                $ionicLoading.hide();
            }).error(function (resultName) {
                var alertPopup = $ionicPopup.alert({
                    title: '操作失败',
                    template:  resultName
                });
                $ionicLoading.hide();
            });

    };

    $scope.serialInput = function(moduleCode,elementCode,serialNum) {

        PatientService.serialInput($scope.projData.projFlow, $scope.projData.visit.visitFlow,moduleCode,elementCode,serialNum, $scope.projData.patient.patientFlow)
            .success(function () {
                console.log("$scope.projData.inputs.serial=="+$scope.projData.inputs.serial);
                $scope.projData.serialDataForm =  PatientService.getDatasFromSerial($scope.projData.inputs.serial) ;
                $scope.projData.serialDataForm.serialNum=serialNum;
                $scope.projData.serialDataForm.projFlow = $scope.projData.projFlow;
                $scope.projData.serialDataForm.visitFlow = $scope.projData.visit.visitFlow;
                $scope.projData.serialDataForm.moduleCode = moduleCode;
                $scope.projData.serialDataForm.patientFlow = $scope.projData.patient.patientFlow;
                $scope.projData.serialDataForm.userFlow = $rootScope.user.userFlow;
                $state.go("tab.serialInput");
                $ionicLoading.hide();
            }).error(function (resultName) {
                var alertPopup = $ionicPopup.alert({
                    title: '操作失败',
                    template:  resultName
                });
                $ionicLoading.hide();
            });
    };

    $scope.saveInputData = function() {
        $ionicLoading.show({
            template: '保存中...'
        });
        PatientService.saveData($scope.projData.dataForm)
            .success(function () {
                var alertPopup = $ionicPopup.alert({
                    title: '提示信息',
                    template: '保存成功!'
                });
                alertPopup.then(function (res) {
                    //用户点击确认登录后跳转
                });
                $ionicLoading.hide();
            }).error(function () {

            });
    };
    $scope.saveSerialInputData = function() {
        $ionicLoading.show({
            template: '保存中...'
        });
        PatientService.saveData($scope.projData.serialDataForm)
            .success(function () {
                var alertPopup = $ionicPopup.alert({
                    title: '提示信息',
                    template: '保存成功!'
                });
                alertPopup.then(function (res) {
                    //用户点击确认登录后跳转
                    // if ($scope.projData.) {
                    PatientService.datainput($scope.projData.projFlow, $scope.projData.visit.visitFlow, $scope.projData.module.moduleCode, $scope.projData.patient.patientFlow)
                        .success(function () {
                            $scope.projData.dataForm = PatientService.getDatas($scope.projData.inputs);
                            $scope.projData.dataForm.projFlow = $scope.projData.projFlow;
                            $scope.projData.dataForm.visitFlow = $scope.projData.visit.visitFlow;
                            $scope.projData.dataForm.moduleCode = $scope.projData.module.moduleCode;
                            $scope.projData.dataForm.patientFlow = $scope.projData.patient.patientFlow;
                            $scope.projData.dataForm.userFlow = $rootScope.user.userFlow;
                            $state.go("tab.input");
                        });
                    //}
                });
                $ionicLoading.hide();
            }).error(function () {

            });
    };
    $scope.submitVisit = function(visitFlow) {
        var visit = ProjService.getvisit(visitFlow);
        if(visit.inputStatusId && visit.inputStatusId=='Submit'){
            $ionicPopup.alert({
                title: '提示信息',
                template: '该访视已提交!'
            });
        }else {
            var confirmPopup = $ionicPopup.confirm({
                title: '提示信息',
                template: '确认提交？提交后访视数据无法修改!'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    PatientService.submitVisit($scope.projData.projFlow, visitFlow, $scope.projData.patient.patientFlow, $rootScope.user.userFlow)
                        .success(function () {
                            var alertPopup = $ionicPopup.alert({
                                title: '提示信息',
                                template: '提交成功!'
                            });
                            alertPopup.then(function (res) {
                                ProjService.visits($scope.projData.projFlow, $scope.projData.patient.patientFlow, $rootScope.user.userFlow).success(function () {
                                    $state.reload();
                                }).error(function (resultName) {
                                    $ionicPopup.alert({
                                        title: '操作失败',
                                        template: resultName
                                    });

                                });
                            });
                        }).error(function (resultName) {
                            $ionicPopup.alert({
                                title: '操作失败',
                                template: resultName
                            });
                        });
                } else {

                }
            });
        }
    };
    $scope.sdv = function() {
        if($scope.projData.visit){
            $ionicLoading.show({
                template: '加载中...'
            });
            PatientService.sdv($scope.projData.patient.patientFlow,$scope.projData.visit.visitFlow)
                .success(function () {
                    $state.go("tab.sdv");
                    $ionicLoading.hide();
                }).error(function (resultName) {
                    var alertPopup = $ionicPopup.alert({
                        title: '操作失败',
                        template:  resultName
                    });
                    alertPopup.then(function (res) {
                        $state.go("tab.proj-visit");
                    });
                    $ionicLoading.hide();
                });
            }else {
               console.log("no visit choose!");
                var alertPopup = $ionicPopup.alert({
                    title: '提示',
                    template:  "请先选择访视!"
                });
                alertPopup.then(function (res) {
                    $state.go("tab.proj-visit");
                });
            }

    };
        $scope.serialSdv = function(moduleCode,elementCode,serialNum) {
            $ionicLoading.show({
                template: '加载中...'
            });
            PatientService.serialSdv($scope.projData.projFlow, $scope.projData.visit.visitFlow,moduleCode,elementCode,serialNum, $scope.projData.patient.patientFlow)
                .success(function () {
                    $state.go("tab.serialSdv");
                    $ionicLoading.hide();
                }).error(function (resultName) {
                    var alertPopup = $ionicPopup.alert({
                        title: '操作失败',
                        template:  resultName
                    });
                    $ionicLoading.hide();
                });
        };
        $scope.audit = function(recordFlow){
            var confirmPopup = $ionicPopup.confirm({
                title: '数据核查',
                template: '确认审核完成？'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    PatientService.auditVisit(recordFlow)
                        .success(function () {
                            var alertPopup = $ionicPopup.alert({
                                title: '数据核查',
                                template: '审核成功!'
                            });
                            alertPopup.then(function (res) {
                                $state.reload();
                            });
                        }).error(function (resultName) {
                            $ionicPopup.alert({
                                title: '操作失败',
                                template: resultName
                            });
                        });
                } else {

                }
            });
        };
        $scope.sendQuery = function (recordFlow,visitRecordFlow, moduleCode,elementCode,attrCode,serialNum){
            if(recordFlow==""){
                recordFlow =  visitRecordFlow+"_"+moduleCode+"_"+elementCode+"_"+serialNum+"_"+attrCode;
            }
            var confirmPopup = $ionicPopup.confirm({
                title: '数据核查',
                template: '确认发送SDV疑问？'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    PatientService.sendQuery(recordFlow)
                        .success(function () {
                            var alertPopup = $ionicPopup.alert({
                                title: '提示信息',
                                template: '发送成功!'
                            });
                            alertPopup.then(function (res) {

                            });
                        }).error(function (resultName) {
                            $ionicPopup.alert({
                                title: '操作失败',
                                template: resultName
                            });
                        });
                } else {

                }
            });
        };
       $scope.querylist = function(){
           $ionicLoading.show({
               template: '加载中...'
           });
           PatientService.querylist($scope.projData.projFlow, $scope.projData.visit.visitFlow, $scope.projData.patient.patientFlow)
               .success(function () {
                   $state.go("tab.query");
                   $ionicLoading.hide();
               }).error(function (resultName) {
                   var alertPopup = $ionicPopup.alert({
                       title: '操作失败',
                       template:  resultName
                   });
                   $ionicLoading.hide();
               });

       }
    $scope.datepickerObject = {
        titleLabel: '日期选择',  //Optional
        todayLabel: '今天',  //Optional
        closeLabel: '关闭',  //Optional
        setLabel: '确定',  //Optional
        setButtonType : 'button-assertive',  //Optional
        todayButtonType : 'button-assertive',  //Optional
        closeButtonType : 'button-assertive',  //Optional
        inputDate:'',    //Optional
        mondayFirst: true,    //Optional
        templateType: 'modal', //Optional
        showTodayButton: 'true', //Optional
        modalHeaderColor: 'bar-positive', //Optional
        modalFooterColor: 'bar-positive', //Optional
        callback: function (val) {    //Mandatory

        }
    };
    $scope.chooseCode = function(codes) {
        var options = {};
        for (var i = 0; i < codes.length; i++) {
            var code = codes[i];
            options[i] = {text: code.codeName};
        }
        $ionicActionSheet.show({
            buttons: options,
            titleText: '请选择',
            cancelText: '清 空',
            cancel: function () {
                // add cancel code..
            },
            buttonClicked: function (index) {
                // 相册文件选择上传
                if (index == 1) {
                    $scope.readalbum(prop);
                } else if (index == 0) {
                    // 拍照上传
                    $scope.taskPicture(prop);
                }
                return true;
            }
        });
    };



        var images = {
            localId: [],
            serverId: []
        };
        var syncUpload = function(localIds){
            var localId = localIds.pop();
            wx.uploadImage({
                localId: localId,
                isShowProgressTips: 1,
                success: function (res) {
                    var serverId = res.serverId; // 返回图片的服务器端ID
                    //其他对serverId做处理的代码
                    //服务器获取
                    WeiXinService.pullPhoto($scope.projData.patient.patientFlow,$scope.projData.visit.visitFlow,serverId);
                    if(localIds.length > 0){
                        syncUpload(localIds);
                    }else {
                        $timeout(
                            function() {
                                alert("上传成功");
                                PatientService.photos($scope.projData.patient.patientFlow,$scope.projData.visit.visitFlow);
                            },
                            1000
                        );
                    }
                }
            });
        };
        $scope.addPatientCase = function(isWeixin) {
            if(isWeixin){
                wx.chooseImage({
                    success: function (res) {
                        images.localId = res.localIds;
                        //alert(JSON.stringify(res));
                        syncUpload(images.localId);
                    }
                });
            }else {
                $ionicActionSheet.show({
                    buttons: [{
                        text: '<b>拍照</b> 上传'
                    }, {
                        text: '从 <b>相册</b> 中选'
                    }],
                    titleText: '图片上传',
                    cancelText: '取 消',
                    cancel: function() {
                        // add cancel code..
                    },
                    buttonClicked: function(index) {
                        // 相册文件选择上传
                        if (index == 1) {
                            $scope.getPicture(prop);
                        } else if (index == 0) {
                            // 拍照上传
                            $scope.taskPicture(prop);
                        }
                        return true;
                    }
                });

            }
        };
        // 读用户相册
        $scope.getPicture = function(prop) {
            document.addEventListener("deviceready", function () {
                var options = {
                    quality: 75,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    encodingType: Camera.EncodingType.JPEG,
                    popoverOptions: CameraPopoverOptions
                };
                $cordovaCamera.getPicture(options).then(function(imageData) {
                    $ionicLoading.show({
                        template: '上传中...'
                    });
                    PatientService.uploadPatientCase($scope.projData.patient.patientFlow,$scope.projData.visit.visitFlow,imageData)
                        .success(function () {
                            PatientService.photos($scope.projData.patient.patientFlow,$scope.projData.visit.visitFlow);
                            $ionicLoading.hide();
                        }).error(function (resultName) {
                            $ionicPopup.alert({
                                title: '操作失败',
                                template:  resultName
                            });
                        });
                }, function(err) {
                    $ionicPopup.alert({
                        title: '操作失败',
                        template:  err
                    });
                });

                //$cordovaCamera.cleanup().then(); // only for FILE_URI

            }, false);
        };
        // 拍照
        $scope.taskPicture = function() {
            document.addEventListener("deviceready", function () {
                var options = {
                    quality: 75,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 800,
                    targetHeight: 600,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: true,
                    correctOrientation:true
                };
                $cordovaCamera.getPicture(options).then(function(imageData) {
                    $ionicLoading.show({
                        template: '上传中...'
                    });
                    PatientService.uploadPatientCase($scope.projData.patient.patientFlow,$scope.projData.visit.visitFlow,imageData).success(function () {
                       PatientService.photos($scope.projData.patient.patientFlow,$scope.projData.visit.visitFlow);
                        $ionicLoading.hide();
                    }).error(function (resultName) {
                       $ionicPopup.alert({
                            title: '操作失败',
                            template:  resultName
                        });
                    });
                }, function(err) {
                    $ionicPopup.alert({
                        title: '操作失败',
                        template:  err
                    });
                });

            }, false);
        };
    $scope.originalCase = function(visitFlow) {

        if(visitFlow) {
            PatientService.photos($scope.projData.patient.patientFlow,visitFlow).success(function () {
                $state.go("tab.case");
            }).error(function (resultName) {
                 $ionicPopup.alert({
                    title: '操作失败',
                    template:  resultName
                });
                $ionicLoading.hide();
            });
        }else {
            console.log("no visit choose!");
            var alertPopup = $ionicPopup.alert({
                title: '提示',
                template:  "请先选择访视!"
            });
            alertPopup.then(function (res) {
                $state.go("tab.proj-visit");
            });
        }

    };
    $scope.editPhotoSheet = function(imageFlow) {
        $ionicActionSheet.show({
            buttons: [{
                text: '添加备注'
            }],
            destructiveText: '删除',
            titleText: '图片编辑',
            cancelText: '取 消',
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index) {
                if (index == 0) {
                    $scope.addPhotoNote(imageFlow);
                }
                return true;
            },
            destructiveButtonClicked: function() {
                $scope.delPhoto(imageFlow);
                return true;
            }
        });
    };
    $scope.delPhoto = function(imageFlow) {
        var confirmPopup = $ionicPopup.confirm({
            title: '提示信息',
            template: '确认删除?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                PatientService.delPhoto($scope.projData.patient.patientFlow,$scope.projData.visit.visitFlow,imageFlow)
                    .success(function () {
                        var alertPopup = $ionicPopup.alert({
                            title: '提示信息',
                            template: '删除成功!'
                        });
                        alertPopup.then(function (res) {
                            PatientService.photos($scope.projData.patient.patientFlow,$scope.projData.visit.visitFlow);
                        });
                    }).error(function (resultName) {
                        $ionicPopup.alert({
                            title: '操作失败',
                            template: resultName
                        });
                    });
            }
        });
    };
    $scope.addPhotoNote = function(imageFlow) {
        var temp =  PatientService.getPhoto(imageFlow).note;
        $scope.data = {note:temp};
        var myPopup =  $ionicPopup.show({
            template: '<input type="text" value="123"  ng-model="data.note">',
            title: '添加备注',
            subTitle: '如：访视、检查内容...',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>保存</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.data.note) {
                            //don't allow the user to close unless he enters wifi password
                            e.preventDefault();
                        } else {
                            return $scope.data.note;
                        }
                    }
                }
            ]
        });
        myPopup.then(function(note) {
            console.log("note="+note);
            if(note){
                PatientService.getPhoto(imageFlow).note = note;
                PatientService.savePhotoNote($scope.projData.patient.patientFlow,$scope.projData.visit.visitFlow, imageFlow, note);
            }else {

            }
        });
    };

    $ionicModal.fromTemplateUrl('view-case.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
       // $ionicSlideBoxDelegate.$getByHandle('slideimgs').update();
    });
    $scope.openModal = function(index) {
        //$rootScope.photoIndex = index;
        event.stopPropagation();
        $scope.modal.show();
        $ionicSlideBoxDelegate.slide(index);
            //$getByHandle('slideimgs');
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    //当我们用到模型时，清除它！
    $scope.$on('$destroy', function() {
        console.log("remove===========");
        $scope.modal.remove();
    });
    // 当隐藏的模型时执行动作
    $scope.$on('modal.hide', function() {
        // 执行动作
    });
    // 当移动模型时执行动作
    $scope.$on('modal.removed', function() {
        // 执行动作
        console.log("removed modal");
    });

    $scope.nextSlide = function() {
        $ionicSlideBoxDelegate.next();
    };
    $scope.doRefresh = function() {
        console.log('Refreshing Patient!');
        $timeout( function() {
            //simulate async response 待处理
            //$scope.items.push('New Item ' + Math.floor(Math.random() * 1000) + 4);

            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');

        }, 1000);
    };
    $scope.refreshPhoto = function() {
        $timeout( function() {
            //simulate async response 待处理
            PatientService.photos($scope.projData.patient.patientFlow,$scope.projData.visit.visitFlow);
            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');

        }, 1000);
    };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})
.controller('PaperCtrl', function($scope, $stateParams) {

})
.controller('MenuCtrl', function($scope,$ionicSideMenuDelegate) {
    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    }
})
.controller('AccountCtrl', function($rootScope,$scope,$state) {
   $scope.userCenter = function(){
       $state.go("account");
    };
  $scope.settings = {
    enableFloow: true,
    headpic:"img/head.png"
  };
    $scope.logout = function() {
        if(localStorage.hasLogin ){
            localStorage.hasLogin = false;
            $state.go("login");
        }
    };
})
.controller("DemoCtrl", function(WeiXinService,$location,$scope,$ionicLoading,$rootScope,$ionicPopup) {
       var url = "http://www.pharmasun.net:8080/app/#/demo";
        WeiXinService.getSign(url).success(function () {
            var sign =  $rootScope.signData;
            wx.config({
                debug: true,
                appId: 'wx152f0049d166931e',
                timestamp:  sign.timestamp,
                nonceStr: sign.noncestr,
                signature: sign.signature,
                jsApiList: [
                    'checkJsApi',
                    'chooseImage',
                    'previewImage',
                    'uploadImage',
                    'downloadImage'
                ]
            });
        }).error(function (resultName) {
            $ionicPopup.alert({
                title: '操作失败',
                template:  resultName
            });
            $ionicLoading.hide();
        });
        $scope.checkJsApi =  function (){
            wx.checkJsApi({
                jsApiList: [
                    'getNetworkType',
                    'previewImage'
                ],
                success: function (res) {

                }
            });
        };
        var images = {
            localId: [],
            serverId: []
        };
        $scope.chooseImage = function (){
            wx.chooseImage({
                success: function (res) {
                    images.localId = res.localIds;
                    //alert(JSON.stringify(res));
                    for (var i in images.localId) {
                        wx.uploadImage({
                            localId: images.localId[i], // 需要上传的图片的本地ID，由chooseImage接口获得
                            isShowProgressTips: 1, // 默认为1，显示进度提示
                            success: function (res) {
                                var serverId = res.serverId; // 返回图片的服务器端ID
                                alert(serverId);
                                images.serverId[images.serverId.length] = serverId;

                            }
                        });
                    }
                }
            });
        }
        /*
       $scope.data = {date:"12345"};
        $scope.datepickerObject = {
            titleLabel: '日期选择',  //Optional
            todayLabel: '今天',  //Optional
            closeLabel: '关闭',  //Optional
            setLabel: '确定',  //Optional
            setButtonType : 'button-assertive',  //Optional
            todayButtonType : 'button-assertive',  //Optional
            closeButtonType : 'button-assertive',  //Optional
            inputDate:'',
            mondayFirst: true,    //Optional
            templateType: 'modal', //Optional
            showTodayButton: 'true', //Optional
            modalHeaderColor: 'bar-positive', //Optional
            modalFooterColor: 'bar-positive', //Optional
            callback: function (val) {    //Mandatory
                $scope.data.date = val;
            }
        };
        $ionicHistory.clearHistory();
        // 图片选择项
        $scope.showImageUploadChoices = function(prop) {
            var hideSheet = $ionicActionSheet.show({
                buttons: [{
                    text: '<b>拍照</b> 上传'
                }, {
                    text: '从 <b>相册</b> 中选'
                }],
                titleText: '图片上传',
                cancelText: '取 消',
                cancel: function() {
                    // add cancel code..
                },
                buttonClicked: function(index) {
                    // 相册文件选择上传
                    if (index == 1) {
                        $scope.readalbum(prop);
                    } else if (index == 0) {
                        // 拍照上传
                        $scope.taskPicture(prop);
                    }
                    return true;
                }
            });

        };
        // 读用户相册
        $scope.readalbum = function() {
            navigator.camera.getPicture(onPhotoDone, onPhotoFail, { quality: 100, targetWidth: 150, targetHeight: 150, destinationType: navigator.camera.DestinationType.FILE_URI
                ,sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM });
        };

        // 拍照
        function onPhotoDone(imageURI){uploadPhoto(imageURI);}
        function onPhotoFail(message){console.log('Photo Failed: ' + message);}
        function uploadPhoto(imageURI){
            var image = document.getElementById('AssistImageName');
            console.log(imageURI);
            image.src = imageURI;
        }
        $scope.taskPicture = function() {
            $state.go("camera");
        }
        */
    })
;

