window.component = window.component || {};
component.GroupMessagesPage = (function () {
    var connect = ReactRedux.connect;

    function isLTR(char) {
		return /[a-zA-Z]/.test(char);
    }

    function isRTL(char) {
		return /[א-ת]/.test(char);
    }

    function getTextDirection(str) {
    	var i;
    	for (i = 0; i < str.length; i++) {
    		var char = str.charAt(i);
            if (isRTL(char)) {
                return "rtl";
            }

            if (isLTR(char)) {
                return "ltr";
            }
		}

		return "ltr";
	}

	var GroupMessagesPage = React.createClass({
        getInitialState: function() {
            if (this.props.selectedGroupId) {
                this.props.loadGroupMessages(this.props.selectedGroupId);
                this.props.resetUnreadMessage(this.props.selectedGroupId);
            }

            return {
            	messageStr: "",
                direction: ""
			};
        },

        componentDidMount: function() {
			this.scrollToBottom();
		},

		componentDidUpdate: function(prevProps) {
        	if (this.props.groupMessages !== prevProps.groupMessages) {
                this.scrollToBottom();
            }
		},

		scrollToBottom: function() {
        	if (this.scrollElem) {
                this.scrollElem.scrollTo(0, this.scrollElem.scrollHeight);
            }
		},

        componentWillReceiveProps: function(nextProps) {
            if (nextProps.selectedGroupId !== this.props.selectedGroupId) {
                //changed group selection -> load group messages of selected group id
                this.props.loadGroupMessages(nextProps.selectedGroupId);
                this.props.resetUnreadMessage(nextProps.selectedGroupId);
            }
        },

        onMessageStrChanged: function(event) {
        	var newVal = event.target.value;
        	var direction = getTextDirection(newVal);
			this.setState({
                messageStr: newVal,
                direction: direction
			});
		},

        onMessageStrKeyUp: function(event) {
        	console.log("up");
		},

        sendMessage: function() {
        	var state = this.state,
                messageStr = state.messageStr;

        	if (!messageStr) {
        		return;
			}

        	var message = {
                message: messageStr
			};

			this.props.sendMessage(message, this.props.selectedGroupId);
			this.setState({
                messageStr: ""
			});
		},

        assignScrollRef: function(elem) {
        	this.scrollElem = elem;
		},

		render: function() {
        	var props = this.props,
				state = this.state,
                groupMessages = props.groupMessages,
                users = props.users,
                userId = props.userId;

        	var tiles = groupMessages.sort(function(g1, g2){
        		//sort can be moved to server
				return new Date(g1.creationDate) - new Date(g2.creationDate);
			}).map(function(groupMessage) {
				var userNameElem;
				var groupMessageClassName =  "group-message";
				if (userId === groupMessage.userId) {
					//logged user
                    groupMessageClassName += " logged-user";
				} else {
                    var user = utils.general.findItemInArrBy(users, "_id", groupMessage.userId);
                    userNameElem = re("div", {className: "user-name"},
                        user ? user.name : ""
                    );
				}
        		return re("div", {className: groupMessageClassName, key: groupMessage._id},
					re("div", {className: "group-message-content"},
						userNameElem,
						re("div", {className: "message", style: {direction: getTextDirection(groupMessage.message)}},
							groupMessage.message
						),
						re("div", {className: "time"},
							utils.general.formatHourMinutesTime(groupMessage.creationDate)
						)
                    )
				);
			});

			return re("div", {className: "group-messages-page content"},
				re("div", {className: "scroll-container", ref: this.assignScrollRef},
                    re("div", {className: "groups-messages"},
                    	tiles
					)
				),
                re("div", {className: "inputs-container"},
                    re("div", {className: "input-wrapper"},
                    	re("textarea", {placeholder:"Type a message", value: state.messageStr, style: {direction: state.direction}, onChange: this.onMessageStrChanged})
					),
                    re("button", {className: "send-message", disabled: !state.messageStr, onClick: this.sendMessage}, "")
				)
			);
		}
	});

    function mapStateToProps(state){
        return {
            selectedGroupId: state.groups.selectedGroupId,
            groupMessages: state.groupMessages.groupMessages,
			users: state.users.users,
            userId: state.authentication.userId
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            loadGroupMessages: function(groupId){dispatch(action.groupMessages.loadGroupMessages(groupId))},
            sendMessage: function(message, groupId){dispatch(action.groupMessages.sendMessage(message, groupId))},
            resetUnreadMessage: function(groupId){dispatch(action.groupMessages.resetUnreadMessage(groupId))}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(GroupMessagesPage);
})();