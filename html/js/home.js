angular.module("byu.controllers.home", ["byu.api"])

.service("HomeCategoriesService", function(){
    return [{
      name: "Apartment Contracts"
    },
    {
      name: "Music Gear"
    },
    {
      name: "Jewelry"
    },
    {
      name: "Books"
    },
    {
      name: "Textbooks"
    },
    {
      name: "Carpool Rides"
    },
    {
      name: "Furniture"
    },
    {
      name: "Computers"
    },
    {
      name: "Video Games"
    },
    {
      name: "Movies"
    },
    {
      name: "House Appliances"
    },
    {
      name: "Cars and Auto Parts"
    },
    {
      name: "Cell Phones"
    },
    {
      name: "Sport Gear"
    },
    {
      name: "Other Electronics"
    },
    {
      name: "Free"
    }]
})

.controller("homeCtrl", ['$scope', 'serverCalls', 'HomeCategoriesService', function($scope, serverCalls, HomeCategoriesService){
    $scope.categories = HomeCategoriesService;
}])
