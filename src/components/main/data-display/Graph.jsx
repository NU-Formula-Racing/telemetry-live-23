import React, { useCallback, useState, useEffect, useRef, useContext } from 'react'
import { max, bisector } from 'd3-array';
import { MarkerCircle } from '@visx/marker';
import { useTooltip } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { Group } from '@visx/group';
import { LinePath, Bar, Line, AreaClosed } from '@visx/shape';
import * as allCurves from '@visx/curve';
import { scaleLinear } from '@visx/scale';
import { AxisLeft, AxisBottom } from '@visx/axis';
import styled from "styled-components";
import scrollleft from '../../../assets/scrollleft.svg';
import scrollright from '../../../assets/scrollright.svg';
import zoomin from '../../../assets/zoomin.svg';
import zoomout from '../../../assets/zoomout.svg';
import recent from '../../../assets/recent.svg';
import { GridRows, GridColumns } from '@visx/grid';
import { TooltipWithBounds } from '@visx/tooltip';
import { Context} from "../../shared/Context"



/*****************  INIT (but its british??)  ****************/
const n = 20; // amount of seconds to show
let initData = initialise(); //data arr
function initialise() {
    var time = -1;
    var arr = [];
    var data_length = 1;
    for (var i = 0; i < data_length; i++) {
        var obj = {
            time: ++time,
            // value: Math.floor(Math.random() * 100)
            value: 0
        };
        arr.push(obj);
    }
    return arr;
}



// CONTINUOUSLY CALL API TO UPDATE REACT ON CHANGES IN

