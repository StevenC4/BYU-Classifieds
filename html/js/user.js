angular.module("byu.controllers.user", ["byu.api", "byu.usercookie"])
    .controller("user", ['$scope', 'serverCalls', '$state', '$stateParams', 'userCookie', function($scope, serverCalls, $state, $stateParams, userCookie){
        $scope.user = userCookie.getUser();
        //$scope.items = ($scope.user !== null ? serverCalls.getUserItems($scope.user._id) : null);
        $scope.items = null;

        console.log($scope.items);

        $scope.validateUser = function() {
            var response = serverCalls.validateUser($scope.username, $scope.password);
            response.then(function(result){
                console.log(result.data);
                if (result.data == "-1") {
                    $scope.user = null;
                } else {
                    userCookie.setUser(result.data);
                    $state.go('profile', {'id': result.data._id});
                }
            });
        };

        $scope.registerUser = function() {
            var response = serverCalls.insertUser($scope.user);
            response.then(function(result){
                console.log(result.data);
                if (result == "created") {
                    $state.go('profile');
                } else {
                    alert('That user already exists');
                }
            });
        };

        $scope.getUserData = function() {

        };
    }]);

