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
      fetch("https://www.google.com/url?q=https://en2mwj3aze.execute-api.us-east-2.amazonaws.com/getMetadata&sa=D&source=docs&ust=1661181160731536&usg=AOvVaw39DbLEa5I_H_NGeSdAr2h1",
      {
        method: "POST", 
        headers: { 'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': "*",
                  "Access-Control-Allow-Methods": "*" }
      })
      .then((res) => res.json())
      .then((response) => document.write(json.parse(response)))
      
    }