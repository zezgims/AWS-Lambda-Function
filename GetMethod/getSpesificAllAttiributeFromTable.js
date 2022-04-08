/* Reads the same attiribute of all items in table. */

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
        "Content-Type":"application/json" ,
        "access-control-allow-origin": "*"
    }
   
    const params = {
        TableName: "Table_Name"
        ProjectionExpression: "Attiribute_Name"
    };
  
    try {
        const data = await documentClient.scan(params).promise();
        if(!data?.Items){
            statusCode = 404;
            responseBody.message = "Table not found!";
        }
        else{
            statusCode = 200;
            responseBody.data = data?.Items;
            responseBody.message = "Not problem!";
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
