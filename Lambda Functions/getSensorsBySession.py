# api endpoint
# https://yz8fe8q74j.execute-api.us-east-2.amazonaws.com/default/getSession
 
import json
import boto3
from boto3.dynamodb.conditions import Key
 
def lambda_handler(event, context):

    # specify what database
    client = boto3.resource("dynamodb")
    table = client.Table("SampleSchema")
   
   # select desired session from database
    response = table.get_item(
        Key={
            "Session Name": event["nameOfSession"]
        }
    )
    print(response)
    attribs = (response["Item"])
    # parse attribs
    res = {}
    # output sensor data of selected database
    for key in attribs.keys():
        # add key, value
        if "Sensor" in key:
            res[key] = attribs[key]
    return res
