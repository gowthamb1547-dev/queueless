'use client';

import Cookies from 'js-cookie';
import { authAPI } from './api';

export const setAuthToken = (token) => {
  Cookies.set('accessToken', token, { expires: 1 }); // 1 day
};

export const removeAuthToken = () => {
  Cookies.remove('accessToken');
};

export const getAuthToken = () => {
  return Cookies.get('accessToken');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const getCurrentUser = async () => {
  try {
    const response = await authAPI.getMe();
    return response.data.user;
  } catch (error) {
    return null;
  }
};

