const AWS = require('aws-sdk') 

const dynamo = new AWS.DynamoDB.DocumentClient() 

exports.handler = async (event, context) => {
    console.log(event)
    let body 
    let statusCode = '200' 
    const headers = {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
    } 

    try {
        // const pathParameters = JSON.parse(event.pathParameters)
        const bookId = event.pathParameters.id 
        const params = {
            TableName: 'Reviews',
            FilterExpression : "contains(#bookId, :bookId)",
    ExpressionAttributeNames: { "#bookId": "bookId"},
    ExpressionAttributeValues: {
        ':bookId':bookId
    }
        }
        const reviews = await dynamo.scan(params).promise() 
        body = {
            success: true,
            data: reviews
        }
    } catch (err) {
        console.log(err)
        statusCode = '400' 
        body = err.message 
    } finally {
        body = JSON.stringify(body) 
    }

    return {
        statusCode,
        body,
        headers,
    } 
} 
