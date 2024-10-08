[![Netlify Status](https://api.netlify.com/api/v1/badges/2f38eb8b-0c8f-40e3-9d32-185e02d29578/deploy-status)](https://app.netlify.com/sites/chatroulette-tk/deploys)

# Chatroulette-style Frontend

This is the frontend part of a Chatroulette-style video chat application built using React, socket.io, and WebRTC. This application provides a live video chatting experience, allowing users to connect randomly with others in a waiting queue. This is made for a music video, to mimic the 2012 version of chatroulette

## Features

- **User Registration**: Users provide details like age, gender, country, and nickname to register and enter the chat queue.
- **Main User Interface**: If the nickname "luke" is used, the user is identified as the main user with special controls such as "Next" to skip users.
- **WebRTC Video Chat**: Users can video chat with each other through peer-to-peer connections using WebRTC.
- **Socket.io Integration**: The frontend interacts with the backend using socket.io for real-time communication.
- **Device Selection**: Users can select their preferred camera, microphone, and speaker devices.
- **Session Management**: The app keeps the user session alive through periodic "I'm Up" messages to the backend.

## Prerequisites

Make sure you have the following installed:

- Node.js (>= 14.x)
- npm (Node Package Manager) or yarn

## Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd chatroulette-frontend
   ```

2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the project root and add your backend URL:
   ```
   REACT_APP_BACKEND_URL=https://chatroulette.tokiostudio.it
   ```

4. Start the development server:
   ```sh
   npm start
   # or
   yarn start
   ```

   The application will be available at `http://localhost:3000`.

## File Structure

- `src/`
  - `components/`
    - **RegistrationForm**: User registration form component.
    - **WaitingRoom**: Displays waiting state until the user is connected.
    - **VideoChat**: Main video chat component that includes local and remote video.
    - **MainUserInterface**: Special interface for the main user (nickname "luke"), allowing them to skip users.
  - `App.jsx`: Main application component that manages routing between registration, waiting room, and video chat.
  - `index.js`: Entry point of the application.

## Usage

- **Registering**: Users must provide their details to register. If the nickname is "luke", the user will have special privileges.
- **Selecting Devices**: Users can choose their preferred camera, microphone, and speaker from available devices.
- **Connecting to Others**: Once registered, users are placed in a queue. The main user ("luke") can connect with others and skip between different users.
- **Video Chat**: When two users are connected, they will have a live video chat through WebRTC.

## Socket.io Events

- **Register (`register`)**: Emitted during registration, including age, gender, country, and nickname.
- **Get User (`get-user`)**: Emitted by the main user to get a random available user from the queue.
- **I'm Up (`im-up`)**: Periodically emitted to let the backend know that the user is still active.
- **Send Offer (`send-offer`)**: Sent when initiating a WebRTC offer to connect to another user.
- **Send Answer (`send-answer`)**: Sent when responding to a WebRTC offer.
- **Send ICE Candidate (`send-ice-candidate`)**: Sent during the WebRTC handshake process to exchange network information.

## Environment Variables

- `REACT_APP_BACKEND_URL`: The URL of the backend server that the frontend communicates with.

## WebRTC Connection Flow

1. **Registration**: The user registers via the socket event `register`.
2. **Get User**: If the user is "luke", they can call `get-user` to connect with a random guest.
3. **Offer/Answer Exchange**: The main user initiates a WebRTC offer, and the guest user responds with an answer.
4. **ICE Candidate Exchange**: ICE candidates are exchanged to establish a stable peer-to-peer connection.

## Development

During development, the app will automatically reload if you make any edits.

## Production Build

To create a production build, run:
```sh
npm run build
# or
yarn build
```
This will create an optimized build in the `build` directory, which can be deployed to a web server.

## License

This project is licensed under the MIT License.

## Contributing

Feel free to open issues or submit pull requests for any changes you'd like to make. Contributions are always welcome!

## Troubleshooting

- **Camera or Microphone Issues**: Make sure you allow the browser to access your camera and microphone.
- **Connection Problems**: Ensure that the backend server is up and reachable at the specified `REACT_APP_BACKEND_URL`.
- **Cross-Origin Requests**: If you encounter CORS issues, ensure the backend allows requests from the frontend's origin.
