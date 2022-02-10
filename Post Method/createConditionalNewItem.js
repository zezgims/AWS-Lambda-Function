/* Create different attiribute of the item in the table according to the condition. */

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

    const { ID, Attiribute_Names, Diffirent_Attiribute_Names } = JSON.parse(event.body);
    
    const params = {
        TableName: "Table_Name",
        Item: {
            ID,
            Attiribute_Names
        },
    }; 
    
    const params2 = {
        TableName: "Table_Name",
        Item: {
            ID,
            Diffirent_Attiribute_Names
        },
    };
    
    if( Condition )	// ex: userType == "teacher" or userType == "student"
    {
        try {
            const data = await documentClient.put(params).promise();
	          statusCode = 200;
            responseBody.data = JSON.stringify(data);   
            responseBody.message = "Created new item!";
        } catch(err) {
            statusCode = 403;
            responseBody.message = "Not created new item!";
        }
    }
    else
    {   
        try {
            const data = await documentClient.put(params2).promise();
	          statusCode = 200;
            responseBody.data = JSON.stringify(data);
            responseBody.message = "Created new item!";
        } catch(err) {
            statusCode = 403;
            responseBody.message = "Not created new item!";
        }
    }
    
    const response = {
        statusCode,
        headers,
        body: JSON.stringify(responseBody)
    };

    return response;
};
