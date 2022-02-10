/* If the ID kept in the map selected based by primary key id satisfies the condition, it finds the index of the specified value of the list property 
in the same map and deletes it. */

"use strict";
const AWS = require("aws-sdk");

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient();
    
    let responseBody = {
        data: null,
        message: "",
        indexNo: null,
        mapNo: null,
	data2: null,
        message2: ""
    };
     
    let statusCode = 500;
    const  headers = {
        "Content-Type":"application/json" ,
        "access-control-allow-origin": "*"
    }
    
    const { ID, mapID, Deleted_Value } = JSON.parse(event.body);

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
    
    for(var i = 0 ; i<responseBody.data.length ; i++)
    {
        if(responseBody.data[i].mapID === mapID)
        {
            responseBody.mapNo = i;
            break;
        }
    }
    
    for(var j = 0 ; j<responseBody.data[responseBody.mapNo].Map_Attiribute_Name.length ; j++)
    {
        if(responseBody.data[responseBody.mapNo].Map_Attiribute_Name[j] === Deleted_Value)
        {
            responseBody.indexNo = j;
            break;
        }
    }
    
    const params2 = {
        TableName: "Table_Name",
        Key: {
            ID
        },
        UpdateExpression: `REMOVE Attiribute_Name[${parseInt(responseBody.mapNo)}].Map_Attiribute_Name[${parseInt(responseBody.indexNo)}]`,
        ReturnValues: "ALL_NEW"
    };
    
    try {
        const data2 = await documentClient.update(params2).promise();
	statusCode = 200;
        responseBody.data2 = JSON.stringify(data2);
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
