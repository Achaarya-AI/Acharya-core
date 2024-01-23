export async function config(creds) {
  
    const {class: classValue , subject} = creds

    const postConfigData = {
        "class_": String(classValue),
        "subject": String(subject),
    };

    // const url = "http://127.0.0.1:8000/settings"
    const url = "https://170d-35-187-228-242.ngrok-free.app/settings"

    const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postConfigData),
      });

    return res;
}


export async function getResponse(creds) {
  
    const postData = {
    "messages": String(creds),
};

// const url = "http://127.0.0.1:8000/home"
const url = "https://170d-35-187-228-242.ngrok-free.app/home"

const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });

return res;
}

