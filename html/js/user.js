angular.module("byu.controllers.user", ["byu.api"])

.controller("user", ['$scope', 'serverCalls', '$state', '$stateParams', function($scope, serverCalls, $state, $stateParams){
        $scope.user = null;
        $scope.username = "";
        $scope.password = "";
        $scope.validateUser = function() {
            var response = serverCalls.validateUser($scope.username, $scope.password);
            response.then(function(result){
              console.log(result.data);
              if (result.data == "-1") {
                  $scope.user = null;

              } else {
                  $scope.user = result.data;
                  $state.go('profile');
              }
            });
        }
}]);
