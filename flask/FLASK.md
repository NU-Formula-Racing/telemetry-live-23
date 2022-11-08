# Flask

## What is this?
We're using Flask to create a RESTful API that we're using to get data from our AWS DynamoDB database. 

So far this is only set up for a backend hosted on a localserver, and it's only configured for GET requests. More to come later. 

Also I'm assuming you have some variety of Linux CLI (bash/zsh/fish)

## Dependencies
**Python3** (for running the virtual env)
Run
```
python3 --version
```
If a version comes up, you're good. Otherwise, download the lastest python3 version. 

**Pip** (for installing packages in the venv)

**Flask** (yeah....)

**AWS CLI**

If you've not used AWS CLI before, run this command (on mac).

```
brew install awscli
```

Then configure it. Get the CSV of our access keys from Erin or Isaac (dm on slack if needed).
```
aws configure
AWS Access Key ID: [access key]
```
```
AWS Secret Access Key: [secret access key]
Default region name: us-east-2
Default output format: json
```

## How to run ?
Make sure you are in the right repo (telemetry-23). Flask-related materials are all in ~/flask.

```
python3 -m venv env 
source env/bin/activate
```

Also, to install dependencies run the following line: 
You need to run this in the virtual environment (venv).


```
pip install flask pip install boto3 pip install flask-cors
```

Export the environment variable to show where the flask-app is. You don't have to do this again I believe.  
```
export FLASK_APP=flask/app.py
``` 

Ok. Now run flask.
```
flask run
```

If it's working, it should look something like this. 

```
env ❯ flask run                          
 * Serving Flask app 'app.py'
 * Debug mode: off
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
127.0.0.1 - - [03/Oct/2022 20:12:43] "OPTIONS /get-items HTTP/1.1" 200 -
```

If you want to check backend, go to the url provided and add /get-items to the end, i.e. http://127.0.0.1:5000/get-items
That's the GET request. 

If that's all working, it's time to run front-end. It's in ~/Mock Frontend/templates/index.html
Open that in a browser(that is not safari. It works in Chrome/Firefox). There are buttons that you can test now. 

To test, inspect element and look at the console. Click the get-items button and see if it prints out a json. 
NOTE: this only works at this stage of testing. This will be outdated very fast, ideally. 
If it gives you a CORS problem, check troubleshooting section. 

To exit the virtual environment, run `deactivate`. in the env.

## Troubleshooting
If you get a CORS error, check if you installed flask-cors in pip, or if it's in the file you're running, etc. 

How to check:
While you're running the venv, run this:
```
pip show flask-cors
```
If it shows that the package exists, that's good. Otherwise, run `pip install flask-cors` in the venv.

## Source
[This](https://medium.com/hackernoon/using-aws-dynamodb-with-flask-9086c541e001) explains it better but I've mostly written this so we just have the commands in one place.

TODO: finish writing this