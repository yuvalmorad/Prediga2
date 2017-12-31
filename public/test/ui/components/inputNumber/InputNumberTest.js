describe("InputNumber", function () {
    it("with num", function () {
        var num = 3;
        ReactDOM.render(re(component.InputNumber, {num: num}), document.body);
        expect(document.querySelector(".number").textContent).toEqual("3");
    });

    it("with num with min (1)", function () {
        var num = 3;
        var min = 2;
        ReactDOM.render(re(component.InputNumber, {num: num, min: min}), document.body);
        expect(document.querySelector(".number").textContent).toEqual("3");
    });

    it("with num with min (2)", function () {
        var num = 3;
        var min = 4;
        ReactDOM.render(re(component.InputNumber, {num: num, min: min}), document.body);
        expect(document.querySelector(".number").textContent).toEqual("4");
    });

    it("with num add remove num", function () {
        var num = 3;
        var onChange = jasmine.createSpy();
        ReactDOM.render(re(component.InputNumber, {num: num, onChange: onChange}), document.body);
        expect(document.querySelector(".number").textContent).toEqual("3");

        var incrementButton = document.querySelector(".input-number button:first-child");
        var decrementButton = document.querySelector(".input-number button:last-child");

        incrementButton.click();
        expect(onChange).toHaveBeenCalledWith(4);

        decrementButton.click();
        expect(onChange).toHaveBeenCalledWith(2);
    });

    it("with min add remove num", function () {
        var min = 4;
        var onChange = jasmine.createSpy();
        ReactDOM.render(re(component.InputNumber, {min: min, onChange: onChange}), document.body);
        expect(document.querySelector(".number").textContent).toEqual("4");

        var incrementButton = document.querySelector(".input-number button:first-child");
        var decrementButton = document.querySelector(".input-number button:last-child");

        incrementButton.click();
        expect(onChange).toHaveBeenCalledWith(5);

        decrementButton.click();
        //decrement shouldn't fire onCHange beacuse it is under min
        expect(onChange).toHaveBeenCalledTimes(1)
    });

    it("without num", function () {
        ReactDOM.render(re(component.InputNumber, {}), document.body);
        expect(document.querySelector(".number").textContent).toEqual("-");
    });

    it("without num with min", function () {
        ReactDOM.render(re(component.InputNumber, {min: 4}), document.body);
        expect(document.querySelector(".number").textContent).toEqual("4");
    });

    it("without num add remove num", function () {
        var onChange = jasmine.createSpy();
        ReactDOM.render(re(component.InputNumber, {onChange: onChange}), document.body);
        expect(document.querySelector(".number").textContent).toEqual("-");

        var incrementButton = document.querySelector(".input-number button:first-child");
        var decrementButton = document.querySelector(".input-number button:last-child");

        decrementButton.click();
        //shouldn't call
        expect(onChange).toHaveBeenCalledTimes(0);

        incrementButton.click();
        expect(onChange).toHaveBeenCalledWith(0);
    });


});