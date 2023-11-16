var button = document.getElementById("converter-button");
var textInput = document.getElementById("converter-input");
var textOutput = document.getElementById("converter-output");
var radioFrom = document.querySelectorAll("input[name='radiogroup-from']");
var radioTo = document.querySelectorAll("input[name='radiogroup-to']");

button.addEventListener('click', convert);

function convert() {
    var input = textInput.value;
    var output = "Output: ";
    var selectedRadioFrom = getSelectedRadio(radioFrom);
    var selectedRadioTo = getSelectedRadio(radioTo);
    
    if (selectedRadioFrom == selectedRadioTo) {
        output += "illegal conversion";
    }
    else if (selectedRadioFrom == "bin") {
        if (!isBinary(input)) {
            output += "number not binary";
        }
        else if (selectedRadioTo == "dec") {
            output += binToDec(input);
        }
        else {
            output += binToHex(input);
        }
    }
    else if (selectedRadioFrom == "dec") {
        if (!isDecimal(input)) {
            output += "number not decimal";
        }
        else if (selectedRadioTo == "bin") {
            output += decToBin(input);
        }
        else {
            output += decToHex(input);
        }
    }
    else if (selectedRadioFrom == "hex") {
        if (!isHex(input)) {
            output += "number not hexadecimal";
        }
        else if (selectedRadioTo == "bin") {
            output += hexToBin(input);
        }
        else {
            output += hexToDec(input);
        }
    }
    
    textOutput.innerHTML = output;
}

function getSelectedRadio(arrayRadio) {
    var selectedRadio;
    for (var i = 0; i < arrayRadio.length; i++) {
        if (arrayRadio[i].checked) {
            selectedRadio = arrayRadio[i].value;
            break;
        }
    }
    
    return selectedRadio;
}

function isBinary(input) {
    for (var i = 0; i < input.length; i++) {
        if (input.charAt(i) != '0' && input.charAt(i) != '1') {
            return false;
        }
    }
    
    return true;
}

function isHex(input) {
    var validChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'A', 'B', 'C', 'D', 'E', 'F'];
    
    for (var i = 0; i < input.length; i++) {
        if (!validChars.includes(input.charAt(i))) {
            return false;
        }
    }
    
    return true;
}

function isDecimal(input) {
    var validChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    
    for (var i = 0; i < input.length; i++) {
        if (!validChars.includes(input.charAt(i))) {
            return false;
        }
    }
    
    return true;
}

function binToDec(input) {
    var result = 0;
    var index = 0;
    
    while (input.length > 0) {
        var lastChar = input.charAt(input.length - 1);
        result += lastChar * (Math.pow(2, index));
        index++;
        input = input.substring(0, input.length - 1);
    }
    
    return result;
}

function binToHex(input) {
    input = binToDec(input);
    
    return decToHex(input);
}

function decToBin(input) {
    var binary = "";
    
    if (input == 0) {
        binary = "0";
        
        return binary;
    }
    
    while (input != 1) {
        if (input % 2 == 0) {
            binary = "0" + binary;
            input /= 2;
        }
        else {
            binary = "1" + binary;
            input = (input - 1) / 2;
        }
    }
    
    binary = "1" + binary;
    
    return binary;
}

function decToHex(input) {
    var hex = "";
    
    if (input == 0) {
        hex = "0";
        
        return hex;
    }
    
    while (input >= 1) {
        var remainder = input % 16;
        
        switch (remainder) {
            case 10:
                hex = "A" + hex;
                break;
            case 11:
                hex = "B" + hex;
                break;
            case 12:
                hex = "C" + hex;
                break;
            case 13:
                hex = "D" + hex;
                break;
            case 14:
                hex = "E" + hex;
                break;
            case 15:
                hex = "F" + hex;
                break;
            default:
                hex = remainder + hex;
        }
        
        input = Math.floor(input /16);
    }
    
    return hex;
}

function hexToBin(input) {
    input = hexToDec(input);
    
    return decToBin(input);
}

function hexToDec(input) {
    var result = 0;
    var index = 0;
    
    while (input.length > 0) {
        var lastChar = input.charAt(input.length - 1);
        var lastCharInt = 0;
        
        switch (lastChar) {
            case 'a':
            case 'A':
                lastCharInt = 10;
                break;
            case 'b':
            case 'B':
                lastCharInt = 11;
                break;
            case 'c':
            case 'C':
                lastCharInt = 12;
                break;
            case 'd':
            case 'D':
                lastCharInt = 13;
                break;
            case 'e':
            case 'E':
                lastCharInt = 14;
                break;
            case 'f':
            case 'F':
                lastCharInt = 15;
                break;
            default:
                lastCharInt = lastChar;
        }
        
        result += (lastCharInt * (Math.pow(16, index)));
        
        index++;
        
        input = input.substring(0, input.length - 1);
    }
    
    return result;
}









