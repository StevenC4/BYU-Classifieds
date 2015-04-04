angular.module("byu.api", [])

.service("serverCalls", ["$http",
  function($http){
    return {
        validateUser: function(){
            return $http.post("http://52.10.167.115/validateuser")
        },
        insertUser: function(){
            return $http.post("http://52.10.167.115/inserteuser")
        },
        updateUser: function(){
            return $http.post("http://52.10.167.115/validateuser")
        },
        removeUser: function(){
            return $http.post("http://52.10.167.115/validateuser")
        },
        find: function(title){
            return $http.post("http://52.10.167.115/find"
            {
              "Title": title
            })
        },
        getAllItems: function(){
            return $http.get("http://52.10.167.115/get_all_items")
        },
        getItem: function(id){
            return $http.post("http://52.10.167.115/get_item",
            {
              "ID": id
            })
        },
        getCategoryItems: function(category){
            return $http.post("http://52.10.167.115/get_category_item"
            {
              "Category": category
            })
        },
        postItem: function(title, path, user, date, category){
            return $http.post("http://52.10.167.115/post_item"
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
            return $http.post("http://52.10.167.115/delete_item"
            {
              "ID": id
            })
        },
        comment: function(itemID, user, comment){
            return $http.post("http://52.10.167.115/comment"
            {
              "ID": itemID,
              "UserID": user,
              "Comment": comment
            })
        },
        removeAllItems: function(){
            return $http.post("http://52.10.167.115/remove_all_items")
        }
    }
}])
