angular.module("byu.controllers.viewItem", ["byu.api"])

.controller("viewItem", ['$scope', 'serverCalls', '$stateParams', function($scope, serverCalls, $stateParams){
  console.log("TEST");
  serverCalls.getItem($stateParams.itemID).then(function(result){
    console.log(result.data);
    $scope.item = result.data;

    $scope.loaded = true;
  });
}])
