# NFR21 Telemetry

## Getting Started

Make sure to run `npm i` in the root directory to install dependencies.

## Scripts

### `npm start`

Runs the React frontend which can then be accessed at localhost:3000

### `npm run dev`

Runs the electron app

## Tasks
### TODO
- Graph dnd + handles
- Dnd autoscroll

### Experiments
- Test alternative cursors (grab) on dnd
- Add dnd symbol next to list items?

### Bugs
- Flex getSector is fucked up (fix y calibration)
- Indicator persists when you remove everything
- Datadisplay doesn't mask dnd indicator
- Graph tooltip dies when using zoom buttons
- Graph tooltip locks onto points that are past the end
- Graph state is still being shared somehow