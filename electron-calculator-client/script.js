window.addEventListener('DOMContentLoaded', function () {
    main()
})

function main() {
    "use strict";

    let input = document.getElementsByClassName('calculator__output')[0], // input/output button
        number = document.getElementsByClassName('calculator__key--number'), // number buttons
        operator = document.getElementsByClassName('calculator__key--operator'), // operator buttons
        result = document.getElementsByClassName('calculator__key--enter')[0], // equal button
        clear = document.getElementsByClassName('calculator__key--ac')[0], // clear button
        resultDisplayed = false; // flag to keep an eye on what output is displayed

    // adding click handlers to number buttons
    for (let i = 0; i < number.length; i++) {
        number[i].addEventListener("click", function (e) {
            // storing current input string and its last character in letiables - used later
            let currentString = input.innerHTML;
            let lastChar = currentString[currentString.length - 1];

            if (input.innerHTML === '0') input.innerHTML = "";

            // if result is not diplayed, just keep adding
            if (resultDisplayed === false) {
                input.innerHTML += e.target.innerHTML;
            } else if (resultDisplayed === true && lastChar === "+" || lastChar === "-" || lastChar === "×" || lastChar === "÷") {
                // if result is currently displayed and user pressed an operator
                // we need to keep on adding to the string for next operation
                resultDisplayed = false;
                input.innerHTML += e.target.innerHTML;
            } else {
                // if result is currently displayed and user pressed a number
                // we need clear the input string and add the new input to start the new opration
                resultDisplayed = false;
                input.innerHTML = "";
                input.innerHTML += e.target.innerHTML;
            }
        });
    }

    // adding click handlers to operator buttons
    for (let i = 0; i < operator.length; i++) {
        operator[i].addEventListener("click", function (e) {

            // storing current input string and its last character in letiables - used later
            let currentString = input.innerHTML;
            let lastChar = currentString[currentString.length - 1];

            // if last character entered is an operator, replace it with the currently pressed one
            if (lastChar === "+" || lastChar === "-" || lastChar === "×" || lastChar === "÷") {
                input.innerHTML = currentString.substring(0, currentString.length - 1) + e.target.innerHTML;
            } else if (currentString.length === 0) {
                // if first key pressed is an opearator, don't do anything
                console.log("enter a number first");
            } else {
                // else just add the operator pressed to the input
                input.innerHTML += e.target.innerHTML;
            }

        });
    }

    // on click of 'equal' button
    result.addEventListener("click", async function () {

        // grpc call
        input.innerHTML = await window.calculator.calculate(input.innerHTML)
        resultDisplayed = true; // turning flag if result is displayed
    });

    // clearing the input on press of clear
    clear.addEventListener("click", function () {
        input.innerHTML = "0";
    })
}