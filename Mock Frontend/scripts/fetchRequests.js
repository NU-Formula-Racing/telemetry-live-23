function getSensorsBySession(sessionName){
    console.log(sessionName);
        fetch("https://yz8fe8q74j.execute-api.us-east-2.amazonaws.com/default/getSession", 
        {
          method: "POST", 
          headers: { 'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*",
                    "Access-Control-Allow-Methods": "*" },
          body: JSON.stringify({'nameOfSession': sessionName})
        })
  
        .then((res) => res.json())
        .then((response) => document.write(json.parse(response)))
        
      }