from pydantic import BaseModel

# Ce schéma est utilisé pour la création d'un utilisateur (ce que le frontend envoie)
class UserCreate(BaseModel):
    name: str
    email: str

# Ce schéma est utilisé pour la réponse (ce que l'API renvoie)
class User(BaseModel):
    id: int
    name: str
    email: str
