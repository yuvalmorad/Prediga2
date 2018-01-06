var testHelper = {
    createStore: function() {
        return initStore();
    },

    renderComponent: function(comonent, props, _store) {
        return ReactDOM.render(
            re(ReactRedux.Provider, {store: _store || testHelper.createStore()},
                re(comonent, props)
            ),
            document.body
        );
    }
};

beforeEach(function() {

});

afterEach(function() {
    ReactDOM.unmountComponentAtNode(document.body)
});