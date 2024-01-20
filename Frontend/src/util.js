import React from 'react';
import { Redirect } from 'react-router-dom';

export function requireAuth(input) {
    if (input.subject === '') {
        throw '/settings?message=You must select the class and subject first.';
    }

    return null;
}
