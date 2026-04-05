const axios = require('axios');

const testRegistration = async () => {
  try {
    const res = await axios.post('http://localhost:5001/api/auth/register', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Registration Success:', res.data);
  } catch (error) {
    console.error('Registration Failed:', error.response ? error.response.data : error.message);
  }
};

testRegistration();
