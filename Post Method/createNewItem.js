/* Create New Item in table. */

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

    const { ID, Attiribute_Names } = JSON.parse(event.body);
    
    const params = {
        TableName: "Table_Name",
        Item: {
            ID,
            Attiribute_Names
        },
    };
    
    try {
        const data = await documentClient.put(params).promise();
	statusCode = 200;
        responseBody.data = JSON.stringify(data);
	responseBody.message = "Created new item!";
    } catch(err) {
	statusCode = 403;
        responseBody.message = "Not created new item!";
    }
    
    const response = {
        statusCode,
        headers,
        body: JSON.stringify(responseBody)
    };
    
    return response;
};
