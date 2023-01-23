function getSensorsBySession(sessionName){
    console.log(sessionName);
        fetch("http://flask-env.eba-hqnsx3mt.us-east-2.elasticbeanstalk.com/get-session", 
        {
          method: "POST", 
          headers: { 'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': "*"
        },
          body: JSON.stringify({'nameOfSession': sessionName})
        })
  
        .then((res) => res.json())
        .then((response) => getSessionDisplay(response));
        
      }


      const address = fetch("http://flask-env.eba-hqnsx3mt.us-east-2.elasticbeanstalk.com/get-items",
      {
        method: "GET", 
        headers: { 'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': "*",
                  "Access-Control-Allow-Methods": "*" }
      })
      .then((response) => response.json())
      .then((user) => {
      return user;
      });


function getMetadaDisplay(jsonInput) {
  console.log(JSON.stringify(jsonInput))
  const obj = JSON.parse(JSON.stringify(jsonInput));
  document.getElementById("demo").innerHTML = JSON.stringify(obj);
  return obj

}

function getSessionDisplay(jsonInput) {
  console.log(JSON.stringify(jsonInput))
  const obj = JSON.parse(JSON.stringify(jsonInput));
  document.getElementById("demo").innerHTML = JSON.stringify(obj);
  return obj

}