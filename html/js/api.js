angular.module("byu.api", [])

.service("serverCalls", ["$http",
  function($http){
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    return {
        validateUser: function(username, password){
            return $http.post("/validateuser", {
                "username": username,
                "password": password
            })
        },
        insertUser: function(){
            return $http.post("/insertuser")
        },
        updateUser: function(){
            return $http.post("/updateuser")
        },
        removeUser: function(){
            return $http.post("/removeuser")
        },
        find: function(title){
            return $http.post("/find",
            {
              "Title": title
            })
        },
        getAllItems: function(){
            return $http.get("/get_all_items")
        },
        getItem: function(id){
            console.log(id);
            return $http.post('/get_item',
            {
              "ID": id
            });
        },
        getCategoryItems: function(category){
            return $http.post("/get_category_item",
            {
              "Category": category
            })
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
            })
        },
        deleteItem: function(id){
            return $http.post("/delete_item",
            {
              "ID": id
            })
        },
        comment: function(itemID, user, comment){
            return $http.post("/comment",
            {
              "ID": itemID,
              "UserID": user,
              "Comment": comment
            })
        },
        removeAllItems: function(){
            return $http.post("/remove_all_items")
        }
    }
}])
