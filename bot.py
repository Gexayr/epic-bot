import os
import json
import openai
import telegram
from datetime import datetime
from apscheduler.schedulers.blocking import BlockingScheduler

# Env vars
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
CHAT_ID = os.getenv("CHAT_ID")

# Setup
bot = telegram.Bot(token=TELEGRAM_TOKEN)
openai.api_key = OPENAI_API_KEY
print("🟢 Запуск job()")
# Load principles
with open("principles.json", "r", encoding="utf-8") as f:
    principles_data = json.load(f)

def generate_prompt():
    themes = [
        "a medieval knight", "a warrior on a mountain", "a stoic philosopher",
        "a man protecting his family", "a modern samurai", "a lone guardian in the storm",
        "a titan standing over ruins", "a sacred oath in firelight", "epic sunrise warrior",
        "a hero facing destiny"
    ]
    index = datetime.now().day % len(themes)
    return f"An epic cinematic image of {themes[index]} in high contrast, dramatic lighting."

def generate_image_url(prompt):
    response = openai.images.generate(
        model="dall-e-3",         # Или "dall-e-2", если у тебя нет доступа к 3
        prompt=prompt,
        n=1,
        size="1024x1024"
    )
    return response.data[0].url

def get_principles():
    day = ((datetime.now().day - 1) % 10) + 1
    list_text = "\n".join([f"{i+1}. {p}" for i, p in enumerate(principles_data[str(day)])])
    return f"🧭 *Принципы дня #{day}*\n{list_text}"

def job():
    print("🟢 Запуск job()")
    print("✅ Функция job вызвана")
    bot.send_message(chat_id=CHAT_ID, text="⚙️ Тест каждую минуту")
    prompt = generate_prompt()
    image_url = generate_image_url(prompt)
    text = get_principles()

    bot.send_photo(chat_id=CHAT_ID, photo=image_url, caption=text, parse_mode=telegram.constants.ParseMode.MARKDOWN)

# Schedule
scheduler = BlockingScheduler()
#scheduler.add_job(job, 'cron', hour=9)
scheduler.add_job(job, 'interval', minutes=1)
print("🔁 Планировщик запущен")
scheduler.start()
