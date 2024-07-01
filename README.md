# recyclable-tracker

**App Overview**:
The application is designed to detect, identify, track, and count containers such as aluminium cans, HDPE2 plastic bottles, PET1 plastic bottles, glass bottles, and milk cartons. It uses YOLOv5 for object detection and DeepSORT for tracking. The counts of detected objects are stored persistently.

**GUI and Layout**:

1. **Main Screen**:
   - **Live Camera Feed**: The main screen displays the live camera feed from the device's camera. Detected objects are highlighted with bounding boxes and unique ID labels superimposed over the feed.
   - **Detection Information**: A small overlay at the top or bottom of the screen shows real-time information about the detected objects, including their types and counts.

2. **Count Display**:
   - **Persistent Count Display**: A section of the screen (e.g., a sidebar or a bottom bar) displays the persistent counts of each type of container detected. This section updates in real-time as new objects are detected and tracked.
   - **Reset Button**: A button to reset the counts, allowing the user to start a new counting session.

3. **Settings Screen**:
   - **Model Settings**: Options to configure the detection model, such as selecting the YOLOv5 model variant (e.g., YOLOv5s, YOLOv5m).
   - **Tracking Settings**: Options to configure the tracking algorithm, such as adjusting the tracking sensitivity.
   - **Performance Settings**: Options to enable or disable GPU delegation and multi-threading for performance optimization.

4. **History Screen**:
   - **Count History**: A screen that displays the history of counts from previous sessions. This can be implemented using a simple list or table format.
   - **Export Data**: An option to export the count history to a file (e.g., CSV) for further analysis.

**Functionality**:
- **Real-Time Detection and Tracking**: The app processes the live camera feed to detect and track objects in real-time.
- **Counting Mechanism**: The app maintains a count of detected objects and updates the persistent storage with these counts.
- **Persistent Storage**: The counts are stored in a local database (e.g., SQLite) to ensure they are saved across sessions.
- **User Settings**: The app provides options for users to configure detection, tracking, and performance settings.
- **History and Export**: The app maintains a history of counts and provides an option to export this data for further analysis.


## Collaborate with GPT Engineer

This is a [gptengineer.app](https://gptengineer.app)-synced repository 🌟🤖

Changes made via gptengineer.app will be committed to this repo.

If you clone this repo and push changes, you will have them reflected in the GPT Engineer UI.

## Tech stack

This project is built with React and Tailwind CSS.

- Vite
- React
- Tailwind CSS

## Setup

```sh
git clone https://github.com/GPT-Engineer-App/recyclable-tracker.git
cd recyclable-tracker
npm i
```

```sh
npm run dev
```

This will run a dev server with auto reloading and an instant preview.

## Requirements

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
