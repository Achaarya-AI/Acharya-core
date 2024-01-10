from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import your custom functions
from llm import initialize_model, generate_response

app = FastAPI()

class ConfigData(BaseModel):
    class_: str
    subject: str

class UserQuery(BaseModel):
    messages: str

# Enable CORS (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the model once
# initialize_model()

@app.post("/settings")
def config(settings: ConfigData):
    try:
        if not settings.class_ or not settings.subject:
            raise HTTPException(status_code=400, detail="Class and subject are required fields")

        response_string = f"Let me provide you the Syllabus for {settings.class_} - {settings.subject}"
        
        return {"response": response_string, "reasoning": ""}
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/home")
def home_route(home: UserQuery): 
    try:
        if not home.messages:
            raise HTTPException(status_code=400, detail="Empty value")
        
        # Call the custom function to generate a response
        # response = generate_response(home.messages)
        
        # return {"response": response, "reasoning": ""}
        return {"response": home.messages, "reasoning": ""}
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error") 
