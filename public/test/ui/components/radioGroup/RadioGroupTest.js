describe("RadioGroup", function () {
    it("with selected", function () {
        var onChange = jasmine.createSpy();
        var inputs = [
            {
                name: "inputName1",
                text: "inputText1"
            },
            {
                isDefault: true,
                name: "inputName2",
                text: "inputText2"
            },
            {
                name: "inputName3",
                text: "inputText3"
            }
        ];
        var id = "id1";
        var groupName = "group1";
        var className = "class1";

        testHelper.renderComponent(component.RadioGroup, {onChange: onChange, inputs: inputs, _id: id, name: groupName, className: className});
        var buttons = document.querySelectorAll("button.radio-button");
        expect(buttons.length).toEqual(3);
        expect(buttons[0].textContent).toEqual(inputs[0].text);
        expect(buttons[1].textContent).toEqual(inputs[1].text);
        expect(buttons[1].classList.contains("selected")).toBe(true);
        expect(buttons[2].textContent).toEqual(inputs[2].text);

        buttons[0].click();
        expect(onChange).toHaveBeenCalledWith(groupName, inputs[0].name);
    });

    it("without selected", function () {
        var onChange = jasmine.createSpy();
        var inputs = [
            {
                name: "inputName1",
                text: "inputText1"
            },
            {
                name: "inputName2",
                text: "inputText2"
            },
            {
                name: "inputName3",
                text: "inputText3"
            }
        ];
        var id = "id1";
        var name = "group1";
        var className = "class1";

        ReactDOM.render(re(component.RadioGroup, {onChange: onChange, inputs: inputs, _id: id, name: name, className: className}), document.body);
        expect(document.querySelectorAll("button.radio-button.selected").length).toEqual(0);
    });

    it("disbled", function () {
        var onChange = jasmine.createSpy();
        var inputs = [
            {
                name: "inputName1",
                text: "inputText1"
            },
            {
                name: "inputName2",
                text: "inputText2"
            },
            {
                name: "inputName3",
                text: "inputText3"
            }
        ];
        var id = "id1";
        var name = "group1";
        var className = "class1";

        ReactDOM.render(re(component.RadioGroup, {isDisabled: true, onChange: onChange, inputs: inputs, _id: id, name: name, className: className}), document.body);
        var buttons = document.querySelectorAll("button.radio-button");
        buttons[0].click();
        //disable
        expect(onChange).toHaveBeenCalledTimes(0);
    });
});