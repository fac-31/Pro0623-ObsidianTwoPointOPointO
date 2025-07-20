"""FastAPI server for F.L.A.T application, handling welcome conversations and preference management."""

import asyncio
# from concurrent.futures import ThreadPoolExecutor
# from typing import List, Dict, Any
# from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from world_build import build_world
import uvicorn
# from user_preferences import run_welcome_conversation, update_house_preferences
import httpx
import os

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

@app.get("/api/test")
async def test_route():
    return {"status": "ok", "message": "Python server is running!"}

@app.post("/api/build")
async def build_route(world):
    build_world(world)
    return {"statsus": "ok", "message": f"{world} has been built"}

if __name__ == "__main__":
    print("Starting World Builder server in API mode...")
    port = int(os.getenv("PORT", 8001))
    # Disable reload in production and use 0.0.0.0 as host
    uvicorn.run(
        "server:app",
        host="http://localhost",  # Changed from localhost to 0.0.0.0
        port=port       # Use PORT from environment
             # Disable reload in production
    ) 