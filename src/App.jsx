import { Component } from 'react';
import { createGlobalStyle } from 'styled-components';

import Sidebar from './components/sidebar/Sidebar';
import Main from './components/main/Main';

import React, { useCallback, useState, useEffect, useRef, useContext } from 'react'

import { Context } from './components/shared/Context';

export default class App extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    this.state = {
      isLive: false,
      currentSensors: [],
      sessionName: ''
    }
  }
  updateContextLive() {
    this.context.setIsLive(this.state.isLive)
    // console.log(this.context.session)
  }
  componentDidMount() {
    // every second, update the context's live to the current this.state.isLIve value for later
    const intervalId = setInterval(() => {
      this.updateContextLive()
    }, 1000);
  }

  handleMouseDown = (e) => {
    this.context.setMouseCoords(e.clientX, e.clientY);
    this.context.setDragging(true);
  }

  handleMouseUp = (e) => {
    this.context.setMouseCoords(e.clientX, e.clientY);
    this.context.setDragging(false);
  }


  render() {
    return (
      <div onMouseDown={(e) => {this.handleMouseDown(e)}} onMouseUp={(e) => {this.handleMouseUp(e)}}>
        <GlobalStyle />
        <Sidebar
          isLive={this.state.isLive}
          setIsLive={(next) => this.setState({ isLive: next })}
          currentSensors={this.state.currentSensors}
          setCurrentSensors={(newState) => this.setState({ currentSensors: newState })}
          setSessionName={(newState) => this.setState({ sessionName: newState })}
          setSocketURL={(url) => this.setState({ socketURL: `ws://${url}:443` }, () => {
            if (url) {
              this.updateSocket();
            }
          })}
          connected={this.state.connected}
        />
        <Main
          isLive={this.state.isLive}
          currentSensors={this.state.currentSensors}
          setCurrentSensors={(newState) => this.setState({ currentSensors: newState })}
        />
      </div>
    );
  }
}

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Open Sans', sans-serif;
  }
`;