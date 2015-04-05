angular.module('app', ['ui.router', 'byu.controllers'])

.config(["$stateProvider", "$urlRouterProvider",
    function($stateProvider, $urlRouterProvider){

    $urlRouterProvider.when('', 'home'); //base page is home page
    $urlRouterProvider.otherwise("/404/"); //if none of the states match, go to 404 error

    $stateProvider.state('404', {
        url:'/404/',
        title:"404 - page not found",
        templateUrl:""
    });

    $stateProvider.state('home', {
        url:'/home',
        templateUrl: '/partials/home.html',
        controller:"",
        title: 'BYU Classifieds - Home'
    });

    $stateProvider.state('login', {
        url:'/login',
        templateUrl: '/partials/login.html',
        controller:"",
        title: 'Login'
    });

    $stateProvider.state('register', {
        url:'/register',
        templateUrl: '/partials/register.html',
        controller:"",
        title: 'Welcome! Please Register'
    });

    $stateProvider.state('profile', {
        url:'/profile/:userID',
        resolve:{
            userID:function($stateParams){return $stateParams.userID},
        },
        templateUrl: '',
        controller:"",
        title: 'User Profile'
    });

    $stateProvider.state('viewCategory', {
        url:'/category/:category',
        resolve:{
            category:function($stateParams){return $stateParams.category},
        },
        templateUrl: '',
        controller: "",
        title: 'View Category'
    });

    $stateProvider.state('searchResult', {
        url:'/search/:query',
        resolve:{
            query:function($stateParams){return $stateParams.query},
        },
        templateUrl: '',
        controller: "",
        title: 'Search Results'
    });

    $stateProvider.state('viewItem', {
        url:'/items/{itemID}',
        templateUrl: '/partials/view_item.html',
        controller: "viewItem",
        title: 'View Item'
    });

}]);
