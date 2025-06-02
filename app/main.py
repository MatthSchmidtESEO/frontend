from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import User, UserCreate

app = FastAPI()

# Middleware CORS pour permettre au frontend (React, par exemple) d'accéder à l'API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # À restreindre en prod (ex: ["http://localhost:3000"])
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Base de données simulée (liste)
db_users = [{
    "name": "Matthieu schmidt",
    "email": "matthieu.schmidt@gmail.com",
    "id": 1
  }, {
    "name": "John Doe",
    "email": "John.doe@gmail.com",
    "id": 2
  }]

@app.get("/users", response_model=list[User])
def get_users():
    return db_users

@app.post("/users", response_model=User)
def create_user(user: UserCreate):
    new_user = {"id": len(db_users) + 1, **user.dict()}
    db_users.append(new_user)
    return new_user

@app.delete("/users/{user_id}", response_model=User)
def delete_user(user_id: int):
    for user in db_users:
        if user["id"] == user_id:
            db_users.remove(user)
            return user
    raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
