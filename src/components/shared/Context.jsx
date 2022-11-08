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
      live: false,
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
      setSelectedSensors: (x) => {
        this.setState({selectedSensors: x})
      },
      setIsLive: (x) => {
        this.setState({ live: x });
      },
    };
  }
  myFunction = () => {
    this.props.updateItem(this.state)
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