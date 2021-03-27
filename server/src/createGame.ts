import middy from 'middy';
import { cors } from 'middy/middlewares';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const database = new DynamoDB({ region: 'eu-north-1' });
const documentClient = new DocumentClient({ region: 'eu-north-1' });

export async function createGame(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    let body = JSON.parse(event.body);
    let UpdateExpression = "set Players = :Players";
    let ExpressionAttributeValues: any = {
        ":Players": { SS: body.players }
    };
    //generate random gameid
    //NOTE: doesnt check for colissions
    let gameId = "";
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';  
    for ( var i = 0; i < 4; i++ ) {
       gameId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    //gameid generated
    let params = {
        TableName: "mainTable",
        Key: {
            "pk": { S: "g#" + gameId },
            "sk": { S: "g#" + gameId }
        },
        UpdateExpression,
        ExpressionAttributeValues,
    };

    try {
        await database.updateItem(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({gameid: gameId})
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify(err)
        }
    }
}

export const handler = middy(createGame).use(cors());