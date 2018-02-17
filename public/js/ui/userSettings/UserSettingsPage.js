window.component = window.component || {};
component.UserSettingsPage = (function () {
	return function UserSettingsPage(props) {
		return re("div", {className: "content"}, "user settings...");
	};
})();

/*
1. Random all (checkbox) (current - which are not filled and all future )
2. Copy predictions to all my groups (checkbox) (current and future)
3. Enable Push Notifications (checkbox)
 */