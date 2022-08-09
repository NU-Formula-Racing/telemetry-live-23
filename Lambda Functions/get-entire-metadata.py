import json
import boto3


dynamodb = boto3.resource('dynamodb')

# displays entire data stored as json in "Playlist" table in DynamoDB
def lambda_handler(event, context):
    table = dynamodb.Table('Playlist')
    body = table.scan()
    items = body['Items']
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Credentials': 'true',
            'Content-Type': 'application/json'
        },
        'body': json.dumps(items)
    }