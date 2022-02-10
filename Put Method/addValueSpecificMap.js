/* If the ID kept in the map selected based by primary key id satisfies the condition, 
adds the specified value to the list-shaped property in the same map. */

"use strict";
const AWS = require("aws-sdk");

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient();
    
    let responseBody = {
        data: null,
        message: "",
        mapNo: null,
        data2: null,
        message2: "",
    };
    
    let statusCode = 500;
    const  headers = {
        "Content-Type":"application/json" ,
        "access-control-allow-origin": "*"
    }

    const { ID, mapID, Added_Value } = JSON.parse(event.body);
    
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
      responseBody.message = "In cache, system error !"
    }
    
    for(let i = 0 ; i<responseBody.data.length ; i++)
    {
        if(responseBody.data[i].mapID === mapID)
        {
            responseBody.mapNo = i;
            break;
        }
    }
    
    const params2 = {
        TableName: "Table_Name",
        Key: {
            ID
        },
        UpdateExpression: `SET Attiribute_Name[${parseInt(responseBody.mapNo)}].Map_Attiribute_Name = list_append(Attiribute_Name[${parseInt(responseBody.mapNo)}].Map_Attiribute_Name, :vals)`,
        ExpressionAttributeValues: {
            ":vals": Added_Value

        },
        ReturnValues: "ALL_NEW"
    };
    
    try {
        const data2 = await documentClient.update(params2).promise();
	statusCode = 200;
        responseBody.data2 = JSON.stringify(data2);
	responseBody.message2 = "Added value!"; 
    } catch(err) {
	statusCode = 403;
        responseBody.message2 = "Not added value!"; 
    }

    const response = {
        statusCode,
        headers,
        body: JSON.stringify(responseBody.message2)
    };

    return response;
};
