import styled from 'styled-components';

import DndFlex from '../../shared/DnDFlex';
import Number from './Number';
import { Context } from "../../shared/Context"
import React, { useCallback, useState, useEffect, useRef, useContext } from 'react'
// renders each second or whatnot
export default function Numbers(props) {
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


  const ExampleSensorsLettersToNames = {
    "Sensor A": "FL_BRAKE_TEMP",
    "Sensor B": "FL_WHEEL_SPEED"
  }
  //context.sensorData[ExampleSensorsLettersToNames[e.value]][context.sensorData[ExampleSensorsLettersToNames[e.value]].length-1][1]}
  function updateSensorValue(sensorName) {
    console.log(context.sensorData[sensorName].length-1)
    return context.sensorData[sensorName][context.sensorData[sensorName].length-1][1]
  }
  return (
    <SemiContext>
      <DndFlex
        //scrollHeight={props.scrollHeight}
        vSpace={12}
        itemWidth={240}
        itemHeight={190}
        items={props.sensors}
        setCurrentItems={(x) => props.setCurrentSensors(x)}
      >
        {props.sensors.map((e, index) => {
          return (
            <Number
              //rerender={() => {props.rerender()}}
              value={updateSensorValue(ExampleSensorsLettersToNames[e.value])}
              // value={3}
              percentage={e.id}
              unit={'m/s'}
              label={e.label}
              key={index}
            />
          );
        })}
      </DndFlex>
    </SemiContext>
  );
}

const SemiContext = styled.div`
  position: relative;
`;