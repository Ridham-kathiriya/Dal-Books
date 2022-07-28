const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    let body;
    let statusCode = '200';
    const headers= {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
            "Content-Type": "application/json"
        }

    try {
        const params = {
            TableName: 'Books',
            Item: JSON.parse(event.body)
        }
            const book = await dynamo.put(params).promise();
        body = {
            success: true,
            message: 'Book updated',
            book:book
        }
    } catch (err) {
        statusCode = '400';
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode:statusCode,
        body:body,
        headers:headers,
    };
};
