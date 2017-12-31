window.action = window.action || {};
action.authentication = (function () {

    var authentication = {
        SET_USER_ID: "SET_USER_ID",
        setUserId: setUserId
    };

    function setUserId(userId) {
        return {type: authentication.SET_USER_ID, userId: userId};
    }

    return authentication

})();