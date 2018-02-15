var link = document.createElement('link');
link.id = 'cssForTest';
link.rel = 'stylesheet';
link.href = 'base/public/css/main.css';
document.head.appendChild(link);

var testHelper = {
    renderComponent: function(comonent, props) {
        return ReactDOM.render(
            re(ReactRedux.Provider, {store: window.storeMock},
                re(comonent, props)
            ),
            document.body
        );
    }
};

beforeEach(function(){
    window.storeMock = initStore();
    localStorage.clear();
});

afterEach(function() {
    ReactDOM.unmountComponentAtNode(document.body)
});