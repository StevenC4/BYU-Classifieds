angular.module("byu.controllers.viewCategory", ["byu.api"])

.controller("viewCategory", ['$scope', 'serverCalls', '$stateParams', function ($scope, serverCalls, $stateParams) {
    console.log("\nView Category Controller Called");
    serverCalls.getCategoryItems($stateParams.category).then(function (result) {
        console.log(result.data);
        $scope.categoryItems = result.data;
<<<<<<< HEAD
=======
        $scope.category = $stateParams.category;
>>>>>>> origin/master
        $scope.loaded = true;
    });
}])