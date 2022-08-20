import json
import boto3
    
def lambda_handler(event, context):
    # TODO implement
    
    
    dynamodb = boto3.resource('dynamodb')
    
    table = dynamodb.Table('SampleSchema')
    
    response = table.scan()
    data = response['Items']
    
    return {
        'statusCode': 200,
        'body': json.loads(json.dumps(data, default=str))
    }
