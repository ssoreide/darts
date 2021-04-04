import middy from 'middy';
import cors from '@middy/http-cors'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { addThrow } from './dbUtils';
import { sendToClients } from './websocket/socket';

export async function insertThrow(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    let body = JSON.parse(event.body);
    await addThrow({...body});
    console.log("Insert");
    sendToClients(body.gameid);
    return {
        statusCode: 200,
        body: JSON.stringify({msg: "throw registered!"})
    };
}

export const handler = middy(insertThrow).use(cors());