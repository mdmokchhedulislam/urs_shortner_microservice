import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 500 },  // ramp-up to 50 users
   { duration: '5m', target: 1000 }, // peak load
    { duration: '2m', target: 0 },   // ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% requests should be below 500ms
  },
};

export default function () {
  let res =http.get('http://a7a15bda690ef4c019c2108d1eb7e75e-697610890.us-east-1.elb.amazonaws.com:5000/shorten?url=https://example.com');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response body not empty': (r) => r.body.length > 0,
  });
  sleep(1);
}