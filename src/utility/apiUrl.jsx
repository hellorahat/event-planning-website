const baseUrl = 'https://server-eventflow.glitch.me/';

const endpoints = {
  getMap: 'map/get-location',
  postProcessPayment: 'order/process-payment'
};

const apiUrl = {
  getMapUrl: `${baseUrl}${endpoints.getMap}`,
  postPaymentUrl: `${baseUrl}${endpoints.postProcessPayment}`,
};

export default apiUrl;
