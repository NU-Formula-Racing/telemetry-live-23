import boto3
import json
from boto3.dynamodb.conditions import Key

dynamo_client = boto3.client('dynamodb')

def get_items():
    return dynamo_client.scan(
        TableName='SampleSchema'
    )

def get_session(req_json):

    # TODO implement
    client = boto3.resource("dynamodb")
    table = client.Table("SampleSchema")
    print(req_json)
    # event is replicating the entire json of that specific table
    event = dynamo_client.scan(
        TableName='SampleSchema'
    )
    response = table.get_item(
        Key=req_json
        )
    print(response)
    attribs = (response["Item"])
    # parse attribs
    res = {}
    # output sensor data in an array
    for key in attribs.keys():
        # add key, value
        if "Sensor" in key:
            res[key] = attribs[key]

    return {"isBase64Encoded": "false",
    'statusCode': 200,
    'headers': {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': "*"
        },
    "body": res
        }