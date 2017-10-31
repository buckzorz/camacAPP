'use strict'

angular.module('carmacApp', ['ui.router', 'ngResource'])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouteProvider){
    $stateProvider
        .state('app', {
            url:'/',
            views: {
                'header': {
                    templateUrl: 'views/header.html',
                    controller: 'headerController'
                },
                'content': {
                    templateUrl: 'views/home.html',
                    controller: 'homeController'
                },
                'footer': {
                    templateUrl: 'views/footer.html'
                }
            }
        })
        .state('app.login',{
            url: 'login',
            views: {
                'content@': {
                    templateUrl: 'views/login.html',
                    controller: 'loginController'
                }
            }
        })
        .state('app.createorder', {
            url: 'createorder',
            views:{
                'content@': {
                    templateUrl: 'views/createorder.html',
                    controller: 'createorderController'
                }
            }
        })
        .state('app.allorders', {
            url: 'allorders',
            views:{
                'content@': {
                    templateUrl: 'views/allorders.html',
                    controller: 'allordersController'
                }
            }
        })
        .state('app.orders', {
            url: 'orders/:id',
            views:{
                'content@': {
                    templateUrl: 'views/orderdetails.html',
                    controller: 'orderdetailsController'
                }
            }
        })
        .state('app.track', {
            url: 'track',
            views:{
                'content@': {
                    templateUrl: 'views/track.html',
                    controller: 'trackController'
                }   
            }
        })
        .state('app.about', {
            url: 'about',
            views:{
                'content@':{
                    templateUrl: 'views/about.html',
                    controller: 'aboutController'
                }
            }
        })
        .state('app.neworder', {
            url: 'neworder/:id',
            views:{
                'content@':{
                    templateUrl: 'views/neworder.html',
                    controller: 'neworderController'
                }
            }
        })
        .state('app.trackdetails', {
            url: 'trackdetails',
            views:{
                'content@': {
                    templateUrl: 'views/trackdetails.html',
                    controller: 'trackdetailsController'   
                }      
            },
            params: {
                obj: null
            }
        });
        
        $urlRouteProvider.otherwise('/')
}]);