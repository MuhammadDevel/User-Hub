import jwt from "jsonwebtoken";

const isTokenExpired = (token) => {
    if(!token){
        return true;
    }
    const decodedToken = jwt.decode(token);
    const currentToken = Date.now() / 1000;
    return decodedToken.exp < currentToken;
}

export default isTokenExpired;