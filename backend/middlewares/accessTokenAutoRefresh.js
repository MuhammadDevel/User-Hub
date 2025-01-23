// This middleware will set authorization headers and will refresh access token on expire
// if we user this middleware we won't have to explicitly make request to refresh tokens api url

import isTokenExpired from "../utils/isTokenExpired.js";
import refreshAccessToken from "../utils/refreshAccessToken.js";
import setTokensCookies from "../utils/setTokensCookies.js";

const accessTokenAutoRefresh = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;

        if (accessToken || !isTokenExpired(accessToken)) {
            // Add the access token in the Authorization header
            req.headers['authorization'] = `Bearer ${accessToken}`;
        }

        if (!accessToken || isTokenExpired(accessToken)) {
            // Attempt to get a new access token using the refresh token
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                // If refresh token is also missing. Throw as error
                throw new Error('Refresh token is missing.');
            }

            // Access token is expired, make a refresh token
            const {newAccessToken, newRefreshToken, newAccessTokenExp, newRefreshTokenExp} = await refreshAccessToken(req,res)

            // set cookies
            setTokensCookies(res, newAccessToken, newRefreshToken, newAccessTokenExp, newRefreshTokenExp)

            // Add the access token in the Authorization header
            req.headers['authorization'] = `Bearer ${newAccessToken}`;
        }
        next();
    } catch (error) {
        console.error('Error adding access token to header:', error.message);
        // Handle the error, such as returning an error response or redirecting to the login page
        res.status(401).json({ status: "failed", message: 'Access token is missing or invalid' });
    }
}

export default accessTokenAutoRefresh;