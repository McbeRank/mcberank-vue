export default {
    baseUrl: process.env.VUE_APP_BASE_URL ? '/' + process.env.VUE_APP_BASE_URL + '/' : '/',
    apiUrl: process.env.VUE_APP_API_URL || '/'
};