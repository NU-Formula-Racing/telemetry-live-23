import Graph from './Graph';
import DndList from '../../shared/DnDList';
import VertSpacer from '../../shared/VertSpacer';
import React, { useCallback, useState, useEffect, useRef, useContext } from 'react'
import { Context } from '../../shared/Context';

export default function Graphs(props) {
  let context = useContext(Context);
 // IF LIVE IS ON, THEN FEED TO API
    useEffect(() => {
    const interval = setInterval(() => {
      if (context.live && context.session) {
                  let reqBody = {"desiredSensors": context.selectedSensors, "nameOfSession": context.session}
    
            // POST request with current sensors selected to use for datpoint plotting later
            var sensorData = fetch("http://flask-env.eba-hqnsx3mt.us-east-2.elasticbeanstalk.com/get-sensors", 
            {
              method: "POST", 
              headers: { 'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': "*"
            },
            body: JSON.stringify(reqBody)
            })
            .then((response) => response.json())
            .then((user) => {
            return user;
            });
    
            const retrieveSensorAPI = () => {
            sensorData.then((a) => {
            context.setSensorData(a)
            console.log(a)
            });
            };
            retrieveSensorAPI();
      }
    }, 200);
    // return () => clearInterval(interval);
  }, []);

  return (
    <DndList
      items={props.sensors}
      vspace={7}
      setCurrentItems={(x) => props.setCurrentSensors(x)}
    >
      {props.sensors.map((e, index) => {
        return (
          <Graph
            width={props.width}
            sensorName={e.label}
            key={index}
            rerender={() => {props.rerender()}}
          />
        );
      })}
    </DndList>
  );
}