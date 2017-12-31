//ReactDOM.unmountComponentAtNode(document.body);
describe("AboutPage", function () {
    it("test1", function () {
        ReactDOM.render(re(component.AboutPage, {}), document.body);
        expect(document.querySelector("h3").textContent).toEqual("About");
    });
});