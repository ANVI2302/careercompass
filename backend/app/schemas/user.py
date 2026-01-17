from typing import List, Optional
from pydantic import BaseModel, Field

class Skill(BaseModel):
    id: str
    name: str
    level: int = Field(ge=1, le=10) # 1-10 scale
    category: str

class UserBase(BaseModel):
    email: str
    full_name: str
    title: Optional[str] = None

class UserProfile(UserBase):
    id: str
    skills: List[Skill] = []
    # [EDGE:PARTIAL] Flag to indicate if some data could not be fetched
    is_partial_data: bool = False
    details: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    title: Optional[str] = None
    skills: Optional[List[str]] = None


class NotificationSettingsBase(BaseModel):
    email_achievements: bool = True
    email_mentorship: bool = True
    email_courses: bool = True
    email_connections: bool = True
    push_enabled: bool = True


class PrivacySettingsBase(BaseModel):
    profile_public: bool = True
    show_achievements: bool = True
    show_projects: bool = True
    show_skills: bool = True


class UserSettingsResponse(BaseModel):
    notifications: NotificationSettingsBase
    privacy: PrivacySettingsBase

