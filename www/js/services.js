angular.module('starter.services', [])
.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: '张三',
    lastText: '下次访视日期:2015-10-12',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: '李四',
    lastText: '下次访视日期:2015-10-18',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('LoginService', function($q, $http,$rootScope) {
    return {
        login: function(userCode,passWord) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            var loginResult = new Object();

            $http.jsonp($rootScope.SERVICE_URL+"/login?userCode="+userCode+"&userPasswd="+passWord+"&callback=JSON_CALLBACK")
                .success(function (response) {
                    loginResult = response;
                    if (loginResult.resultId == 200) {
                        $rootScope.user.userFlow = loginResult.userInfo.userFlow;
                        localStorage.userCode = userCode;
                        localStorage.userPasswd = passWord;
                        localStorage.hasLogin = true;
                        $rootScope.user.userName =  loginResult.userInfo.userName;
                        $rootScope.user.orgName =  loginResult.userInfo.orgName;
                        $rootScope.user.userPhone =  loginResult.userInfo.userPhone;
                        $rootScope.user.userEmail =  loginResult.userInfo.userEmail;
                                //设置客户端的别名，用于定向接收消息的推送
                        //window.plugins.jPushPlugin.setAlias("Client" + loginResult.UserId);

                        deferred.resolve('Welcome ' + loginResult.userName + '!');
                    } else {
                        deferred.reject(loginResult.resultName);
                    }
                })
                .error(function (error) {
                deferred.reject(error);
            });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;

        }
    };
})
.factory('ProjService', function($q, $http,$rootScope) {
    var projs = {};
    var visits={};
    return {
        all: function() {
            return projs;
        },
        getRandomType:function(projFlow){
            for (var i = 0; i < projs.length; i++) {
                if (projs[i].projFlow === projFlow) {
                    return projs[i].randomTypeName;
                }
            }
            return null;
        },
        getvisits: function() {
            return visits;
        },
        getvisit: function(visitFlow) {
            for (var i = 0; i < visits.length; i++) {
                if (visits[i].visitFlow === visitFlow) {
                    return visits[i];
                }
            }
            return null;
        },
        getmodules: function(visitFlow,moduleCode) {
            for (var i = 0; i < visits.length; i++) {
                if (visits[i].visitFlow === visitFlow) {
                    return visits[i].moduleList;
                }
            }
            return null;
        },
        getmodule:function(visitFlow,moduleCode) {
            for (var i = 0; i < visits.length; i++) {
                if (visits[i].visitFlow === visitFlow) {
                   for(var m = 0; m < visits[i].moduleList.length; m++){
                       if (visits[i].moduleList[m].moduleCode === moduleCode) {
                           return visits[i].moduleList[m];
                       }
                   }
                }
            }
            return null;
        },
        visits: function(projFlow,patientFlow,userFlow) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            //ajax请求
            $http.jsonp($rootScope.SERVICE_URL+"/visitList?projFlow="+projFlow+"&patientFlow="+patientFlow+"&userFlow="+userFlow+"&callback=JSON_CALLBACK")
                .success(function (response) {
                    visits = response.visitList;
                    deferred.resolve('Welcome ' + projs + '!');
                }).error(function (error) {
                    deferred.reject(error);
                });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        },

        orgs: function(projFlow) {
            for (var i = 0; i < projs.length; i++) {
                if (projs[i].projFlow === projFlow) {
                    return projs[i].orgList;
                }
            }
            return null;
        },
        projlist:function(userFlow){
            var deferred = $q.defer();
            var promise = deferred.promise;
            //ajax请求
            $http.jsonp($rootScope.SERVICE_URL+"/projList?userFlow="+userFlow+"&callback=JSON_CALLBACK")
                .success(function (response) {
                    projs = response.projList;
                    deferred.resolve('Welcome ' + projs + '!');
                }).error(function (error) {
                    deferred.reject(error);
                });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    };
})
.factory('PatientService', function($q, $http,ProjService,$rootScope,$cacheFactory) {
    var newPatient={patientName:'',sexId:'',patientBirthday:''};
    var projData = {};
   // var projData ={};
    return {
        all: function() {
            return projData;
        },
        newPatient:function(){
            return newPatient;
        },
        get:function(patientFlow){
            for (var i = 0; i < projData.patients.length; i++) {
                if (projData.patients[i].patientFlow === patientFlow) {
                    return projData.patients[i];
                }
            }
            return null;
        },
        patientlist:function(projFlow,orgFlow,randomTypeName){
            var deferred = $q.defer();
            var promise = deferred.promise;
            //ajax请求
            $http.jsonp($rootScope.SERVICE_URL+"/patientList?projFlow="+projFlow+"&orgFlow="+orgFlow+"&callback=JSON_CALLBACK")
                .success(function (response) {
                    projData.projFlow = projFlow;
                    projData.projName = response.projName;
                    projData.orgFlow = orgFlow;

                    projData.orgName = response.orgName;
                    projData.patients = response.patientList;
                    projData.orgs = ProjService.orgs(projFlow);

                    deferred.resolve('patient.length= ' + projData.patients.length + '!');
                }).error(function (error) {
                    deferred.reject(error);
                });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        },
        savePatient:function(){
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http({method: 'post', url: $rootScope.SERVICE_URL+"/savePatient",
                data: newPatient
            }) .success(function (response) {

                    if(response.resultId==200) {
                        newPatient = {patientName: '', sexId: '', patientBirthday: ''};
                        deferred.resolve('patient.length= ' + projData.patients.length + '!');
                    }else {
                        deferred.reject(response.resultName);
                    }
            }).error(function (error) {

                deferred.reject(error);
            });

            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        },
        assignPatient:function(){

            var deferred = $q.defer();
            var promise = deferred.promise;

            $http({method: 'post', url: $rootScope.SERVICE_URL+"/assignPatient",
                data: newPatient
            }).success(function (response) {
                if(response.resultId==200){
                    newPatient={patientName:'',sexId:'',patientBirthday:''};
                    deferred.resolve("success");
                }else {
                    deferred.reject(response.resultName);
                }
            }).error(function (error) {

                deferred.reject(error);
            });

            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        },
        drug:function(){
            var deferred = $q.defer();
            var promise = deferred.promise;
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        },
        datainput:function(projFlow,visitFlow,moduleCode,patientFlow){
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.jsonp($rootScope.SERVICE_URL+"/input?userFlow="+$rootScope.user.userFlow+"&projFlow="+projFlow+"&visitFlow="+visitFlow+"&moduleCode="+moduleCode+"&patientFlow="+patientFlow+"&callback=JSON_CALLBACK")
                .success(function (response) {
                    if(response.resultId==200){
                        projData.inputs = response;
                        deferred.resolve('patient.length= ' + projData.inputs.length + '!');
                    }else {
                        deferred.reject(response.resultName);
                    }
                }).error(function (error) {
                    deferred.reject(error);
                });

            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        },
        serialInput:function(projFlow,visitFlow,moduleCode,elementCode,serialNum,patientFlow){
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.jsonp($rootScope.SERVICE_URL+"/serialInput?userFlow="+$rootScope.user.userFlow+"&projFlow="+projFlow+"&visitFlow="+visitFlow+"&moduleCode="+moduleCode+"&elementCode="+elementCode+"&serialNum="+serialNum+"&patientFlow="+patientFlow+"&callback=JSON_CALLBACK")
                .success(function (response) {
                    if(response.resultId==200){
                        projData.inputs.serial = response;
                        deferred.resolve('patient.length= ' +   projData.inputs.serial + '!');
                    }else {
                        deferred.reject(response.resultName);
                    }
                }).error(function (error) {
                    deferred.reject(error);
                });

            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        },
        serialSdv:function(projFlow,visitFlow,moduleCode,elementCode,serialNum,patientFlow){
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.jsonp($rootScope.SERVICE_URL+"/serialSdv?userFlow="+$rootScope.user.userFlow+"&projFlow="+projFlow+"&visitFlow="+visitFlow+"&moduleCode="+moduleCode+"&elementCode="+elementCode+"&serialNum="+serialNum+"&patientFlow="+patientFlow+"&callback=JSON_CALLBACK")
                .success(function (response) {
                    if(response.resultId==200){
                        projData.sdv.serial = response;
                        deferred.resolve('patient.length= ' +  projData.sdv.serial + '!');
                    }else {
                        deferred.reject(response.resultName);
                    }
                }).error(function (error) {
                    deferred.reject(error);
                });

            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        },

        getDatas:function(inputs) {
            var datas  ={};
            for (var  e = 0;  e< inputs.elements.length; e++) {
                if(inputs.elements[e].elementSerial=='N'){
                    for(var a = 0; a < inputs.elements[e].attributes.length; a++){
                       datas[inputs.elements[e].attributes[a].attrCode] = inputs.elements[e].attributes[a].inputValue;
                    }
                }
            }
            return  datas;
        },
        getCheckboxDatas:function(inputs,eleCode,attrCode,isSerial) {
            var value = "";
            if (!isSerial) {
                var elements = inputs.elements;
                for (var e = 0; e < elements.length; e++) {
                    var element = inputs.elements[e];
                    if (element.elementCode == eleCode) {
                        for (var a = 0; a < element.attributes.length; a++) {
                            var attr = element.attributes[a];
                            if (attr.attrCode == attrCode) {
                                for (var c = 0; c < attr.codes.length; c++) {
                                    var code = attr.codes[c];
                                    if (code.selected) {
                                        if (value != "") {
                                            value += ",";
                                        }
                                        value += code.codeValue;
                                    }
                                }
                            }
                        }
                    }

                }
            }else {
                for (var a = 0; a < inputs.attributes.length; a++) {
                    var attr = inputs.attributes[a];
                    if (attr.attrCode == attrCode) {
                        for (var c = 0; c < attr.codes.length; c++) {
                            var code = attr.codes[c];
                            if (code.selected) {
                                if (value != "") {
                                    value += ",";
                                }
                                value += code.codeValue;
                            }
                        }
                    }
                }
            }
            return  value;
        },
        getDatasFromSerial:function(serial) {
            var datas  ={};
            for(var a = 0; a < serial.attributes.length; a++){
                datas[serial.attributes[a].attrCode] = serial.attributes[a].inputValue;
            }
            return  datas;
        },

        saveData:function(dataForm){
            var deferred = $q.defer();
            var promise = deferred.promise;
            console.log("dataForm="+dataForm);
            $http({method: 'post', url: $rootScope.SERVICE_URL+"/saveData",
                data: dataForm

               // headers: { 'Content-Type': 'application/json; charset=UTF-8'},
               // transformRequest: function transform(data){
               //     return data;
               // }
            }).success(function (response) {
                if(response.resultId==200){
                    deferred.resolve('Success!');
                }else {
                    deferred.reject(response.resultName);
                }
            }).error(function (error) {
                deferred.reject(error);
            });

            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        },
        submitVisit: function(projFlow,visitFlow,patientFlow,userFlow) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            //ajax请求
            $http.jsonp($rootScope.SERVICE_URL+"/submitVisit?projFlow="+projFlow+"&visitFlow="+visitFlow+"&patientFlow="+patientFlow+"&userFlow="+userFlow+"&callback=JSON_CALLBACK")
                .success(function (response) {
                    if(response.resultId==200){
                        deferred.resolve('Success!');
                    }else {
                        deferred.reject(response.resultName);
                    }
                }).error(function (error) {
                    deferred.reject(error);
                });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        },
        sdv: function(patientFlow,visitFlow) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            //ajax请求
            $http.jsonp($rootScope.SERVICE_URL+"/sdv?patientFlow="+patientFlow+"&visitFlow="+visitFlow+"&callback=JSON_CALLBACK")
                .success(function (response) {
                    if(response.resultId==200){
                        projData.sdv = response;
                        deferred.resolve('Success!');
                    }else {
                        deferred.reject(response.resultName);
                    }
                }).error(function (error) {
                    deferred.reject(error);
                });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        },
        auditVisit: function(recordFlow) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.jsonp($rootScope.SERVICE_URL+"/auditVisit?recordFlow="+recordFlow+"&userFlow="+$rootScope.user.userFlow+"&callback=JSON_CALLBACK")
                .success(function (response) {
                    if(response.resultId==200){
                        projData.sdv.sdvOperName = response.sdvOperName;
                        projData.sdv.sdvOperStatusName = response.sdvOperStatusName;
                        projData.sdv.sdvOperTime = response.sdvOperTime;
                        deferred.resolve('Success!');
                    }else {
                        deferred.reject(response.resultName);
                    }
                }).error(function (error) {
                    deferred.reject(error);
                });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        },
        sendQuery: function(recordFlow) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.jsonp($rootScope.SERVICE_URL+"/sendQuery?recordFlow="+recordFlow+"&userFlow="+$rootScope.user.userFlow+"&callback=JSON_CALLBACK")
                .success(function (response) {
                    if(response.resultId==200){
                        deferred.resolve('Success!');
                    }else {
                        deferred.reject(response.resultName);
                    }
                }).error(function (error) {
                    deferred.reject(error);
                });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        },
        querylist:  function(projFlow,visitFlow,patientFlow) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.jsonp($rootScope.SERVICE_URL+"/querylist?projFlow="+projFlow+"&visitFlow="+visitFlow+"&patientFlow="+patientFlow+"&callback=JSON_CALLBACK")
                .success(function (response) {
                    if(response.resultId==200){
                        projData.patient.querys = response.queryList;
                        deferred.resolve('Success!');
                    }else {
                        deferred.reject(response.resultName);
                    }
                }).error(function (error) {
                    deferred.reject(error);
                });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        },
        photos:  function(patientFlow,visitFlow) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.jsonp($rootScope.SERVICE_URL+"/patientCase?patientFlow="+patientFlow+"&visitFlow="+visitFlow+"&callback=JSON_CALLBACK")
                .success(function (response) {
                    if(response.resultId==200){
                        projData.patient.photos = response.images;
                        deferred.resolve(projData.patient.photos);
                    }else {
                        deferred.reject(response.resultName);
                    }
                }).error(function (error) {
                    deferred.reject(error);
                });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        },
        uploadPatientCase:  function(patientFlow,photoData) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http({method: 'post', url: $rootScope.SERVICE_URL+"/uploadPatientCase?patientFlow="+patientFlow,
                data: {photoData:photoData}
            }) .success(function (response) {
                if(response.resultId==200){
                    projData.patient.photos = response.images;
                    deferred.resolve("success");
                }else {
                    deferred.reject(response.resultName);
                }
            }).error(deferred.reject);

            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        },
        getPhotoIndex: function(imgFlow) {
            var photos = projData.patient.photos;
            for(var i=0;i<photos.length;i++){
                if(photos[i].imageFlow == imgFlow){
                    return i;
                }
            }
            return 0;
        },
        getPhoto: function(imgFlow) {
            var photos = projData.patient.photos;
            for(var i=0;i<photos.length;i++){
                if(photos[i].imageFlow == imgFlow){
                    return photos[i];
                }
            }
            return null;
        },
        savePhotoNote: function (patientFlow,visitFlow,imgFlow,note){
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http({method: 'post', url: $rootScope.SERVICE_URL+"/savePhotoNote",
                data: {patientFlow:patientFlow,visitFlow:visitFlow,note:note,imgFlow:imgFlow}
            }) .success(function () {
                deferred.resolve("success");
            }).error(deferred.reject);

            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        },
        delPhoto:function (patientFlow,visitFlow,imageFlow){
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.jsonp($rootScope.SERVICE_URL+"/deletePhoto?visitFlow="+visitFlow+"&patientFlow="+patientFlow+"&imageFlow="+imageFlow+"&callback=JSON_CALLBACK")
                .success(function (response) {
                    if(response.resultId==200){
                        deferred.resolve(projData.patient.photos);
                    }else {
                        deferred.reject(response.resultName);
                    }
                }).error(function (error) {
                    deferred.reject(error);
            });

            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    };
})
.factory('WeiXinService', function($q, $http,$rootScope) {

    return {
        getSign: function(url) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.jsonp($rootScope.SERVICE_URL+"/getSign?callback=JSON_CALLBACK&url="+url)
                .success(function (response) {
                    $rootScope.signData = response;
                    deferred.resolve("success");
                })
                .error(function (error) {
                    deferred.reject(error);
                });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        },
        pullPhoto:function(patientFlow,visitFlow,serverId){
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.jsonp($rootScope.SERVICE_URL+"/pullPhoto?callback=JSON_CALLBACK&serverId="+serverId+"&patientFlow="+patientFlow+"&visitFlow="+visitFlow)
                .success(function (response) {
                    deferred.resolve("success");
                })
                .error(function (error) {
                    deferred.reject(error);
                });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    };
});