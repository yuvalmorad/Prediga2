var link = document.createElement('link');
link.id = 'cssForTest';
link.rel = 'stylesheet';
link.href = 'base/public/css/main.css';
document.head.appendChild(link);

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

afterEach(function() {
    ReactDOM.unmountComponentAtNode(document.body)
});