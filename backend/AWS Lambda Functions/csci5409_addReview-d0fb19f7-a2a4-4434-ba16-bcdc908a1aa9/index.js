const AWS = require('aws-sdk');
const Comprehend = new AWS.Comprehend();
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
          "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
    };

    try {
        let review = JSON.parse(event.body);
        console.log(review)
        const sentimentParams = {
            Text: review.review,
            LanguageCode: 'en'
        }
        
        const analysis = await Comprehend.detectSentiment(sentimentParams).promise();
        const sentiment = analysis.Sentiment;
        const reviewParams = {
            TableName: "Reviews",
            Item: {...review, sentiment}
        }
        body = await dynamo.put(reviewParams).promise();
    } catch (err) {
        statusCode = '400';
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode:statusCode,
        body:body,
        headers:headers
    };
};