import os
from telethon.sync import TelegramClient
from telethon import events

# Telegram API credentials
api_id = '23597052'  # Replace with your api_id
api_hash = 'd3481a88223f602c6cb3f0757daff693'  # Replace with your api_hash
phone_number = '+37360535689'  # Replace with your phone number

# Main function to keep the script running as a server
def main():
    # Connect to Telegram
    with TelegramClient('session_name', api_id, api_hash) as client:
        client.start(phone_number)

        print("Telegram client is running. Listening for events...")

        # Example event handler (can be customized as needed)
        @client.on(events.NewMessage)
        async def handle_new_message(event):
            print(f"New message received: {event.message.text}")

        # Keep the client running
        client.run_until_disconnected()

if __name__ == '__main__':
    main()
