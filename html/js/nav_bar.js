angular.module("byu.controllers.navBar", [])
    .controller("navBar", ['$scope', '$state', function($scope, $state){
        $scope.isActive = function(viewLocation) {
            console.log($state);
            return viewLocation === $state.current.name;
        }
    }]);
