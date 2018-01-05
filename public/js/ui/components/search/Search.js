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

        render: function(){
            var state = this.state;
            var searchStr = state.searchStr;

            return re("div", {className: "search-component"},
                re("input", {type: "text", value: searchStr, onChange: this.onInputChange}),
                re("span", {className: (searchStr ? "hide" : "")}, "")
            );
        }
    });
})();


