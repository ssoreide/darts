import middy from 'middy';
import cors from '@middy/http-cors'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as db from './dbUtils';

export async function getGameData(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

    let gameData = await db.getGameData(event.queryStringParameters['gameid']);

    return {
        statusCode: 200,
        body: JSON.stringify(gameData)
    };
}


export const handler = middy(getGameData).use(cors());