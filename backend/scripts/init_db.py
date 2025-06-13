import os
import yaml
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy import delete
from backend.db.models.question import QuestionTag, QuestionGroup, Question, QuestionTagAssociation
from backend.db.models.user_question import QuestionTimeTable, UserTimeTable 
from backend.db.models.user_answer import Comment, UserAnswer
from backend.db import Base
from backend.db.models.user import User
from backend.enums.question import QuestionType

# --- 1️⃣ Load .env ---
POSTGRE_URL = os.getenv("POSTGRE_URL")
if not POSTGRE_URL:
    raise ValueError("POSTGRE_URL is not set in .env file")

# Optional: if using container hostname like '@db', replace with localhost:
POSTGRE_URL = POSTGRE_URL.replace("@db", "@localhost")

# --- 2️⃣ Create async engine and sessionmaker ---
engine = create_async_engine(POSTGRE_URL, echo=True, future=True)
async_session_maker = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

# --- 3️⃣ Load YAML ---
def load_yaml(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f)

# --- 4️⃣ Main async function ---
async def main():
    # Optional: ensure DB tables exist (uncomment if needed)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_maker() as session:
        # --- 5️⃣ Delete Data in Proper Order ---
        await session.execute(delete(Comment))
        await session.execute(delete(UserAnswer))
        await session.execute(delete(QuestionTimeTable))
        await session.execute(delete(UserTimeTable))
        await session.execute(delete(QuestionTagAssociation))
        await session.execute(delete(Question))
        await session.execute(delete(QuestionGroup))
        await session.execute(delete(QuestionTag))
        await session.commit()

        # --- 6️⃣ Load YAML and Insert Data ---
        data = load_yaml("seed_data.yaml")

        # Insert tags
        tag_map = {}
        for tag_data in data.get("tags", []):
            tag = QuestionTag(name=tag_data["name"])
            session.add(tag)
            tag_map[tag.name] = tag

        # Insert groups
        group_map = {}
        for group_data in data.get("groups", []):
            group = QuestionGroup(
                name=group_data["name"],
                description=group_data.get("description")
            )
            session.add(group)
            group_map[group.name] = group

        await session.flush()  # Ensures tags/groups get IDs

        # Insert questions
        for question_data in data.get("questions", []):
            # Convert type to enum
            try:
                question_type = QuestionType(question_data["type"])
            except ValueError:
                raise ValueError(f"Invalid QuestionType: {question_data['type']}")

            group = group_map.get(question_data.get("group"))
            tags = [tag_map[name] for name in question_data.get("tags", [])]

            question = Question(
                prompt=question_data["prompt"],
                title=question_data.get("title"),
                type=question_type,
                options=question_data.get("options"),
                example_answer=question_data.get("example_answer"),
                group=group,
                tags=tags,
                meta=question_data.get("meta")
            )
            session.add(question)

        await session.commit()

    await engine.dispose()
    print("✅ Database initialized successfully!")

if __name__ == "__main__":
    asyncio.run(main())
