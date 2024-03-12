import React from 'react';
import { Redirect } from 'react-router-dom';

export function requireConfig(input) {
    if (input.subject === '') {
        // throw '/settings?message=You must select the class and subject first.';
        throw '/';
    }

    return null;
}

export function requireAuth(isLoggedIn) {
    // console.log("isLoggedIn", isLoggedIn);
    if (isLoggedIn === false) {
        // throw '/login?message=You must Log in first.';
        throw '/getStarted';
    }

    return null;
}
