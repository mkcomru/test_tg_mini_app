from backend.app.database.connection import init_db, close_db 


import asyncio

if __name__ == "__main__":
    asyncio.run(init_db())



