const PROTO_PATH = '../proto/CalculatorService.proto';
const PORT = '50051'
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const service = protoDescriptor.CalculatorService;

const server = new grpc.Server()
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (!error) {
        server.start();
        console.log(`gRPC server started at port ${port}`);
    }
    else console.log(`Error ${error} while binding on port ${port}`)
});

server.addService(service.service, {
    calculate(payload, callback) {
        console.log('Request:', payload.request)
        callback(null, {output: calculate(payload.request.input).toString()})
    },
});

function calculate(inputString) {
    // this is the string that we will be processing eg. -10+26+33-56*34/23
    //let inputString = input.innerHTML;

    // forming an array of numbers. e.g. for above string it will be: numbers = ["10", "26", "33", "56", "34", "23"]

    let numbers = inputString.split(/\+|\-|\×|\÷/g);

    // forming an array of operators. for above string it will be: operators = ["+", "+", "-", "*", "/"]
    // first we replace all the numbers and dot with empty string and then split
    let operators = inputString.replace(/[0-9]|\./g, "").split("");

    console.log(inputString);
    console.log(operators);
    console.log(numbers);
    console.log("----------------------------");

    // now we are looping through the array and doing one operation at a time.
    // first divide, then multiply, then subtraction and then addition
    // as we move we are altering the original numbers and operators array
    // the final element remaining in the array will be the output

    let divide = operators.indexOf("÷");
    while (divide !== -1) {
        numbers.splice(divide, 2, numbers[divide] / numbers[divide + 1]);
        operators.splice(divide, 1);
        divide = operators.indexOf("÷");
    }

    let multiply = operators.indexOf("×");
    while (multiply !== -1) {
        numbers.splice(multiply, 2, numbers[multiply] * numbers[multiply + 1]);
        operators.splice(multiply, 1);
        multiply = operators.indexOf("×");
    }

    let subtract = operators.indexOf("-");
    while (subtract !== -1) {
        numbers.splice(subtract, 2, numbers[subtract] - numbers[subtract + 1]);
        operators.splice(subtract, 1);
        subtract = operators.indexOf("-");
    }

    let add = operators.indexOf("+");
    while (add !== -1) {
        // using parseFloat is necessary, otherwise it will result in string concatenation :)
        numbers.splice(add, 2, parseFloat(numbers[add]) + parseFloat(numbers[add + 1]));
        operators.splice(add, 1);
        add = operators.indexOf("+");
    }

    return numbers[0]; // displaying the output
}