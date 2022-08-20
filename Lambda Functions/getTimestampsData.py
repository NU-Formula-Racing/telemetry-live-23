import json
import boto3
from boto3.dynamodb.conditions import Key

def lambda_handler(event, context):
    # TODO implement
    client = boto3.resource("dynamodb")
    table = client.Table("SampleSchema")
    # an array consisting of strings (i.e., "Sensor1", "Sensor2", etc.)
    desiredSensors = event["desiredSensors"]
    # extract values of sensors from desired session
    # the desired timeframe (two elements: start & end)
    times = event["Times"]
    # extract start and finish times
    start, finish = times[0], times[1]
    response = table.get_item(
        Key={
            "Session Name": event["nameOfSession"]
            }
        )
    # attribs consists of a json that contains all desired session's data
    attribs = (response["Item"])
    # parse attribs 
    res = {}
    # output sensor data in an array
    for key in attribs.keys():
        # add key, value 
        if "Sensor" in key:
            # each sensor consists of a list of lists, each containing a
            # time (string), and a value (int)
            # return the value with the most recent time (largest time)
            res[key] = getTimevalsInFrame(attribs[key], start, finish)
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Credentials': 'true',
            'Content-Type': 'application/json',
            "Access-Control-Allow-Methods": "GET, POST, PUT"
        },
        'body': res
    }
    
# given a timeframe, return a list of time/val pairs that fit
# within a given timeframe
def getTimevalsInFrame(timeVals, start, finish):
    # iterate through sensor's entire timeVals and append to res if 
    # time fits in desired interval
    res = []
    start, finish = standardToSeconds(start), standardToSeconds(finish)
    for timeVal in timeVals:
        timeValParsed = standardToSeconds(timeVal[0])
        if timeValParsed >= start and timeValParsed <= finish:
            res.append(timeVal)
    return res
            
        

# translate from 0:00 time form to seconds
def standardToSeconds(standardTime):
    return int(standardTime.split(":")[0])*60+int(standardTime.split(":")[1])