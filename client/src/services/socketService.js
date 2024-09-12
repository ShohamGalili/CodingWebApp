import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_API_URL); //####### FOR LOCALHOST ########
//const socket = io('https://codingwebapp-pfyd.onrender.com'); //####### FOR DEPLOY ########

export { socket };
