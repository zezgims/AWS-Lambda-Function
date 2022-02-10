/* Reads attiribute of the item by specific ID in table. */

"use strict";
const AWS = require("aws-sdk");

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient();

    let responseBody = {
        data: null,
        message: ""
    };
    
    let statusCode = 500;
    const  headers = {
        "Content-Type":"application/json",
        "access-control-allow-origin": "*"
    }
   
    if(!event.pathParameters?.ID) {
        statusCode = 401;
        responseBody.message = "Please enter ID";
        return {
            statusCode,
            headers,
            body: JSON.stringify(responseBody)
        };
    }

    const params = {
        TableName: "Table_Name",
        Key: {
            ID: event.pathParameters?.ID,
        }
    };

    try {
        const data = await documentClient.get(params).promise();
        if(!data?.Item){
            statusCode = 404;
            responseBody.message = "Table not found!";
        } else {
            if(!data?.Item?.Attiribute_Name) {
                statusCode = 404;
                responseBody.message = "Attiribute_Name could not found!";
            } else {
                statusCode = 200;
                responseBody.data = data?.Item?.Attiribute_Name;
                responseBody.message = "No problem!";
            }
        }
    } catch (e) {
        responseBody.message = "In cache, system error!"
    }
    
    const response = {
        statusCode,
        headers,
        body: JSON.stringify(responseBody)
    };

    return response;
};
