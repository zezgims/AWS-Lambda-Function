/* Gets all the same content from a table, if the entered attribute and the attribute 
in the table are equal it creates a new item in another table. */

"use strict";
const AWS = require("aws-sdk");

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient();
    
    let responseBody = {
        data: null,
        message: "",
        temp: []
    };
    
    let statusCode = 500;
    const  headers = {
        "Content-Type":"application/json" ,
        "access-control-allow-origin": "*"
    }
    
    const { ID, Attiribute_Name, Attiribute_Names } = JSON.parse(event.body);
    
    const params = {
        TableName: "Table_Name"
        ProjectionExpression: "Attiribute_Name"     
    };
    
    const params2 = {
        TableName: "Table_Name2",
        Item: {
            Attiribute_Names
        },
    };
    
    try {
        const data = await documentClient.scan(params).promise();
        if(!data?.Items){
            statusCode = 404;
            responseBody.message = "Table not found!";
        } else {
            statusCode = 200;
            responseBody.temp = data?.Items;
            responseBody.message = "Not problem!";
        }
    } catch (e) {
      responseBody.message = "In cache, system error!";
    }

    for(let j=0 ; j<responseBody.temp.length ; j++)
    {
        if(responseBody.temp[j].Attiribute_Name == Attiribute_Name)
        {
            j = responseBody.temp.length + 1;
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
        else
        {
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
