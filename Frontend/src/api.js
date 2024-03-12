const baseUrl = "https://2984-34-75-21-233.ngrok-free.app"



// /google/oauth/token route
export async function login(code) {
  try {
    // console.log("code", code)
    const url = `${baseUrl}/google/oauth/token`

    const data = {
      client_id: process.env.REACT_APP_CLIENT_ID,
      client_secret: process.env.REACT_APP_CLIENT_SECRET,
      code: String(code),
      redirect_uri: 'http://localhost:3000'
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Change content type to JSON
        "Access-Control-Allow-Origin": "http://localhost:3000",
      },
      credentials: 'include',
      body: JSON.stringify(data), // Stringify the data object to JSON
    });

    if (!response.ok) {
      throw new Error('Failed to fetch OAuth token');
    }

    const responseData = await response.json();

    // console.log(responseData)

    return responseData;
  } catch (error) {
    console.error(error);
    // Handle error
  }
}



// logout route
export async function logout() {
  try {
    const url = `${baseUrl}/logout`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to logout user');
    }

    const responseData = await response.json();
    // console.log(responseData);

    return responseData;
  } catch (error) {
    console.error(error);
  }
}



// settings route
export async function config(creds, messageId, email) {

  const { class: classValue, subject } = creds

  const postConfigData = {
    "class_": String(classValue),
    "subject": String(subject),
    "messageId":String(messageId),
    "email":String(email),
    client_id: process.env.REACT_APP_CLIENT_ID,
    client_secret: process.env.REACT_APP_CLIENT_SECRET,
  };

  // const url = "http://127.0.0.1:8000/settings"
  const url = `${baseUrl}/settings`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postConfigData),
    credentials: 'include',
  });

  return res;
}




// home route
export async function getResponse(creds, messageId, email) {

  const postData = {
    "messages": String(creds),
    "messageId":String(messageId),
    "email":String(email),
  };

  // const url = "http://127.0.0.1:8000/home"
  const url = `${baseUrl}/home`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
    credentials: 'include',
  });

  return res;
}

