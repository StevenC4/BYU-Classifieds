angular.module("byu.controllers.user", ["byu.api"])

    .controller("user", ['$scope', 'serverCalls', '$state', '$stateParams', function($scope, serverCalls, $state, $stateParams){
        $scope.user = null;
        $scope.username = "";
        $scope.password = "";
        $scope.password_confirm = "";
        $scope.first_name = "";
        $scope.last_name = "";
        $scope.address = "";
        $scope.city = "";
        $scope.state = "";
        $scope.zip = "";
        $scope.phone_number = "";
        $scope.phone_type = "";
        $scope.email = "";

        $scope.validateUser = function() {
            var response = serverCalls.validateUser($scope.username, $scope.password);
            response.then(function(result){
                console.log(result.data);
                if (result.data == "-1") {
                    $scope.user = null;
                } else {
                    /*$scope.user = result.data;
                    $scope.username = $scope.user.username;
                    $scope.password = "";
                    $scope.password_confirm = "";
                    $scope.first_name = $scope.user.first_name;
                    $scope.last_name = $scope.user.last_name;
                    $scope.address = $scope.user.address.street;
                    $scope.city = $scope.user.address.city;
                    $scope.state = $scope.user.address.state;
                    $scope.zip = $scope.user.address.zip;
                    $scope.phone_number = $scope.user.phone_number.number;
                    $scope.phone_type = $scope.user.phone_number.phone_type;
                    $scope.email = $scope.user.email;
                    */$state.go('profile', {'id': result.data._id});
                }
            });
        };

        $scope.registerUser = function() {
            var response = serverCalls.insertUser({
                "username": $scope.username,
                "password": $scope.password,
                "first_name": $scope.first_name,
                "last_name": $scope.last_name,
                "address": {
                    "street": $scope.address,
                    "city": $scope.city,
                    "state": $scope.state,
                    "zip": $scope.zip
                },
                "phone_number": {
                    "number": $scope.phone_number,
                    "type": $scope.phone_type
                },
                "email": $scope.email
            });
            response.then(function(result){
                console.log(result.data);
            });
        };

        $scope.getUserData = function() {

        }
    }]);
