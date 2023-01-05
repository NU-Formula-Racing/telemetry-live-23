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
      // console.log(context.selectedSensors);
                  let reqBody = {"desiredSensors": context.selectedSensors, "nameOfSession": context.session}
            // console.log(reqBody)
    
            // POST request with current sensors selected to use for datpoint plotting later
            var sensorData = fetch("http://127.0.0.1:5000/get-sensors", 
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
            console.log(context.sensorData)
            });
            };
            retrieveSensorAPI();
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

            /********************** API UPDATE **************/

            // let reqBody = {"desiredSensors": context.selectedSensors, "nameOfSession": context.session["name"]}
            // // console.log(reqBody)
    
            // // POST request with current sensors selected to use for datpoint plotting later
            // var sensorData = fetch("http://127.0.0.1:5000/get-sensors", 
            // {
            //   method: "POST", 
            //   headers: { 'Content-Type': 'application/json',
            //   'Access-Control-Allow-Origin': "*"
            // },
            // body: JSON.stringify(reqBody)
            // })
            // .then((response) => response.json())
            // .then((user) => {
            // return user;
            // });
    
            // const retrieveSensorAPI = () => {
            // sensorData.then((a) => {
            // context.setSensorData(a)
            // console.log(context.sensorData)
            // });
            // };
            // retrieveSensorAPI();
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

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