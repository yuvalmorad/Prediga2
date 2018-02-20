window.service = window.service || {};
service.groupMessages = (function() {
    return {
        getAllByGroupId: getAllByGroupId,
        createMessage: createMessage
    };

    function getAllByGroupId(groupId) {
        return httpInstnace.get("/api/groupMessages/" + groupId).then(function(res){
            return res.data
        });
    }

    function createMessage(message, groupId) {
        //message = {message}
        return httpInstnace.post("/api/groupMessages/" + groupId, message).then(function(res){
            return res.data
        });
    }
})();