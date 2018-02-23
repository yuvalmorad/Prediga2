window.component = window.component || {};
component.UserSettingsPage = (function () {
    var connect = ReactRedux.connect;

	var UserSettingsPage = React.createClass({
		toggleSettings: function(key) {
			if (!event){
				return;
			}

            var isSelect = event.target.checked;
			if (isSelect) {
				//enable
				if (key === utils.userSettings.KEYS.PUSH_NOTIFICATION){
					pushNotifications.askPermissionAndPersistPushSubscriptionIfNeeded();
				} else {
					this.props.toggleUserSettings(key, utils.userSettings.VALUES.TRUE);
				}
			} else if (isSelect === false){
				//disable
                this.props.toggleUserSettings(key, utils.userSettings.VALUES.FALSE);
			}
			return "false";
		},

		render: function() {
        	var props = this.props,
                userSettings = props.userSettings;

			return re("div", {className: "content"},
				re("div", {className: "sub-title-container"},
					re("label", {className: "small-text"}, "The setting will apply one hour before the deadline of the match/team")

				),
				re("div", {className: "sub-title-container"},
					re("input", {type: "checkbox", id: "enableRandomAllCheckbox", checked: utils.userSettings.isUserSettingsEnabled(userSettings, utils.userSettings.KEYS.RANDOM_ALL), onChange: this.toggleSettings.bind(this, utils.userSettings.KEYS.RANDOM_ALL).bind(this)}),
					re("label", {className: "small-text", htmlFor: "enableRandomAllCheckbox"}, "Enable automatic random prediction for matches and teams")

				),
				re("div", {className: "sub-title-container"},
					re("input", {type: "checkbox", id: "enableCopyPredictionsToAllGroupsCheckbox", checked: utils.userSettings.isUserSettingsEnabled(userSettings, utils.userSettings.KEYS.COPY_ALL_GROUPS), onChange: this.toggleSettings.bind(this, utils.userSettings.KEYS.COPY_ALL_GROUPS)}),
					re("label", {className: "small-text", htmlFor: "enableCopyPredictionsToAllGroupsCheckbox"}, "Enable copy predictions of matches and teams from default group to all groups")
				),
				re("div", {className: "sub-title-container"},
					re("input", {type: "checkbox", id: "enablePushCheckbox", checked: utils.userSettings.isUserSettingsEnabled(userSettings, utils.userSettings.KEYS.PUSH_NOTIFICATION), onChange: this.toggleSettings.bind(this, utils.userSettings.KEYS.PUSH_NOTIFICATION)}),
					re("label", {className: "small-text", htmlFor: "enablePushCheckbox"}, "Enable push notifications")
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
			toggleUserSettings: function(key, value){dispatch(action.userSettings.toggleUserSettings(key, value))}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(UserSettingsPage);
})();

/*
1. Random all (checkbox) (will have random matches and teams for all open predictions)
2. Copy predictions to all my current groups (checkbox)
3. Enable Push Notifications (checkbox)
 */