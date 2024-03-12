# main.py
from fastapi import FastAPI, HTTPException, Response, Request, Cookie
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pyngrok import ngrok
import requests
from datetime import datetime, timedelta
from pymongo import MongoClient
from uuid import uuid4
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Get MongoDB URI from environment variable
uri = os.getenv("MONGODB_URI")
# Create a new client and connect to the server
client = MongoClient(uri)
# Access the AcharyaChat database
db = client["AcharyaChat"]
# Access the AcharyaCollection collection
collection = db["AcharyaCollection"]


# Import your custom functions
# from llm import initialize_model, generate_response  # Make sure to import these functions

app = FastAPI()

class LoginData(BaseModel):
    client_id: str
    client_secret: str
    code: str
    redirect_uri: str

class ConfigData(BaseModel):
    client_id: str
    client_secret: str
    class_: str
    subject: str
    messageId: str
    email: str

class UserQuery(BaseModel):
    messages: str
    email: str
    messageId: str

class TokenRequest(BaseModel):
    client_id: str
    client_secret: str
    refresh_token: str



# Enable CORS (Cross-Origin Resource Sharing)

origins = ['http://localhost:3000', 'http://127.0.0.1:3000',
           'https://localhost:3000', 'https://127.0.0.1:3000']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "HEAD", "OPTIONS"],
    allow_headers=["Access-Control-Allow-Headers", 'Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
)



# Initialize the model once
# initialize_model()



# fungtion to check whether the existing access token is expired

def is_access_token_valid(expires_in):
    # converting the str to datetime type
    expire_token_datetime = datetime.strptime(expires_in, "%Y-%m-%d %H:%M:%S.%f")
    # for Debugging
    print(f"expire time: {expire_token_datetime}, current time: {datetime.now()}")
    print("Expression value in fn: \n", expire_token_datetime > datetime.now())
    return expire_token_datetime > datetime.now()



# function to get an access token from the existing refresh token

def refresh_access_token(refresh_token,  client_id, client_secret):
    token_url = "https://oauth2.googleapis.com/token"
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    payload = {
        "client_id": client_id,
        "client_secret": client_secret,
        "grant_type": "refresh_token",
        "refresh_token": refresh_token
    }

    res = requests.post(token_url, headers=headers, data=payload)

    if res.status_code != 200:
        raise HTTPException(status_code=res.status_code, detail="Failed to refresh access token")

    print("Inside refresh_access_token fn() and the token refreshed successfully this is the response:\n", res.json())

    # Extracting the expires_in to setup the cookie for expiretoken
    expires_in = res.json().get("expires_in")

    # Ensure expires_in is a valid value before converting to datetime
    if expires_in is None:
        raise ValueError("expires_in not found in token response")

    expires_in = datetime.now() + timedelta(seconds=expires_in)

    return res.json(), expires_in




# route to logout the user

@app.post("/logout")
def logout_user(response: Response):
      # Clearing the cookies
    response.delete_cookie(key="accesstoken")
    response.delete_cookie(key="expiretoken")
    response.delete_cookie(key="refreshtoken")

    return {"message": "User logged out successfully"}




# route to get the accesstoken from token
@app.post("/google/oauth/token")
async def get_google_oauth_token(login: LoginData, response: Response, request: Request):

    # setting the properties to get the access token
    token_url = "https://oauth2.googleapis.com/token"
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Access-Control-Allow-Origin": "http://localhost:3000",
    }
    payload = {
        "client_id": login.client_id,
        "client_secret": login.client_secret,
        "code": login.code,
        "grant_type": "authorization_code",
        "redirect_uri": login.redirect_uri
    }

    # using the token from react-oauth to get the access token
    res = requests.post(token_url, headers=headers, data=payload)
    # convert to result
    result = res.json()
    if res.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch OAuth token")

    # Extracting the expires_in to setup the cookie for expiretoken
    expires_in = result.get("expires_in")
    expires_in = datetime.now() + timedelta(seconds=expires_in)

    # Retrieve user information using the access token
    userinfo_url = "https://www.googleapis.com/oauth2/v1/userinfo"
    userinfo_headers = {
        "Authorization": f"Bearer {result.get('access_token')}"
    }
    userinfo_res = requests.get(userinfo_url, headers=userinfo_headers)

    if userinfo_res.status_code != 200:
        raise HTTPException(status_code=userinfo_res.status_code, detail="Failed to fetch user information")

    userinfo = userinfo_res.json()

    # Extract email, name, profile, or any other required information
    email = userinfo.get("email")
    name = userinfo.get("name")
    profile = userinfo.get("picture")  # Assuming profile picture URL is provided

    if email:
        existing_user = collection.find_one({"email": email})
        print(existing_user)
        if existing_user:
            # Update existing messages List by adding a new list of messages in that timestamp
            # Generate a unique identifier for the message list
            message_list_id = str(uuid4())
            collection.update_one(
                {"_id": existing_user["_id"]},
                {"$push": {"messages": {"$each": [{"_id":message_list_id,"timestamp": datetime.now(), "messageList": []}], "$position": 0}}}
            )
        else:
            # Create a new user document
            # Generate a unique identifier for the message list
            message_list_id = str(uuid4())
            new_user = {"email": email, "messages": [{"_id":message_list_id,"timestamp": datetime.now(), "messageList": []}]}
            collection.insert_one(new_user)


    # setting up the cookies accesstoken, refreshtoken, expiretoken
    response.set_cookie(key="accesstoken", value=result.get("access_token"), samesite="none", secure=True, path='/', httponly=True)
    response.set_cookie(key="refreshtoken", value=result.get("refresh_token"), samesite="none", secure=True, path='/', httponly=True)
    response.set_cookie(key="expiretoken", value=expires_in, samesite="none", secure=True, path='/', httponly=True)

    # Return email, name, and profile along with other information
    return {"status": "success", "user":{"email": email, "name": name, "profile": profile},"messages":{"messageId": message_list_id} }




