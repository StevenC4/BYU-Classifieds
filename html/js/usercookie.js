angular.module("byu.usercookie", ['ngCookies'])
    .service("userCookie", ['$cookieStore',
        function($cookieStore){
            var sessionUser;
            return {
                getUser: function() {
                    return $cookieStore.get('user');
                },
                setUser: function(user) {
                    $cookieStore.put('user', user);
                    sessionUser = user;
                },
                unsetUser: function() {
                    $cookieStore.put('user', null);
                    sessionUser = null;
                }
            }
        }]);
