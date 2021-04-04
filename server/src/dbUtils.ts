import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { DynamoDB } from 'aws-sdk';
import { AddThrow, GameData, PlayerStat, Throw } from './interfaces';

const database = new DynamoDB({ region: 'eu-north-1' });
const documentClient = new DocumentClient({ region: 'eu-north-1' });

export async function getGamePlayers(gameid: string): Promise<string[]> {
    let params = {
        TableName: 'mainTable',
        KeyConditionExpression: "#pk = :gameid",
        ExpressionAttributeNames: {
            "#pk": "pk",
        },
        ExpressionAttributeValues: {
            ":gameid": "g#" + gameid
        }
    }

    // TODO: use get instead of query

//    let game = await documentClient.get


    let gameItems = await documentClient.query(params).promise();
    return gameItems.Items[0].Players.values
}

export async function getGameThrows(gameid: string): Promise<Throw[]> {
    let params = {
        TableName: 'mainTable',
        KeyConditionExpression: "#pk = :gameid",
        ExpressionAttributeNames: {
            "#pk": "pk",
        },
        ExpressionAttributeValues: {
            ":gameid": "t#" +gameid
        }
    }
    let throwItems = await documentClient.query(params).promise();

    return throwItems.Items.map( dbitem => ({
            field: dbitem.field,
            multiplier: dbitem.multiplier,
            timestamp: dbitem.sk
        })
    );
}

export async function undoThrow(gameid: string): Promise<void> {
    let params = {
        TableName: 'mainTable',
        KeyConditionExpression: "#pk = :gameid",
        ExpressionAttributeNames: {
            "#pk": "pk",
        },
        Limit: 1,
        ScanIndexForward: false,
        ExpressionAttributeValues: {
            ":gameid": "t#" +gameid
        }
    }
    let throwItems = await documentClient.query(params).promise();
    let theThrow = throwItems.Items[0];
    let deleteparams = {
        TableName: 'mainTable',
        Key: {
            'pk': { S: theThrow.pk },
            'sk': { S: theThrow.sk }
        }
    };

    await database.deleteItem(deleteparams).promise();
}

export async function addThrow(t: AddThrow): Promise<void> {
    let UpdateExpression = "set field = :field, multiplier = :multiplier";
    let ExpressionAttributeValues: any = {
        ":field": { N: t.field.toString() },
        ":multiplier": { N : t.multiplier.toString() }
    };
    let gameId = t.gameid;
    let dateobj = new Date();
    let timestamp = dateobj.toISOString();
    let params = {
        TableName: "mainTable",
        Key: {
            "pk": { S: "t#" + gameId },
            "sk": { S: timestamp }
        },
        UpdateExpression,
        ExpressionAttributeValues,
    };

    await database.updateItem(params).promise();
}

export async function addWebSocketSubscription(connectionId: string, gameId: string): Promise<void> {
    await deleteWebSocketSubscriptions(connectionId); // Delete potential existing subscriptions
    let UpdateExpression = "set gs1pk = :gs1pk, gs1sk = :gs1sk";
    let ExpressionAttributeValues: any = {
        ":gs1pk": { S: "g#" + gameId },
        ":gs1sk": { S: "ws#" + connectionId }
   };
    let dateobj = new Date();
    let timestamp = dateobj.toISOString();
    let params = {
        TableName: "mainTable",
        Key: {
            "pk": { S: "ws#" + connectionId },
            "sk": { S: timestamp }
        },
        UpdateExpression,
        ExpressionAttributeValues,
    };

    await database.updateItem(params).promise();
}

export async function deleteWebSocketSubscriptions(connectionId: string): Promise<void> {
    let params = {
        TableName: 'mainTable',
        KeyConditionExpression: "#pk = :connectionId",
        ExpressionAttributeNames: {
            "#pk": "pk",
        },
        ScanIndexForward: false,
        ExpressionAttributeValues: {
            ":connectionId": "ws#" +connectionId
        }
    }
    let connections = await documentClient.query(params).promise(); // Should only be one connection, in theory, but just to be sure
    let deletions = connections.Items.map(connection => {
        let deleteparams = {
            TableName: 'mainTable',
            Key: {
                'pk': { S: connection.pk },
                'sk': { S: connection.sk }
            }
        };
        console.log("Deleting:",deleteparams);
        return database.deleteItem(deleteparams).promise();        
    });
    await Promise.all(deletions);
}

export async function getGameData(gameid: string) : Promise<GameData> {
    console.log("Gettting data for game id: " + gameid);
    try {
        let gameThrows = await getGameThrows(gameid);
        console.log("gamethrows: ", gameThrows);
        let players = await getGamePlayers(gameid);
        console.log("players: ", players);

        let playerstat:PlayerStat[] = [];
        for(let p in players) {
            playerstat[p] = { player: players[p], score: 501, status: "playing", lastThrows: [] };
        }

        let playernumber = 0;
        let throwsInTurn: Throw[] = [];
        gameThrows.forEach( (t, i) => {
            
            playerstat[playernumber].status = "playing";
            playerstat[playernumber].score -= t.field * t.multiplier;
            throwsInTurn.push(t);
            playerstat[playernumber].lastThrows.push(t);
            let nextTurn = false;
            if (playerstat[playernumber].score < 0) { // BUST¨
                if (i == gameThrows.length - 1) {
                    playerstat[playernumber].status = "bust";
                }
                nextTurn = true;
                throwsInTurn.forEach( (t) => {
                    playerstat[playernumber].score += t.field * t.multiplier;
                })
            }
            if(playerstat[playernumber].score == 0) {
                if (i == gameThrows.length - 1) {      
                    playerstat[playernumber].status = "wonjustnow";
                } else {
                    playerstat[playernumber].status = "haswon";
                }
                nextTurn = true;
            }  
            if(throwsInTurn.length>=3 || nextTurn) {
                throwsInTurn = [];
                playernumber++;
                playernumber%=players.length;
                let skips = 0;
                while(playerstat[playernumber].score==0 && skips <= players.length) { // Skip winners
                    playernumber++;
                    playernumber%=players.length;
                    skips++;
                }
                playerstat[playernumber].lastThrows = [];
            }
        });

        return {
            throws: gameThrows,
            playerstat,
            currentPlayer: players[playernumber],
            throwsInTurn
        };    
    }
    catch (error) {
        console.log("It crashed",error);
        return {
            throws: [],
            playerstat: [],
            currentPlayer: "",
            throwsInTurn: []
        };    
    }
}