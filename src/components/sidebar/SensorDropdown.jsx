import React, { Component } from 'react';
import Select from 'react-select';
import styled from "styled-components";
import SensorButton from './SensorButton';

import DndList from '../shared/DnDList';

export default class SensorDropdown extends Component {
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
          // REPLACE THIS
          // PART OF SESSION TOBE DYNAMIC
          let reqBody = {"desiredSensors": this.desiredSensors, "nameOfSession": "DriveDay10.7.22"}
          console.log(reqBody)

          // POST request with current sensors selected to use for datpoint plotting later
          const sensorData = fetch("http://127.0.0.1:5000/get-sensors", 
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
          console.log(this.sensorData)
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
    {group:"Safety Sensors", sensors: ["Sensor A", "Sensor B", "Sensor C", "Sensor Q", "Sensor R", "Sensor S", "Sensor T", "Sensor U", "Sensor V"]},
    {group:"Chasis Sensors", sensors: ["Sensor D", "Sensor E", "Sensor F"]},
    {group:"Aero Sensors", sensors: ["Sensor G", "Sensor H", "Sensor I"]},
    {group:"Suspension Sensors", sensors: ["Sensor J", "Sensor K", "Sensor L"]},
    {group:"Powertrain Sensors", sensors: ["Sensor M", "Sensor N", "Sensor O"]}
  ];


let ExampleSensorsLettersToNames = {
  "Sensor A": "FL_BRAKE_TEMP",
  "Sensor B": "FL_WHEEL_SPEED"
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