export default function Graph(props) {
    let context = useContext(Context);
    /*****************  CONSTANTS  ****************/
    const height = 300
    const width = props.width > 500 ? props.width * 0.9 : 450
    const graph_offset = 30
    const curveType = 'curveLinear'
    // data accessors
    const getX = (d) => d.time;
    const getY = (d) => d.value;
    const ExampleSensorsLettersToNames = {
        "Front Left Wheel Speed": ["FL_WHEEL_SPEED", "Speed (m/s)"],
        "Brake Pressure": ["BRAKE_PRESSURE", "Pounds/Square-Inch (PSI)"],
        "HV Battery Voltage": ["HV_BATTERY_VOLTAGE", "Volts (V)"],
        "Battery Temperature": ["BATTERY_TEMP", "Temperature (°C)"],
        "Coolant Temperature": ["COOLANT_TEMP", "Temperature (°C)"],
        "Power Output": ["POWER_OUTPUT", "Power (kW)"],
        "State of Charge (SoC)": ["CHARGE_STATE", "Percent (%)"],
        "Throttle": ["THROTTLE", "Percent (%)"],
        "Motor Temperature": ["MOTOR_TEMP", "Temperature (°C)"]
      }
    // scales

    let xScaleInit = scaleLinear({
        domain: [0, max(initData, getX)],
        range: [0, width - 3*graph_offset]
    });
    let yScaleInit = scaleLinear({
        domain: [0, max(initData, getY) * 1.2],
        range: [height * 0.85, height * 0.1]
    });
    
    // state variables
    const [graphData, setGD] = useState({lineData: initData, xScale: xScaleInit, yScale: yScaleInit, start:0, end:initData.length-1});
    const [isScrolling, setScrolling] = useState(false)
    const wheelTimeout = useRef()
    const buttonRef = useRef(null)
    const [count, setCount] = useState(0)
    const [clickCount, setClickCount] = useState(100)
    const [orient, setOrient] = useState(0)
    var historical_count = 0
    
    /*****************  UPDATERS  ****************/
    // automate the clicking (or updating) of the live graph

    //autopopulate the graph during live

    useEffect(() => {
        let graphsArr = document.getElementsByClassName("clickMe")
          if (context.live) {
            for (let i = 0; i < graphsArr.length; i++) {
                graphsArr[i].click();
              }
          }
      }, [context.sensorData]);

    // historical autopopulate
    //   useEffect(() => {
    //     const interval = setInterval(() => {
    //     let graphsArr = document.getElementsByClassName("clickMe")
    //     setClickCount(clickCount+1)
    //       if (!context.live && count < clickCount) {
    //         for (let i = 0; i < graphsArr.length; i++) {
    //             graphsArr[i].click();
    //           }
    //       }
    //     }, 1000);
    //     return () => clearInterval(interval);
    //   }, []);


      /***************** UPDATES **********************/

    function updateScales(){
        let start_idx = Math.floor(graphData.start)
        let fake_idx = max([Math.ceil(graphData.end)-1, 0])
        let end_idx = max([Math.ceil(graphData.end), 0])
        let xscale = scaleLinear({
            domain: [getX(graphData.lineData[start_idx]), getX(graphData.lineData[fake_idx])],
            range: [0, width - 3*graph_offset]
        });
        let yscale = scaleLinear({
            domain: [0, max(graphData.lineData.slice(start_idx, end_idx), getY) * 1.2],
            range: [height * 0.85, height * 0.1]
        })
        setGD(prevState => ({
            ...prevState,
            xScale: xscale,
            yScale: yscale
        }));
    }

    // function parseTimeInt(timeStr){
    //     let timeArr = timeStr.split(":")
    //     return parseInt(timeArr[0])*60+parseInt(timeArr[1])
    // }

    function parseUnixToStr(unixVal) {
        let unix_timestamp = unixVal
        // Create a new JavaScript Date object based on the timestamp
        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
        var date = new Date(unix_timestamp * 1000);
        // Hours part from the timestamp
        var hours = date.getHours();
        // Minutes part from the timestamp
        var minutes = "0" + date.getMinutes();
        // Seconds part from the timestamp
        var seconds = "0" + date.getSeconds();

        // Will display time in 10:30:23 format
        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        return formattedTime
    }

    function parseSecToTime(seconds) {
        var hours = parseInt(Math.floor(seconds / 3600))
        var minutes = parseInt(Math.floor((seconds % 3600) / 60))
        var cleanSeconds = parseInt((seconds % 3600) % 60)
        const milDiff = seconds-parseInt(seconds)
        var milliseconds = 10*(Math.round(1000*milDiff)/1000);
        return hours + ":" + minutes + ":" + cleanSeconds + "." + milliseconds

    }

    function updateData(gd, e) {

        let sensorArr = context.sensorData[ExampleSensorsLettersToNames[props.sensorName][0]]
        // setClickCount(sensorArr.length)
        if (sensorArr) {
            // setCount(sensorArr.length-1)
        if (count < sensorArr.length-1) {
            setCount(count + 1)
            setOrient(count+1)
        }
        var tvPair = sensorArr[sensorArr.length-1]
        if (count >= sensorArr.length) {
            if (sensorArr !== []) {
                let tvPair = context.sensorData[ExampleSensorsLettersToNames[props.sensorName]][sensorArr.length-1[0]]
            }
        }
        else{
            tvPair = context.sensorData[ExampleSensorsLettersToNames[props.sensorName][0]][count]
        }
        if (count >= sensorArr.length-1) {
            return
        }
        let start = gd.start
        if (gd.end >= n) { // overloaded data
            start = gd.start + 1;
        }
        let end = gd.end + 1;
        var firstTime =  context.sensorData[ExampleSensorsLettersToNames[props.sensorName][0]][0][0]

        var currTime = parseUnixToStr(tvPair[0])
        var obj = {
            time: tvPair[0]-firstTime,
            value: tvPair[1]
        };

        let temp = [...gd.lineData];
        temp.push(obj);
        if (isScrolling){
            setGD(prevState => ({
                ...prevState,
                lineData: temp,
              }));
              setScrolling(!isScrolling)
        } else {
            setGD(prevState => ({
                ...prevState,
                lineData: temp,
                start: start,
                end: end
              }));
        }
        handleTooltip(e);
    }
    }


    /*****************  MOUSE AND KEY SHITSHOW  ****************/
    function lockWheel(){
        // while wheel is moving, do not release the lock
        clearTimeout(wheelTimeout.current)

        // flag indicating to lock page scrolling (setTimeout returns a number)
        wheelTimeout.current = setTimeout(() => {
        wheelTimeout.current = false
        }, 300)
    }

    function handleMouseScroll(e){
        let gd = graphData;
        let dir;
        let scroll_amt = 0.2;
        let zoom_amt = 0.2;
        
        lockWheel()

        if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 1){
            (e.deltaX < 0) ? dir = "right" : dir = "left"
            if (!isScrolling){
                setScrolling(true)
            }
            scroll(gd, dir, scroll_amt,e)
            
        } else {
            (e.deltaY < 0) ? dir = "in" : dir = "out"
            zoom(gd, dir, zoom_amt,e)
        }
    }

    function zoom(gd, dir, amt,e){
        let start;
        if (dir == "in"){
            if (gd.start < (gd.end - 2)) {
                start = gd.start + amt
            } else {return}
        } else if (dir == "out"){
            if (gd.start > amt) {
                start = gd.start - amt
            } else {return}
        }
        setGD(prevState => ({
            ...prevState,
            start: start,
        }));
        handleTooltip(e);
    }

    function scroll(gd, dir, amt,e){
        let start, end;
        if (dir == "right"){
            if (orient >= count){return}
            else{setOrient(orient+1)}
            if (gd.end < max(gd.lineData, getX) - amt) {
                start = gd.start + amt
                end = gd.end + amt
            } else {return}
        } else if (dir == "left" || orient <= 0){
            if (gd.start <= 1){return}
            else{setOrient(orient-1)}
            if (gd.start > amt) {
                start = gd.start - amt
                end = gd.end - amt
            } else {return}
        }
        if (Math.ceil(end) == graphData.lineData.length - 1){
            setScrolling(false);
        }
        setGD(prevState => ({
            ...prevState,
            start: start,
            end: end
        }));
        handleTooltip(e);
    }

    function checkKey(e) {
        if (e.keyCode == '38') { zoom(graphData, "in", 1); lockWheel(); // up arrow 
        } else if (e.keyCode == '40') { zoom(graphData, "out", 1); lockWheel() // down arrow
        } else if (e.keyCode == '37') { scroll(graphData, "left", 1); lockWheel() // left arrow 
        } else if (e.keyCode == '39') { scroll(graphData, "right", 1); lockWheel() // right arrow
        } else if (e.keyCode == '65') { updateData(graphData, e)// space
        }
    }

    function jump_recent(e){
        let start, end
        let jump = graphData.lineData.length - 1 - graphData.end
        end = graphData.end + jump
        start = graphData.start + jump
        setScrolling(false);
        setGD(prevState => ({
            ...prevState,
            start: start,
            end: end
        }));
    }

    /*****************  USE EFFECT BULLSHIT  ****************/
    useEffect(() => {
        const cancelWheel = e => wheelTimeout.current && e.preventDefault()
        document.body.addEventListener('wheel', cancelWheel, {passive:false})
        return () => document.body.removeEventListener('wheel', cancelWheel)
    }, [])
    useEffect(() => {
        updateScales()
    }, [graphData.lineData, graphData.start, graphData.end])
    /*****************  TOOLTIP BULLSHIT  ****************/
    // takes left of time
    const bisectTime = bisector((d) => d.time).left;
     // a bunch of tooltip defs
    const { showTooltip,
        tooltipData,
        hideTooltip,
        tooltipTop = 0,
        tooltipLeft = 0, } = useTooltip();
    // tooltip handler
    const handleTooltip = useCallback(
        (event) => {
          let {x} = localPoint(event) || {x: graph_offset*2}; // x of mouse
          x -= (graph_offset*2)
          const x0 = graphData.xScale.invert(x); // maps x -> time 
          const index = bisectTime(graphData.lineData, x0, 1); // finds index of the middle time
          const d0 = graphData.lineData[index - 1]; 
          const d1 = graphData.lineData[index];
          let d = d0;
          if (d1 && getX(d1)) {
            d = x0.valueOf() - getX(d0).valueOf() > getX(d1).valueOf() - x0.valueOf() ? d1 : d0;
          }
          showTooltip({
            tooltipData: d,
            tooltipLeft: graphData.xScale(getX(d)),
            tooltipTop: graphData.yScale(getY(d)),
          });
        },
        [showTooltip, graphData.yScale, graphData.xScale],
      );



  return (
        <GraphContainer
            onKeyDown={(e) => checkKey(e)}
            onMouseEnter={() => {props.sendIndex(); props.sendStart();}}
            onMouseLeave={() => {props.removeIndex(); props.removeStart();}}
        >
            <button className='clickMe' onClick={(e) => updateData(graphData,e)}>update</button> <br/>
            {/* navigation buttons */}
            <ButtonTray width={width}>
                <div>
                <Clickable src={scrollleft} alt='scroll left' width='25px' height='25px' onClick={(e) => {scroll(graphData, "left", 1, e)}} />
                <Clickable src={scrollright} alt='scroll right' width='25px' height='25px' onClick={(e) => {scroll(graphData, "right", 1, e)}} />
                </div>
                <div>
                <Clickable src={zoomin} alt='zoom in' width='25px' height='25px' onClick={(e) => {zoom(graphData, "in", 1,e)}} />
                <Clickable src={zoomout} alt='zoom out' width='25px' height='25px' onClick={(e) => {zoom(graphData, "out", 1,e)}} />
                </div>
                <Clickable src={recent} alt='recent' width='25px' height='25px' onClick={(e) => {jump_recent(e)}} />
            </ButtonTray>
            <SVGContainer width={width}>
            <div>{props.sensorName}</div>
            {/* graph  */}
            <svg width={width} height={height} onWheel={(e) => handleMouseScroll(e)}>
                <MarkerCircle id="marker-circle" fill="#5048E5" size={1} refX={2} /> {/* pretty point */}
                <rect width={width} height={height } fill="#fff" rx={14} ry={14} /> {/* border rect */}
                <Group left={graph_offset*2}>
                    {/* axis and grids */}
                    <GridRows scale={graphData.yScale} width={width - graph_offset*3} stroke="#e0e0e0"/>
                    <GridColumns scale={graphData.xScale} height={height-60} stroke="#e0e0e0" top={30}/>
                    <AxisBottom left={0} top={height-45} scale={graphData.xScale} stroke='#838181' label={"Time"} tickFormat={(value: number, i: number) =>parseSecToTime(value)} />
                    <AxisLeft left={0} scale={graphData.yScale} stroke='#838181' label={ExampleSensorsLettersToNames[props.sensorName][1]}/>
                    {/* plots line */}
                    {graphData.lineData.slice(Math.floor(graphData.start), Math.floor(graphData.end)).map((d, j) => (
                        <circle
                        key={j}
                        r={2}
                        cx={graphData.xScale(getX(d))}
                        cy={graphData.yScale(getY(d))}
                        stroke="#5048E5"
                        />
                    ))}
                    <LinePath
                    curve={allCurves[curveType]}
                    data={graphData.lineData.slice(Math.floor(graphData.start), Math.ceil(graphData.end))}
                    x={(d) => graphData.xScale(getX(d)) ?? 0}
                    y={(d) => graphData.yScale(getY(d)) ?? 0}
                    stroke="#5048E5"
                    strokeWidth={2}
                    strokeOpacity={1}
                    shapeRendering="geometricPrecision"
                    markerMid="url(#marker-circle)"
                    markerStart="url(#marker-circle)"
                    markerEnd="url(#marker-circle)"
                    />
                    {/* shades in area under the curve */}
                    <AreaClosed
                        fill="#5048E515"
                        curve={allCurves[curveType]}
                        data={graphData.lineData.slice(Math.floor(graphData.start), Math.ceil(graphData.end))}
                        x={(d) => graphData.xScale(getX(d)) ?? 0}
                        y={(d) => graphData.yScale(getY(d)) ?? 0}
                        yScale={graphData.yScale}
                    />
                    {/* tooltip handling (just line and bar) */}
                    <Bar
                        x={0}
                        y={0}
                        width={width}
                        height={height}
                        fill="transparent"
                        rx={14}
                        onTouchStart={handleTooltip}
                        onTouchMove={handleTooltip}
                        onMouseMove={handleTooltip}
                        onMouseLeave={() => hideTooltip()}
                    />
                    {tooltipData && (
                        <g>
                            <Line
                            from={{ x: tooltipLeft, y: height * 0.08 }}
                            to={{ x: tooltipLeft, y: height * 0.85}}
                            stroke="#5048E5"
                            strokeWidth={2}
                            pointerEvents="none"
                            strokeDasharray="5,2"
                            />
                            <circle
                            cx={tooltipLeft}
                            cy={tooltipTop + 1}
                            r={4}
                            fill="black"
                            fillOpacity={0.1}
                            stroke="black"
                            strokeOpacity={0.1}
                            strokeWidth={2}
                            pointerEvents="none"
                            />
                            <circle
                            cx={tooltipLeft}
                            cy={tooltipTop}
                            r={4}
                            fill="#5048E5"
                            stroke="white"
                            strokeWidth={2}
                            pointerEvents="none"
                            />
                        </g>
                    )})
                </Group>
                );
            </svg>
            </SVGContainer>
            {/* tooltip labeling */}
            {tooltipData && (
            <div>
                <TooltipWithBounds
                    key={Math.random()}
                    top={tooltipTop + 15}
                    left={tooltipLeft + 40}
                    
                >
                    {`${getY(tooltipData)}`}
              </TooltipWithBounds>
            </div>
          )}
        </GraphContainer>
    )}

const Clickable = styled.img`
  cursor: pointer;
`;

const ButtonTray = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  position: absolute;
  top: 30px;
  left: ${props=> props.width - 40}px ;
`

const GraphContainer = styled.div`
  position: relative;
  margin-top: 7px;
  margin-bottom: 7px;
`;

const SVGContainer = styled.div`
  border-radius: 14px;
  border: 1px solid #838181;
  padding: 10px;
  width: ${props=> props.width}px;
`
