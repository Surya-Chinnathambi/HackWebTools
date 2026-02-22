"""
MongoDB Database Connection
"""

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Optional
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)


class MongoDB:
    """MongoDB connection manager"""
    
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None
    
    async def connect(self):
        """Connect to MongoDB"""
        try:
            self.client = AsyncIOMotorClient(
                settings.mongodb_url,
                maxPoolSize=10,
                minPoolSize=1,
                serverSelectionTimeoutMS=5000
            )
            
            # Verify connection
            await self.client.admin.command('ping')
            
            self.db = self.client[settings.DATABASE_NAME]
            logger.info(f"✅ Connected to MongoDB database: {settings.DATABASE_NAME}")
            
        except Exception as e:
            logger.error(f"❌ Failed to connect to MongoDB: {e}")
            raise
    
    async def close(self):
        """Close MongoDB connection"""
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed")
    
    def get_database(self) -> AsyncIOMotorDatabase:
        """Get database instance"""
        if not self.db:
            raise Exception("Database not initialized. Call connect() first.")
        return self.db


# Global database instance
mongodb = MongoDB()


async def connect_to_mongo():
    """Connect to MongoDB on startup"""
    await mongodb.connect()


async def close_mongo_connection():
    """Close MongoDB connection on shutdown"""
    await mongodb.close()


def get_database() -> AsyncIOMotorDatabase:
    """Dependency for getting database in routes"""
    return mongodb.get_database()
