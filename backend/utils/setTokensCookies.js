const setTokensCookies = (res, accessToken, refreshToken, newAccessTokenExp, newRefreshTokenExp) => {
    const accessTokenMaxAge = (newAccessTokenExp - Math.floor(Date.now() / 1000)) * 1000;
    const refreshTokenMaxAge = (newRefreshTokenExp - Math.floor(Date.now() / 1000)) * 1000;

    // Set Cookie for Access Token
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true, // Set to true if using HTTPS
        maxAge: accessTokenMaxAge,
        // sameSite: 'strict', // Adjust according to your requirements
    });

    // Set Cookie for Refresh Token
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true, // Set to true if using HTTPS
        maxAge: refreshTokenMaxAge,
        // sameSite: 'strict', // Adjust according to your requirements
    });
    // Set Cookie for is_auth
    res.cookie('is_auth', true, {
        httpOnly: false,
        secure: false, // Set to true if using HTTPS
        maxAge: refreshTokenMaxAge,
        // sameSite: 'strict', // Adjust according to your requirements
    });
};

export default setTokensCookies;