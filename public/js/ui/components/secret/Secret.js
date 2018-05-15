window.component = window.component || {};
component.Secret = (function(){

    return React.createClass({
        getInitialState: function() {
            var state = {
                secretFocusIndex: undefined
            };

            return state;
        },

        assignInputToFocus: function(input) {
            this.focusInput = input;
        },

        componentDidUpdate: function() {
            if (this.state.secretFocusIndex !== undefined) {
                this.focusInput.focus();
            }
        },

        onNumberChanged: function(index) {
            var name = event.target.name;

            var val = event.target.value;
            var num = val.slice(val.length - 1);

            this.setState({secretFocusIndex: (index + 1) % SECRET_LENGTH});
            this.props.onNumberChanged(name, num);
        },

        onInputBlur: function() {
            this.setState({secretFocusIndex: undefined});
        },

        render: function() {
            var state = this.state;
            var props = this.props;
            var secretFocusIndex = state.secretFocusIndex;
            var secretInputs = [];
            var i;

            for (i = 0; i < SECRET_LENGTH; i++) {
                var secretProperty = "secret" + i;
                var inputProps = {onBlur: this.onInputBlur, focus: i === 3, type: "number", pattern: "\\d*", key: "secret" + i, value: props[secretProperty], name: secretProperty, onChange: this.onNumberChanged.bind(this, i)};
                if (secretFocusIndex === i) {
                    inputProps.ref = this.assignInputToFocus;
                }
                secretInputs.push(
                    re("input", inputProps)
                );
            }

            return re("div", {className: "secret-container"},
                secretInputs
            );
        }
    });
})();


