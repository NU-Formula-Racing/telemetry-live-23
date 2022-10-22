import boto3

dynamo_client = boto3.client('dynamodb')
data = dynamo_client.scan(
        TableName='SampleSchema'
    )

# the original format that DynamoDB gives us a pretty ugly format,
# a DynamoDB AttributeValue Object. The point of this is to 
# unmarshall it and make front-end's job easier.
# returns: unmarshalled obj
def unmarshall(raw):
    deserializer = boto3.dynamodb.types.TypeDeserializer()
    raw = {k: deserializer.deserialize(v) for k,v in raw.items()}


# this will be called by our flask.app. 
def get_items():
    return data

# for testing purposes
def main():
    print(type(data))
    print(data)

if __name__ == "__main__":
    main()
