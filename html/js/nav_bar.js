angular.module("byu.controllers.navBar", ['byu.controllers.user'])
    .controller("navBar", ['$scope', '$state', function($scope, $state){
        $scope.isActive = function(viewLocation) {
            return viewLocation === $state.current.name;
        }
    }]);
