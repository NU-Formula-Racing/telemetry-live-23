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
        .then((response) => document.write(json.parse(response)))
        
      }

function getMetadata(){
      fetch("http://127.0.0.1:5000/get-items",
      {
        method: "GET", 
        headers: { 'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': "*",
                  "Access-Control-Allow-Methods": "*" }
      })
      .then((res) => res.json())
      .then((response) => console.log(response))
      
    }