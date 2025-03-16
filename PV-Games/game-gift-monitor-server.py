import os
from telethon.sync import TelegramClient
from telethon import events

# Telegram API credentials
api_id = '23597052'  # Replace with your api_id
api_hash = 'd3481a88223f602c6cb3f0757daff693'  # Replace with your api_hash
phone_number = '+37360535689'  # Replace with your phone number
bot_username = '@gamegiftorders_bot'  # Replace with your bot's username

# Main function to keep the script running as a server
def main():
    # Connect to Telegram
    with TelegramClient('session_name', api_id, api_hash) as client:
        client.start(phone_number)

        print("Telegram client is running. Listening for events...")

        # Event handler for new messages in the bot
        @client.on(events.NewMessage(chats=bot_username))
        async def handle_new_message(event):
            print("New order received!")
            print(f"Message content: {event.message.text}")

        # Keep the client running
        client.run_until_disconnected()

if __name__ == '__main__':
    main()
