# run .\Flask\Scripts\activate first
from flask import Flask, jsonify
import json
from flask_cors import CORS
import aws_controller
from dynamodb_json import json_util as json
from flask import request
import boto3
from boto3.dynamodb.conditions import Key

app = Flask(__name__)
CORS(app)

TABLE_NAME = "SampleSchema"

# Creating the DynamoDB Client
dynamodb_client = boto3.client('dynamodb', region_name="us-east-2")

# Creating the DynamoDB Table Resource
dynamodb = boto3.resource('dynamodb', region_name="us-east-2")
table = dynamodb.Table(TABLE_NAME)

@app.route('/')
def index():
    return "This is the main page."


@app.route('/get-items')
def get_items():
    return jsonify(json.loads(aws_controller.get_items()))


@app.route('/get-session', methods=['POST'])
def get_session():
    nameOfSession = json.loads(request.json)["nameOfSession"]
    # nameOfSession = int(json.loads(request.json)["nameOfSession"].replace("Session", "")) - 1
    # # return nameOfSession
    # return jsonify(json.loads(aws_controller.get_items())["Items"][nameOfSession])
    response = dynamodb_client.get_item(
        TableName=TABLE_NAME,
        Key={
            "Session Name": {"S": nameOfSession}
        })
    return(json.loads(response['Item']))

@app.route('/get-sensors', methods=['POST'])
def get_sensors():
    # return json.loads(request.json)
    nameOfSession = json.loads(request.json)["nameOfSession"]
    desiredSensors = list(json.loads(request.json)["desiredSensors"])
    # nameOfSession = int(json.loads(request.json)["nameOfSession"].replace("Session", "")) - 1
    # # return nameOfSession
    # return jsonify(json.loads(aws_controller.get_items())["Items"][nameOfSession])
    response = dynamodb_client.get_item(
        TableName=TABLE_NAME,
        Key={
            "Session Name": {"S": nameOfSession}
        })

    # attribs consists of a json that contains all desired session's data
    # json loads always eliminates the unecessary type keys
    attribs = (json.loads(response['Item']))
    # parse attribs
    res = {}
    # output sensor data in an array
    for key in attribs.keys():
        # add key, value
        if key in desiredSensors:
            # each sensor consists of a list of lists, each containing a
            # time (string), and a value (int)
            # return the value with the most recent time (largest time)
            curr = []
            for timeval in attribs[key]:
                curr.append(timeval)
            res[key] = curr
    return json.loads(res)



if __name__ == '__main__':
    app.run()

