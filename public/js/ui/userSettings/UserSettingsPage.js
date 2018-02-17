window.component = window.component || {};
component.UserSettingsPage = (function () {
    var connect = ReactRedux.connect;

	var UserSettingsPage = React.createClass({
        enablePushChanged: function() {
            var isSelect = event.target.checked;
			if (isSelect) {
				//enable
                pushNotifications.askPermissionAndPersistPushSubscriptionIfNeeded();
			} else {
				//disable
                this.props.disablePush();
			}
		},

		render: function() {
        	var props = this.props,
                userSettings = props.userSettings,
                isPushNotificationsEnabled = utils.userSettings.isPushNotificationsEnabled(userSettings);

			return re("div", {className: "content"},
				re("div", {className: "sub-title-container"},
					re("label", {className: "small-text", htmlFor: "enablePushCheckbox"}, "Enable Push Notifications"),
					re("input", {type: "checkbox", id: "enablePushCheckbox", checked: isPushNotificationsEnabled, onChange: this.enablePushChanged})
				)
			);
		}
	});

    function mapStateToProps(state){
        return {
			userSettings: state.userSettings.userSettings
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            disablePush: function(){dispatch(action.userSettings.disablePush())}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(UserSettingsPage);
})();

/*
1. Random all (checkbox) (current - which are not filled and all future )
2. Copy predictions to all my groups (checkbox) (current and future)
3. Enable Push Notifications (checkbox)
 */