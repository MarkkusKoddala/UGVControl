
# UGV Interface Application

## Overview
This application provides a control interface for an Unmanned Ground Vehicle (UGV). It allows users to control the UGV remotely, set waypoints on a digital map, and manage the vehicle's engine and movement. This interface is designed for use in remote operations centers where direct control of UGVs is required for field operations.
## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/MarkkusKoddala/UGVControl.git
   ```
2. Navigate to the project directory:
   ```bash
   cd UGVControl
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage
### Starting the Application
Run the following command in the project directory:
```bash
npm run serve
```
The application will be available at `http://localhost:8080`.

### Common Tasks
#### Starting the UGV Engine
- Click the 'Start Engine' button located at the top-right of the interface to turn on the UGV.

#### Setting a Waypoint
- Long-press on the desired location on the map to drop a new waypoint.
- A popup will appear allowing you to 'Drive', 'Save', or 'Discard' the waypoint.

#### Navigating to a Waypoint
- Select a saved waypoint from the list and click 'Drive' to move the UGV to that location.

# Additional information
The task took more than three hours, primarily due to two reasons: the most time-consuming aspect was familiarizing myself with Leaflet's functionalities, and implementing the renaming and popup opening after adding a marker on the map.


[Watch the Demo Video (download raw)](/demovideo.mp4)
