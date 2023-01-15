// Preload script
const {contextBridge} = require('electron')
const PROTO_PATH = '../proto/CalculatorService.proto';
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

let mathService = new protoDescriptor.CalculatorService('localhost:50051',
    grpc.credentials.createInsecure());

contextBridge.exposeInMainWorld('calculator',
    {
        calculate: async (input) => {
            return new Promise(resolve => {
                mathService.calculate({input: input}, (error, {output}) => {
                    resolve(output)
                })
            });
        },
    }
)
