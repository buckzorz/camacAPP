'use strict'

angular.module('carmacApp')

.controller('headerController', ['$scope', '$state', '$rootScope', function ($scope, $state, $rootScope) {
    $scope.hi = 'HELLO!';
}])
.controller('homeController', ['$scope', '$state', '$rootScope', function ($scope, $state, $rootScope){
    
    
}])
.controller('loginController', ['$scope', '$state', '$rootScope','$localStorage', 'AuthFactory',  function($scope, $state, $rootScope, $localStorage, AuthFactory){
    $scope.loginData = {};
    $scope.doLogin = function() {
        if($scope.rememberMe)
           $localStorage.storeObject('userinfo',$scope.loginData);
        AuthFactory.login($scope.loginData);
    };
    
}])
.controller('createorderController', ['$scope', '$state', '$rootScope', 'orderFactory', function($scope, $state, $rootScope, orderFactory){
    
    $scope.newOrder = {};
    
    $scope.createorder = function () {  
        orderFactory.save($scope.newOrder)
            .$promise.then(function(response) {
                console.log('Succesfully added order');    
            }, function (response) {
                console.log('Error:' + response.status + ' ' + response.statusText);
            });
    };
       
    
}])
.controller('allordersController', ['$scope', '$state', '$rootScope', 'orderFactory',function($scope, $state, $rootScope, orderFactory){
    orderFactory.query(
        function (response) {
            $scope.orders = response;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });
    
    $scope.filters = {};
    $scope.filterOrders = function() {
        //code for fetching an appartment based on filter
        apartmentsFactory.query($scope.filter).$promise.then(
            function (response) {
                $scope.orders = response;
            },
            function (responce) {
                $scope.message = "Error: " + responce.status + " " + responce.statusText;
            }
        );
    };
}])
.controller('orderdetailsController', ['$scope', '$state', '$rootScope', function($scope, $state, $rootScope){
    $scope.wheelSpec = {};
    $scope.spokeLength = function(wheel){
        console.log(wheel);
        
        $scope.spokeLengthLeft = Math.sqrt($scope.wheelSpec[wheel].hub.leftside.flangedistance + $scope.wheelSpec[wheel].hub.leftside.pitchleft + ($scope.wheelSpec[wheel].rim.erd)/2 - 2*($scope.wheelSpec[wheel].hub.leftside.pitchleft)*($scope.wheelSpec[wheel].rim.erd)*(Math.cos(360*(($scope.wheelSpec[wheel].spokes.spokecount)/2)/($scope.wheelSpec[wheel].spokes.crossesleft))));
        
        $scope.spokeLengthRight = Math.sqrt($scope.wheelSpec[wheel].hub.rightside.flangedistance + $scope.wheelSpec[wheel].hub.rightside.pitchright + ($scope.wheelSpec[wheel].rim.erd)/2 - 2*($scope.wheelSpec[wheel].hub.rightside.pitchright)*($scope.wheelSpec[wheel].rim.erd)*(Math.cos(360*(($scope.wheelSpec[wheel].spokes.spokecount)/2)/($scope.wheelSpec[wheel].spokes.crossesright))));  
        console.log($scope.spokeLengthLeft);
        
        $scope.wheelSpec[wheel].spokes.spokeLengthLeft = $scope.spokeLengthLeft.toFixed(2);
        $scope.wheelSpec[wheel].spokes.spokeLengthRight = $scope.spokeLengthRight.toFixed(2);
        console.log( $scope.wheelSpec[wheel].spokes.spokeLengthLeft);
        console.log( $scope.wheelSpec[wheel].spokes.spokeLengthRight);
    };
    
    $scope.invoice = [];
    $scope.orderTotal = 0;
    $scope.save = function(service, quantity, price){
        $scope.invionceField = {service, quantity, price}; 
        $scope.invoice.push($scope.invionceField);
        console.log($scope.invoice);
    }
    $scope.total = function(){
         $scope.orderTotal += $scope.invoice[$scope.invoice.length - 1].price * $scope.invoice[$scope.invoice.length - 1].quantity;
        /* 
            CLACULATES ORDER TOTAL WHEN LOADED FROM DB
        for(var i = 0; i < $scope.invoice.length; i++){
            console.log($scope.invoice[i].price);
            console.log($scope.invoice[i].quantity);
            $scope.orderTotal += $scope.invoice[i].price * $scope.invoice[i].quantity;
        }*/
    }
    
    $scope.completedStep = function(step){
        $scope.progress = ["ordercreated","materialsacquired","jobscheduled","wheelsarebeingbuilt","ordercompleted"];
        $scope.step = $scope.progress.indexOf(step);
        for(var i = 0; i <= 4; i++){
            if(i <= $scope.step){
                document.getElementById($scope.progress[i]).className += " completed";    
            } else {
                document.getElementById($scope.progress[i]).classList.remove("completed");
            }
            
        };
        $scope.orderProgress.status = $scope.step;
        var d = new Date();
        $scope.orderProgress.time = d.toString();
    };
    $scope.orderProgress = {'status': null,
                            'time': null
                           };
    $scope.orderinfo = {};
}])
.controller('trackController', ['$scope', '$state', '$rootScope', 'orderFactory', 'baseURL', function($scope, $state, $rootScope, orderFactory, baseURL){
    //GETs order for consumer and forwards it to details
    $scope.search = function () {
        orderFactory.query({reference: $scope.ref}).$promise.then(
        function (response) {
            console.log(response[0]);
//            $scope.url = 'app.about'
            $scope.url = 'app.trackdetails';
            $scope.orderId =  response[0]._id;
            console.log($scope.orderId);
            $state.go($scope.url, {obj: $scope.orderId});    
        }, 
        function (response) { 
           console.log("Error: " + response.status + " " + response.statusText);    
        });
    };
    $scope.ref = 87910;
}])
.controller('trackdetailsController', ['$scope', '$state', '$rootScope', '$stateParams', 'orderFactory', function($scope, $state, $rootScope, $stateParams, orderFactory){
    orderFactory.query({_id: $stateParams.obj}).$promise.then(
    function (response) {
        console.log(response);
        $scope.invoice = response[0].invoice;
        $scope.client = response[0].client;
        $scope.orderdetails = response[0].orderdetails;
        console.log('invoice: ' + $scope.invoice);
        console.log('client: ' + $scope.client);
        console.log('orderdetails: ' + $scope.orderdetails);
    },
    function (response) {
        console.log(response);
        $scope.message = "Error: " + response.status + " " + response.statusText;        
    });

}])
.directive('editInPlace', function(){
    return {
        restrict: 'E',
        scope: {value: '='},
        template: '<span ng-click="edit()" ng-bind="value"></span><input ng-model="value"></input>',
        link: function ($scope, element, attrs) {
           var inputElement = angular.element(element.children()[1] );
           element.addClass('edit-in-place');
            if(typeof $scope.value == 'undefined'){
                $scope.value = 'NOT AVALIABLE';
                $scope.editing = true;
            } else {
               $scope.editing = false; 
            }
           $scope.edit = function () {
               if( $scope.value === 'NOT AVALIABLE'){
                   $scope.value = ''
               };
               $scope.editing = true;
               
               element.addClass('active');
               inputElement[0].focus();
               
           };
            inputElement.prop('onblur', function(){
                $scope.editing = false;
                element.removeClass('active');
            });
        }
    };
})
//.directive('editInPlaceDrop', function(){
//    return {
//        restrict: 'E',
//        scope: {value: '='},
//        template: '<span ng-click="edit()" ng-bind="value"></span><select><option ng-model="value">CC</option><option ng-model="value" value="cash">Cash</option><option ng-model="value" value="transfer">Transfer</option></select>',
//        link: function ($scope, element, attrs) {
//           var inputElement = angular.element(element.children()[1] );
//           element.addClass('edit-in-place');
//            if(typeof $scope.value == 'undefined'){
//                $scope.value = 'NOT AVALIABLE';
//                $scope.editing = true;
//            } else {
//               $scope.editing = false; 
//            }
//           $scope.edit = function () {
//               if( $scope.value === 'NOT AVALIABLE'){
//                   $scope.value = "asddqqq";
//               };
//               $scope.editing = true;
//               
//               element.addClass('active');
//               inputElement[0].focus();
//               
//           };
//            inputElement.prop('onblur', function(){
//                $scope.editing = false;
//                element.removeClass('active');
//            });
//        }
//    };
//})