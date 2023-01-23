function getSensorsBySession(sessionName){
    console.log(sessionName);
        fetch("https://cryptic-headland-94862.herokuapp.com/https://xrqk31hi4e.execute-api.us-east-2.amazonaws.com/default/getSession", 
        {
          method: "POST", 
          headers: { 'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': "*"
        },
          body: JSON.stringify({'nameOfSession': sessionName})
        })
  
        .then((res) => res.json())
        .then((response) => console.log(response))
        
      }

const p = document.getElementById("myPelement")
function getMetadata(){
      fetch("http://flask-env.eba-hqnsx3mt.us-east-2.elasticbeanstalk.com/get-items",
      {
        method: "GET", 
        headers: { 'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': "*",
                  "Access-Control-Allow-Methods": "*" }
      })
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        console.log(response)
        p.innerText = JSON.stringify(response.Items[0].Sensor1)
    });
    
    }