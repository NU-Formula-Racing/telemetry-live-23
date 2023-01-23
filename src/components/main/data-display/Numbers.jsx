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
            });
            };
            retrieveSensorAPI();
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);


  const ExampleSensorsLettersToNames = {
    "Front Left Wheel Speed": ["FL_WHEEL_SPEED", "Speed (m/s)"],
    "Brake Pressure": ["BRAKE_PRESSURE", "Pounds/Square-Inch (PSI)"],
    "HV Battery Voltage": ["HV_BATTERY_VOLTAGE", "Volts (V)"],
    "Battery Temperature": ["BATTERY_TEMP", "Temperature  (°C)"],
    "Coolant Temperature": ["COOLANT_TEMP", "Temperature  (°C)"],
    "Power Output": ["POWER_OUTPUT", "Power (kW)"],
    "State of Charge (SoC)": ["CHARGE_STATE", "Percent (%)"],
    "Throttle": ["THROTTLE", "Percent (%)"],
    "Motor Temperature": ["MOTOR_TEMP", "Temperature (°C)"]
  }
  //context.sensorData[ExampleSensorsLettersToNames[e.value]][context.sensorData[ExampleSensorsLettersToNames[e.value]].length-1][1]}
  function updateSensorValue(sensorName) {
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
              value={updateSensorValue(ExampleSensorsLettersToNames[e.value][0])}
              // value={3}
              percentage={e.id}
              unit={(ExampleSensorsLettersToNames[e.value][1])}
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