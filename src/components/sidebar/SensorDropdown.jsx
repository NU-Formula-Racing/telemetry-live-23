import React, { Component } from 'react';
import Select from 'react-select';
import styled from "styled-components";
import SensorButton from './SensorButton';

import { Context} from '../shared/Context';

import DndList from '../shared/DnDList';

export default class SensorDropdown extends Component {
    static contextType = Context;
    constructor(props){
        super(props)
        // all available sensor options
        this.options = ExampleSensorsByGroups.map(e1 => (
            e1.group === this.props.selectedGroup ? e1.sensors.map((e2, i) => ({value: e2, label: e2, id: i})) : []
        )).flat();
        // only sensors selected by user from available options
        this.selected = []
        this.desiredSensors = []
        this.sensorData = []
    }

    componentDidUpdate(prevProps) {                                           
        if (prevProps.selectedGroup !== this.props.selectedGroup) {
            this.updateSelectedGroup(this.props.selectedGroup)
            this.updateOptions(this.props.selectedGroup)
            
        }
    }
    updateSelectedGroup(newSelectedGroup) {
        this.setState({selectedGroup: newSelectedGroup}) 
    }
    updateOptions(newSelectedGroup) {
        this.options = ExampleSensorsByGroups.map(e1 => (
            e1.group === this.props.selectedGroup ? e1.sensors.map((e2, i) => ({value: e2, label: e2, id: i})) : []
        )).flat();
    }

    addSelected(value){
        if (value != null && -1 === this.props.selectedSensors.indexOf(value[0])){
          this.props.setCurrentSensors(this.props.selectedSensors.concat(value))
          let desiredSensor = ExampleSensorsLettersToNames[value[0]["value"]]
          this.desiredSensors.push(desiredSensor)
          this.context.setSelectedSensors(this.desiredSensors)
          // REPLACE THIS
          // PART OF SESSION TOBE DYNAMIC
          let reqBody = {}
          if (this.context.live) {
          reqBody = {"desiredSensors": this.desiredSensors, "nameOfSession": this.context.session}
          }
          else {
            reqBody = {"desiredSensors": this.desiredSensors, "nameOfSession": this.context.session["name"]}
          }
          // console.log(reqBody)

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
          this.sensorData = a;
          this.context.setSensorData(a)
          console.log(this.context.sensorData)
          });
          };
          retrieveSensorAPI();

        }
    }

    clearSelected(e){
      this.props.setCurrentSensors([])
    }

    removeSelected(e){
        let previous = this.props.selectedSensors
        this.props.setCurrentSensors(previous.filter((element) => element.label !== e.target.value))
        this.forceUpdate()
    }

    render() {
        return (
            <>
                <Select
                closeMenuOnSelect={false}
                placeholder={"Select from " + this.props.selectedGroup + "..."}
                isMulti={true}
                options={this.options.filter((element) => (this.props.selectedSensors.every((e) => e.label !== element.label)))}
                value={this.props.selectedGroup}
                onChange={(e) => this.addSelected(e)}
                styles={{
                    multiValueLabel: (base) => ({
                      ...base,
                      width:'100px',
                      'font-size':'16px'
                    }),
                  }}
                />
                <SmallVertSpace/>
                {this.props.selectedSensors.length !== 0 &&  <StyledButton onClick={e => this.clearSelected()}>Clear All</StyledButton>}
                <DndList
                  vspace={5}
                  items={this.props.selectedSensors}
                  setCurrentItems={(x) => this.props.setCurrentSensors(x)}
                >
                  {this.props.selectedSensors.map((e, i) => (
                    <SensorButton 
                      key={i}
                      onClick={this.removeSelected} 
                      label={e.label} 
                      selectedSensors={this.props.selectedSensors} 
                      setCurrentSensors={this.props.setCurrentSensors}
                    />
                  ))}
                </DndList>
            </>
        )
    }
}

//{this.selected.map((x) => (<p>{x.label}</p>))}
let ExampleSensorsByGroups = [
    {group:"Safety Sensors", sensors: ["Front Left Wheel Speed", "Brake Pressure", "HV Battery Voltage", "Battery Temperature", "Coolant Temperature", "Power Output", "State of Charge (SoC)", "Throttle", "Motor Temperature"]},
    {group:"Chassis Sensors", sensors: ["Sensor Q", "Sensor R", "Sensor F"]},
    {group:"Aero Sensors", sensors: ["Sensor G", "Sensor H", "Sensor I"]},
    {group:"Suspension Sensors", sensors: ["Sensor J", "Sensor K", "Sensor L"]},
    {group:"Powertrain Sensors", sensors: ["Sensor M", "Sensor N", "Sensor O"]}
  ];


let ExampleSensorsLettersToNames = {
  "Front Left Wheel Speed": "FL_WHEEL_SPEED", 
  "Brake Pressure": "BRAKE_PRESSURE",
  "HV Battery Voltage": "HV_BATTERY_VOLTAGE", 
  "Battery Temperature": "BATTERY_TEMP",
  "Coolant Temperature": "COOLANT_TEMP", 
  "Power Output": "POWER_OUTPUT", 
  "State of Charge (SoC)": "CHARGE_STATE",
  "Throttle": "THROTTLE", 
  "Motor Temperature": "MOTOR_TEMP", 
}


let StyledButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  cursor: pointer;
  border: 0px;
  background-color: white;
`
let SmallVertSpace = styled.div`
  height: 10px;
`