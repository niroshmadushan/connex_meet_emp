const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://192.168.13.190:3001'; // Fallback to localhost if not set in env

const config = {
    becomeapartnerapi: `${BACKEND_URL}/becomePartner`,
    loginapi: `${BACKEND_URL}/login`,
    verifytoken: `${BACKEND_URL}/verifytoken`,
    getallorgemails: `${BACKEND_URL}/getallorgemails`,
    getalllocationdata: `${BACKEND_URL}/getlocations`,
    getalluserdata: `${BACKEND_URL}/getProfileData`,
    mainapi: `${BACKEND_URL}`
};

export default config;
