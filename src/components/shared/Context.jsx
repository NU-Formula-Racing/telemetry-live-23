import React, { Component } from 'react';

const Context = React.createContext(null);
const ContextConsumer = Context.Consumer;


class ContextProvider extends Component{
  constructor(props) {
    super(props);

    this.state = {
      mouseX: 0,
      mouseY: 0,
      dragging: false,
      sensorData: [], // make object than list
      session: "",
      selectedSensors: [],
      setMouseCoords: (x, y) => {
        this.setState({ mouseX: x, mouseY: y });
      },
      setDragging: (x) => {
        this.setState({ dragging: x });
      },
      setSensorData: (x) => {
        this.setState({sensorData: x})
      },
      setSession: (x) => {
        this.setState({session: x})
      },
      pushSensorStack: (x) => {
        this.setState({ 
          selectedSensors: this.state.selectedSensors.concat([x])
        })
      }
    };
  }

  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export { Context, ContextProvider, ContextConsumer }