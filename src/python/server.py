"""FastAPI server for F.L.A.T application, handling welcome conversations and preference management."""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from world_build import build_world
import uvicorn

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


class World(BaseModel):
    """ Model representing a world to be built. """
    world_id: str

@app.get("/api/test")
async def test_route():
    """ Endpoint to test if the server is running. """
    return {"status": "ok", "message": "Python server is running!"}

@app.post("/api/build")
async def build_route(world: World):
    """ Endpoint to trigger world building process. """
    print(f"Building world: {world.world_id}")
    build_world(world.world_id)
    return {"status": "ok", "message": "world has been built"}

if __name__ == "__main__":
    print("Starting World Builder server in API mode...")
    port = int(os.getenv("PYTHON_SERVER_PORT") or 8001)
    # Disable reload in production and use 0.0.0.0 as host
    uvicorn.run(
        "server:app",
        host="localhost",  # Changed from localhost to 0.0.0.0
        port=port       # Use PORT from environment
             # Disable reload in production
    ) 