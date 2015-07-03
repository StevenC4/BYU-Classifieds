angular.module("byu.controllers.navBar", ['byu.controllers.user', 'byu.usercookie'])
    .controller("navBar", ['$scope', '$state', 'userCookie', function($scope, $state, userCookie){
        $scope.user = userCookie.getUser();
        $scope.hasUser = function() {
            return userCookie.getUser() !== null;
        };
        $scope.isActive = function(viewLocation) {
            return viewLocation === $state.current.name;
        };
        $scope.logout = function() {
            userCookie.unsetUser();
        }
    }]);
