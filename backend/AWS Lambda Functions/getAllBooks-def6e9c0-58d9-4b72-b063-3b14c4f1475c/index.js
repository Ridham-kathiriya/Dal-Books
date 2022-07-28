const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    let body;
    let statusCode = 200;
    const headers= {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
            "Content-Type": "application/json"
        }
    try {
        const response = await dynamo.scan({ TableName: 'Books' }).promise();
        body = JSON.stringify({
            success: true,
            response
        })
        
    } catch(error) {
        console.log(error)
        body = JSON.stringify({
           success: false,
           message: "Internal Server Error"
        })
        statusCode = 500
    }
    return ({
        statusCode:statusCode,
        body:body,
        headers:headers
    });
};
