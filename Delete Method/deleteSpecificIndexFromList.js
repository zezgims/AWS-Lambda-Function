/* Finds the index of the specified value from the list of the item by ID and deletes the value */

"use strict";
const AWS = require("aws-sdk");

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient();

    let responseBody = {
        data: null,
        message: "",
	      data2: null,
        message2: "",
        indexNo :null
    };
    
    let statusCode = 500;
    const  headers = {
        "Content-Type":"application/json" ,
        "access-control-allow-origin": "*"
    }
   
    const { ID, Deleted_Value } = JSON.parse(event.body);

    const params = {
        TableName: "Table_Name",
        Key: {
            ID
        }
    };

    try {
        const data = await documentClient.get(params).promise();
        if(!data?.Item){
            statusCode = 404;
            responseBody.message = "Table not found!";
        } else {
            if(!data2?.Item?.Attiribute_Name) {
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
    
    for(var i = 0 ; i<responseBody.data.length ; i++)
    {
        if(responseBody.data[i] === Deleted_Value)
        {
            responseBody.indexNo = i;
            break;
        }
    }
    
    const params2 = {
        TableName: "Table_Name",
        Key: {
            ID
        },
        UpdateExpression: `REMOVE Attiribute_Name[${parseInt(responseBody.indexNo)}]`,
        ReturnValues: "ALL_NEW"
    };
    
    try {
        const data2 = await documentClient.update(params2).promise();
	      statusCode = 200;
        responseBody.data2 = JSON.stringify(data);
        responseBody.message2 = "Deleted selected value!";
    } catch(err) {
	      statusCode = 403;
        responseBody.message2 = "Not deleted selected value!"; 
    }

    const response = {
        statusCode,
        headers,
        body: JSON.stringify(responseBody.message2)
    };

    return response;
};
