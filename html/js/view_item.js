angular.module("byu.controllers.viewItem", ["byu.api"])

.controller("viewItem", ['$scope', 'serverCalls', '$stateParams', function($scope, serverCalls, $stateParams){
  console.log("View Item Controller Contacted");
  $scope.showAddComment = false;
  $scope.showCommentForm = function() {
    $scope.showAddComment = true;
  }

  $scope.closeCommentForm = function() {
    $scope.showAddComment = false;
  }

  $scope.submitComment = function() {
    $scope.showAddComment = false;
  }

  serverCalls.getItem($stateParams.itemID).then(function(result){
    console.log(result.data);
    $scope.item = result.data;

    $scope.loaded = true;
  });
}])
