describe("CreateNewGroupPage", function () {
    it("test1", function () {
        ReactDOM.render(re(component.CreateNewGroupPage, {store: window.store}), document.body);
        expect(document.querySelector(".content").textContent).toEqual("create group...");
    });
});