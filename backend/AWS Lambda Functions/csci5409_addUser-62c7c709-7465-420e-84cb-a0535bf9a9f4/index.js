const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

    

exports.handler = async (event) => {
    
    
    let body;
    let statusCode = '200';
    let responseBody = {};
    const headers= {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
            "Content-Type": "application/json"
        };
        
        try {
        const userData = {
            TableName: "Users",
            Item: {...JSON.parse(event.body)}
        }
        
        body = await dynamo.put(userData).promise();
        
     responseBody = {
            success: true,
            message: "User added"
        }
    } catch (err) {
        statusCode = '400';
        responseBody = err.message;
        console.log(err)
    }
    
    
    
    
    const response = {
        statusCode: statusCode,
        body: JSON.stringify(responseBody),
        headers: headers
    };
    return response;
};