# route to set the subjects and class

@app.post("/settings")
def config(settings: ConfigData, request: Request, response: Response):
    print(settings.messageId)
    print(settings.email)

    # checking the cookies which are saved
    received_cookies = request.cookies
    print("Received Cookies:\n", received_cookies)

    # retrieving the accesstoken, expiretoken to see whether it is valid
    access_token = request.cookies.get("accesstoken")
    expire_token = request.cookies.get("expiretoken")
    refresh_token = request.cookies.get("refreshtoken")

    # logic to check the validation of expire token
    if not access_token or not expire_token or not refresh_token or not is_access_token_valid(expire_token):
        # update the access token using the refresh token
        if refresh_token:
            try:
                 # Attempt to refresh the token
                token_response, new_expire_time = refresh_access_token(refresh_token, settings.client_id, settings.client_secret)

                # Extracting the access_token from the response
                new_access_token = token_response.get("access_token")
                if new_access_token is None:
                    raise ValueError("access_token not found in token response")

                # Setting up the new cookies accesstoken, refreshtoken, expiretoken
                response.set_cookie(key="accesstoken", value=new_access_token, samesite="none", secure=True, path='/', httponly=True)
                response.set_cookie(key="expiretoken", value=new_expire_time, samesite="none", secure=True, path='/', httponly=True)

            except Exception as e:
                # Catch specific exceptions and handle them appropriately
                 raise HTTPException(status_code=401, detail="Failed to refresh access token") from e
        else:
          # sending error response as the token is expired
          raise HTTPException(status_code=401, detail="Access token is expired or invalid")

    try:
        response_string=""

        if not settings.class_ or not settings.subject:
            raise HTTPException(status_code=400, detail="Class and subject are required fields")

        print(settings.subject)

        if settings.subject == "History":
          response_string=history_syllabus(settings.class_, settings.subject)
        elif settings.subject == "Science":
          response_string=science_syllabus(settings.class_, settings.subject)
        elif settings.subject == "Mathematics":
          response_string=Maths_syllabus(settings.class_, settings.subject)


        # Updating the database
        # Find the user document in the collection based on the email
        user_document = collection.find_one({"email": settings.email})

        if user_document:
            # Iterate through message lists to find the one with the specified messageId
            for message_list in user_document["messages"]:
                if message_list["_id"] == settings.messageId:
                    # Append the response_string to the messageList array
                    message_list["messageList"].insert(0,{"isUser": False, "text": response_string,"reasoning" : [], "feedback": 0 })
                    break

            # Update the user document in the collection
            collection.update_one({"email": settings.email}, {"$set": {"messages": user_document["messages"]}})


        return {"response": response_string, "reasoning": ""}
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")



# route to send and receive response from llm

@app.post("/home")
def home_route(home: UserQuery, request: Request, response: Response):
    # checking the cookies which are saved
    received_cookies = request.cookies
    print("Received Cookies:\n", received_cookies)

    # retrieving the accesstoken, expiretoken to see whether it is valid
    access_token = request.cookies.get("accesstoken")
    expire_token = request.cookies.get("expiretoken")
    refresh_token = request.cookies.get("refreshtoken")

    # logic to check the validation of expire token
    if not access_token or not expire_token or not refresh_token or not is_access_token_valid(expire_token):
        # update the access token using the refresh token
        if refresh_token:
            try:
                 # Attempt to refresh the token
                token_response, new_expire_time = refresh_access_token(refresh_token, home.client_id, home.client_secret)

                # Extracting the access_token from the response
                new_access_token = token_response.get("access_token")
                if new_access_token is None:
                    raise ValueError("access_token not found in token response")

                # Setting up the new cookies accesstoken, refreshtoken, expiretoken
                response.set_cookie(key="accesstoken", value=new_access_token, samesite="none", secure=True, path='/', httponly=True)
                response.set_cookie(key="expiretoken", value=new_expire_time, samesite="none", secure=True, path='/', httponly=True)

            except Exception as e:
                # Catch specific exceptions and handle them appropriately
                 raise HTTPException(status_code=401, detail="Failed to refresh access token") from e
        else:
          # sending error response as the token is expired
          raise HTTPException(status_code=401, detail="Access token is expired or invalid")

    try:
        if not home.messages:
            raise HTTPException(status_code=400, detail="Empty value")

        # For dummy purpose
        answer = home.messages
        generation = []

        # Call the custom function to generate a response using RetrievalQA
        # answer, generation = generate_response(home.messages)

        # Updating the database
        # Find the user document in the collection based on the email
        user_document = collection.find_one({"email": home.email})

        if user_document:
            # Iterate through message lists to find the one with the specified messageId
            for message_list in user_document["messages"]:
                if message_list["_id"] == home.messageId:
                    # Append the response_string to the messageList array
                    message_list["messageList"].insert(0,{"isUser": True, "text": home.messages})
                    message_list["messageList"].insert(0,{"isUser": False, "text": answer,"reasoning" : generation, "feedback": 0 })
                    break

            # Update the user document in the collection
            collection.update_one({"email": home.email}, {"$set": {"messages": user_document["messages"]}})

        return {"response": answer, "reasoning": generation}
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")



# Run the application using ngrok

# if __name__ == "__main__":
#     import nest_asyncio

#     ngrok_tunnel = ngrok.connect(8001)
#     print('Public URL:', ngrok_tunnel.public_url)

#     nest_asyncio.apply()
#     import uvicorn
#     uvicorn.run(app, port=8001)
