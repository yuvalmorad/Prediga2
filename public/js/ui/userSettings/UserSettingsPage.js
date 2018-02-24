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

					re("h3", {className: "smallMarginBottom"}, "Prediction Autofill & Autocopy"),

					re("div", {className: "sub-title-container"},
						re("input", {
							type: "checkbox",
							id: "enableRandomAllCheckbox",
							checked: utils.userSettings.isUserSettingsEnabled(userSettings, utils.userSettings.KEYS.RANDOM_ALL),
							onChange: this.toggleSettings.bind(this, utils.userSettings.KEYS.RANDOM_ALL).bind(this)
						}),
						re("label", {
							className: "small-text",
							htmlFor: "enableRandomAllCheckbox"
						}, "Make random predictions for me (Everyone group only)")
					),
					re("label", {
						className: "small-text",
					}, "[i] Prediga can make randomized match and team predictions for you one hour before their cutoff time."),
					re("br"),
					re("label", {
						className: "small-text",
					}, "Applies only to predictions that you haven't completed on time in the Everyone group. You can still modify randomized predictions after they have been set (until the prediction cutoff)."),

					re("div", {className: "sub-title-container"},
						re("br"),
						re("input", {
							type: "checkbox",
							id: "enableCopyPredictionsToAllGroupsCheckbox",
							checked: utils.userSettings.isUserSettingsEnabled(userSettings, utils.userSettings.KEYS.COPY_ALL_GROUPS),
							onChange: this.toggleSettings.bind(this, utils.userSettings.KEYS.COPY_ALL_GROUPS)
						}),
						re("label", {
							className: "small-text",
							htmlFor: "enableCopyPredictionsToAllGroupsCheckbox"
						}, "Copy my predictions from Everyone group to my other groups")
					),
					re("label", {
						className: "small-text",
					}, "[i] One hour before the cutoff time of a match or team prediction, Prediga can copy your prediction, including autofill randomized predictions, from the Everyone group to all other groups that you are a member of."),
					re("br"),
					re("label", {
						className: "small-text",
					}, "Applies only to predictions that you haven't completed on time. You can still modify autocopied predictions after they have been set (until the prediction cutoff)."),
					re("br"),
					re("br"),
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