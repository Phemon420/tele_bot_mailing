import os
import requests

BOT_TOKEN = "7721218003:AAE84U0xxgHWKUro0As_OqtQBez0bJxkmW4"
WEBHOOK_URL = "https://warrior-periods-tunes-downloadable.trycloudflare.com/webhook/"
MARKER_FILE = ".telegram_webhook_set"

def set_webhook():
    print(f"Setting webhook to {WEBHOOK_URL}")
    response = requests.get(
        f"https://api.telegram.org/bot{BOT_TOKEN}/setWebhook",
        params={"url": WEBHOOK_URL}
    )
    data = response.json()
    print("Telegram response:", data)

    if response.status_code == 200 and data.get("ok"):
        with open(MARKER_FILE, "w") as f:
            f.write("set")
        print("✅ Webhook successfully set.")
    else:
        print("❌ Failed to set webhook.")

if not os.path.exists(MARKER_FILE):
    set_webhook()
else:
    print("⚠️ Webhook already set. Skipping.")
