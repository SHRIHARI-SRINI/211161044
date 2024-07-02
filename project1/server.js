const express = require('express');
const axios = require('axios');
const app = express();
const port = 9876;

let dataStructure = [];
const MAX_SIZE = 10;

let authToken = ''; // Placeholder for the authorization token

// Function to register (if needed)
const register = async () => {
  try {
    const response = await axios.post('http://20.244.56.144/test/register', {
      companyName: 'goMart',
      ownerName: 'Rahul',
      rollNo: '1',
      ownerEmail: 'rahul@abc.edu',
      accessCode: 'FKDLjg'
    });
    const { clientID, clientSecret } = response.data;
    console.log('Client ID:', clientID);
    console.log('Client Secret:', clientSecret);
    return { clientID, clientSecret };
  } catch (error) {
    console.error('Error during registration:', error.message);
  }
};

// Function to obtain the authorization token
const getAuthToken = async (clientID, clientSecret) => {
  try {
    const response = await axios.post('http://20.244.56.144/test/auth', {
      companyName: 'goMart',
      clientID: clientID,
      clientSecret: clientSecret,
      ownerEmail: 'rahul@abc.edu',
      rollNo: '1'
    });
    authToken = response.data.token;
    console.log('Authorization Token:', authToken);
  } catch (error) {
    console.error('Error fetching auth token:', error.message);
  }
};

// Function to fetch numbers from the API
const fetchNumbers = async (type) => {
  try {
    const response = await axios.get(`http://20.244.56.144/test/${type}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    return response.data.numbers;
  } catch (error) {
    console.error('Error fetching numbers:', error.message);
    return [];
  }
};

app.get('/numbers/:type', async (req, res) => {
  const type = req.params.type;

  // Fetch numbers from the API
  const numbers = await fetchNumbers(type);

  dataStructure.push(...numbers.filter(num => !dataStructure.includes(num)));
  dataStructure = dataStructure.slice(-MAX_SIZE);

  const avg = dataStructure.reduce((a, b) => a + b, 0) / dataStructure.length;

  res.json({
    windowPrevState: [...dataStructure],
    windowCurrState: [...dataStructure],
    numbers: numbers,
    avg: avg
  });
});

app.listen(port, async () => {
  // Uncomment the following lines if you need to register and get new credentials
  // const { clientID, clientSecret } = await register();
  const clientID = '37bb493c-73d3-47ea-8675-21f66ef9b735'; // Use your actual client ID
  const clientSecret = 'XOyoloRPasKW0dAN'; // Use your actual client secret
  await getAuthToken(clientID, clientSecret); // Obtain the auth token
  console.log(`Server running at http://localhost:${port}/`);
});
