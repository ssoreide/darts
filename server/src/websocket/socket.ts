import { APIGatewayProxyHandler } from 'aws-lambda';
import { ApiGatewayManagementApi } from 'aws-sdk';
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import 'source-map-support/register';
import * as db from 'src/dbUtils';
import * as settings from '../../../clients/dart-client/src/settings';

const documentClient = new DocumentClient({ region: 'eu-north-1' });

export const socket: APIGatewayProxyHandler = async (event: any, _context:any) => {
    const connectionId = event.requestContext.connectionId;

    if (event.requestContext.eventType === 'CONNECT') {

    } else if (event.requestContext.eventType === 'DISCONNECT') {
        db.deleteWebSocketSubscriptions(connectionId);
    } else if (event.requestContext.eventType === 'MESSAGE') {
        const obj = JSON.parse(event.body);
        if(obj.subscribeToGame) {
            await db.addWebSocketSubscription(connectionId, obj.subscribeToGame);
        }
    }

    return {
        statusCode: 200,
        body: ''
    }
}

export const sendToClients = async (gameId: string) => {
    let params = {
        TableName: 'mainTable',
        IndexName: 'gs1',
        KeyConditionExpression: "#gs1pk = :gameId",
        ExpressionAttributeNames: {
            "#gs1pk": "gs1pk",
        },
        ExpressionAttributeValues: {
            ":gameId": "g#"+gameId
        }
    }
    let gameData = await db.getGameData(gameId);

    const client: ApiGatewayManagementApi = new ApiGatewayManagementApi( {
        apiVersion: '2018-11-29',
        endpoint: settings.wsNotifyEndpoint
    })  

    let connections = await documentClient.query(params).promise();
    connections.Items.forEach(async connection => {
        let connectionId = connection.pk.substring(3);
        try {
            await client.postToConnection( {
                ConnectionId: connectionId,
                Data: JSON.stringify({ updated: gameId, gameData })
            }).promise();
        } catch (err) {
            console.log("Couldn't send to client: " + connectionId);
            console.dir(err);
        }    
    });
}

