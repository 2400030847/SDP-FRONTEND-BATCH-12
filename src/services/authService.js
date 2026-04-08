import API from './api';

const authService = {
  register: (data) =>
    API.post('/auth/register', data).then((res) => res.data),

  login: (data) =>
    API.post('/auth/login', data).then((res) => res.data),

  demoLogin: (email, password) =>
    API.post('/auth/demo-login', { email, password }).then((res) => res.data),

  sendLoginOtp: (email) =>
    API.post('/auth/send-login-otp', { email }).then((res) => res.data),

  verifyOtp: (email, otp) =>
    API.post('/auth/verify-otp', { email, otp }).then((res) => res.data),

  resendOtp: (email) =>
    API.post('/auth/resend-otp', { email }).then((res) => res.data),

  getCaptcha: () =>
    API.get('/auth/captcha').then((res) => res.data),

  refreshToken: (refreshToken) =>
    API.post(`/auth/refresh?refreshToken=${refreshToken}`).then((res) => res.data),
};

export default authService;