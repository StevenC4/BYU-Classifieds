angular.module("byu.controllers.user", ["byu.api"])

.controller("user", ['$scope', 'serverCalls', '$state', '$stateParams', function($scope, serverCalls, $state, $stateParams){
        $scope.user = null;
        $scope.username = "";
        $scope.password = "";
        $scope.validateUser = function() {
            console.log("Here");
            $scope.user = serverCalls.validateUser($scope.username, $scope.password);
            $state.go('user');
        }
}]);
