angular.module("byu.controllers.navBar", ['byu.controllers.user', 'byu.usercookie'])
    .controller("navBar", ['$scope', '$state', 'userCookie', function($scope, $state, userCookie){
        $scope.user = userCookie.getUser();
        $scope.hasUser = function() {
            console.log('Tested');
            return userCookie.getUser() !== null;
        }
        $scope.isActive = function(viewLocation) {
            return viewLocation === $state.current.name;
        };
        $scope.logout = function() {
            //console.log("logout");
            userCookie.unsetUser();
            //$scope.user = userCookie.getUser();
        }
    }]);
