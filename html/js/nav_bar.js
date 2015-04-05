angular.module("byu.controllers.navBar", [])
    .controller("navBar", ['$scope', '$state', function($scope, $state){
        $scope.isActive = function(viewLocation) {
            return viewLocation === $state.current.name;
        }
    }]);
