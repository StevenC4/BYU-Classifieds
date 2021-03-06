angular.module("byu.api", [])

.service("serverCalls", ["$http",
  function($http){
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    return {
        validateUser: function(username, password){
            return $http.post("/validateuser", {
                "username": username,
                "password": password
            }).success(function(result){
                return result;
            }).error(function(result){
                return result;
            });
        },
        getUser: function(userId) {
            return $http.post("/getuser", userId
            ).success(function(result){
                return result;
            }).error(function(result){
                return result;
            });
        },
        insertUser: function(userInfo){
            return $http.post("/insertuser", userInfo
            ).success(function(result){
                return result;
            }).error(function(result){
                return result;
            });
        },
        updateUser: function(){
            return $http.post("/updateuser"
            ).success(function(result){
                return result;
            }).error(function(result){
                return result;
            });
        },
        removeUser: function(){
            return $http.post("/removeuser"
            ).success(function(result){
                return result;
            }).error(function(result){
                return result;
            });
        },
        find: function(title){
            return $http.post("/find",
            {
              "Title": title
            }).success(function(result){
                return result;
            }).error(function(result){
                return result;
            });
        },
        getAllItems: function(){
            return $http.get("/get_all_items"
            ).success(function(result){
                return result;
            }).error(function(result){
                return result;
            });
        },
        getItem: function(id){
            return $http.post('/get_item',
            {
              "ID": id
            }).success(function(result){
                return result;
            }).error(function(result){
                return result;
            });
        },
        getCategoryItems: function(category){
            return $http.post("/get_category_items",
            {
              "Category": category
            }).success(function (result) {
                console.log("\nSuccess! Returned: " + JSON.stringify(result, null, 2));
                return result;
            }).error(function(result){
                return result;
            });
        },
        getUserItems: function(userId) {
            return $http.post("/get_user_items",
                {
                    "UserID": userId
                }).success(function(result){
                    console.log("\nSuccess! Returned: " + JSON.stringify(result, null, 2));
                    return result;
                }).error(function(result){
                    return result;
                });
        },
        postItem: function(title, path, user, date, category){
            return $http.post("/post_item",
            {
              "Title": title,
              "Picture": path,
              "UserID": user,
              "PostDate": date,
              "Category": category,
              "Bought": false,
              "Comments": []
            }).success(function(result){
                return result;
            }).error(function(result){
                return result;
            });
        },
        deleteItem: function(id){
            return $http.post("/delete_item",
            {
              "ID": id
            }).success(function(result){
                return result;
            }).error(function(result){
                return result;
            });
        },
        comment: function(itemID, user, comment){
            return $http.post("/comment",
            {
              "ID": itemID,
              "UserID": user,
              "Comment": comment
            }).success(function(result){
                return result;
            }).error(function(result){
                return result;
            });
        },
        removeAllItems: function(){
            return $http.post("/remove_all_items"
            ).success(function(result){
                return result;
            }).error(function(result){
                return result;
            });
        }
    }
}])
