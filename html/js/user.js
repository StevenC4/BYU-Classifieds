angular.module("byu.controllers.user", ["byu.api"])

.controller("user", ['$scope', 'serverCalls', '$state', '$stateParams', function($scope, serverCalls, $state, $stateParams){
        $scope.user = null;
        $scope.username = "";
        $scope.password = "";
        $scope.validateUser = function() {
            var user = serverCalls.validateUser($scope.username, $scope.password);
            console.log(user);
            if (user == "-1") {
                $scope.user = null;

            } else {
                $scope.user = user;
                $state.go('profile');
            }
        }
}]);
