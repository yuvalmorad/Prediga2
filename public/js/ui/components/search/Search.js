window.component = window.component || {};
component.Search = (function(){
    return React.createClass({
        getInitialState: function() {
            return {
                searchStr: ''
            }
        },

        onInputChange: function(event) {
            var value = event.target.value;
            this.setState({searchStr: value});
            this.props.onSearch(value);
        },

		onClear: function() {
            var value = '';
			this.setState({searchStr: value});
			this.props.onSearch(value);
        },

        render: function(){
            var state = this.state;
            var searchStr = state.searchStr;
            var props = this.props;
            var width = props.width;
            var style = {
                width: width
            };

            return re("div", {className: "search-component", style: style},
                re("input", {type: "text", value: searchStr, onChange: this.onInputChange}),
                re("span", {className: "search-tooltip" + (searchStr ? " hide" : "")}, " Search"),
				re("a", {className: "search-clear" + (searchStr ? "" : " hide"), onClick: this.onClear}, "x")
            );
        }
    });
})();


