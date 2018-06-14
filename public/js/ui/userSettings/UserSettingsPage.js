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
				re("div", {className: "scroll-container"},
					re("h1", {className: "smallMarginBottom"}, "User Settings"),
					re("h3", {className: "smallMarginBottom"}, "Reminders"),
					re("div", {className: "sub-title-container"},
						re("input", {
							type: "checkbox",
							id: "enablePushCheckbox",
							checked: utils.userSettings.isUserSettingsEnabled(userSettings, utils.userSettings.KEYS.PUSH_NOTIFICATION),
							onChange: this.toggleSettings.bind(this, utils.userSettings.KEYS.PUSH_NOTIFICATION)
						}),
						re("label", {
							className: "small-text",
							htmlFor: "enablePushCheckbox"
						}, "Send me reminders")
					),
					re("label", {
						className: "small-text",
					}, "[i] If you forget to make a match or team prediction, Prediga can send you a reminder via your browser one hour before the prediction cutoff time. Make sure you allow push notifications from Prediga in your browser."),
					re("br"),
					re("label", {
						className: "small-text",
					}, "If you've enabled the random autofill and autocopy settings, they'll not be applied.")
				))
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