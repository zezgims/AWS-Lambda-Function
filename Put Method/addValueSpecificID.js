/* Adds the specified value to the list-shaped property of the item by primary key id. */

"use strict";
const AWS = require("aws-sdk");

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient();
    
    let responseBody = {
        data: null,
        message: "",
    };
    
    let statusCode = 500;
    const  headers = {
        "Content-Type":"application/json" ,
        "access-control-allow-origin": "*"
    }

    const { ID, Added_Value } = JSON.parse(event.body);
    
    const params = {
        TableName: "Table_Name",
        Key: {
            ID
        },
        UpdateExpression: "SET #ri = list_append(#ri, :vals)",
        ExpressionAttributeNames: { "#ri": "Attiribute_Name" },
        ExpressionAttributeValues: {
            ":vals": Added_Value,
            
        },
        ReturnValues: "ALL_NEW"
    };

    try {
        const data = await documentClient.update(params).promise();
	statusCode = 200;
        responseBody.data = JSON.stringify(data);
	responseBody.message = "Added value!"; 
    } catch(err) {
        statusCode = 403;
        responseBody.message = "Not added value!"; 
    }

    const response = {
        statusCode,
        headers,
        body: JSON.stringify(responseBody)
    };

    return response;
};
