import { Context } from "../../shared/Context"
import React, { useCallback, useState, useEffect, useRef, useContext } from 'react'

import SVGButton from './SVGButton';
import RowHolder from '../../shared/RowHolder';
import HorizSpacer from '../../shared/HorizSpacer';

import stop from '../../../assets/stop.svg';
import play from '../../../assets/play.svg';
import pause from '../../../assets/pause.svg';

export default function Topbar(props) {
  let context = useContext(Context);
  function changeLiveStatus(buttonState) {
    if (buttonState == "play"){
      context.setIsLive = true
    }
    else if (buttonState == "pause" || buttonState == "stop") {
      context.setIsLive = false
    }
  }
  return (
    <RowHolder>
      <SVGButton
        src={stop}
        label={'stop'}
        setViewState={props.setViewState}
        selected={props.viewState === 'stop'}
      />
      <HorizSpacer />
      {props.viewState !== 'play'
        ? <SVGButton
            src={play}
            label={'play'}
            setViewState={props.setViewState}
            selected={props.viewState === 'pause'}
          />
        : <SVGButton
            src={pause}
            label={'pause'}
            setViewState={props.setViewState}
            selected={props.viewState === 'play,'}
          />
      }
    </RowHolder>
  );
}
