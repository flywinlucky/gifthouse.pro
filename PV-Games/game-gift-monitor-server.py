import os
import json
from telethon.sync import TelegramClient
from telethon import events
from telethon.tl.types import MessageMediaPhoto
from werkzeug.utils import secure_filename
import random
import string

# Telegram API credentials
api_id = '23597052'  # Replace with your api_id
api_hash = 'd3481a88223f602c6cb3f0757daff693'  # Replace with your api_hash
phone_number = '+37360535689'  # Replace with your phone number
bot_username = '@gamegiftorders_bot'  # Replace with your bot's username

# Directory to store orders
RESOURCES_DIR = "Resources"
os.makedirs(RESOURCES_DIR, exist_ok=True)

# Function to generate a unique ID for each order
def generate_unique_id():
    return ''.join(random.choices(string.digits, k=15))

# Main function to keep the script running as a server
def main():
    # Connect to Telegram
    with TelegramClient('session_name', api_id, api_hash) as client:
        client.start(phone_number)

        print("Telegram client is running. Listening for events...")

        # Event handler for new messages in the bot
        @client.on(events.NewMessage(chats=bot_username))
        async def handle_new_message(event):
            try:
                # Extract JSON data from the message text
                message_text = event.message.text
                order_data = json.loads(message_text)

                # Generate a unique ID for the order
                order_id = generate_unique_id()
                order_folder = os.path.join(RESOURCES_DIR, f"GID_{order_id}")
                os.makedirs(order_folder, exist_ok=True)

                # Save the JSON data to a file
                order_data["id"] = order_id  # Add the generated ID to the JSON data
                json_file_path = os.path.join(order_folder, f"{order_id}.json")
                with open(json_file_path, "w") as json_file:
                    json.dump(order_data, json_file, indent=4)

                # Save the photo if it exists
                if event.message.media and isinstance(event.message.media, MessageMediaPhoto):
                    photo_filename = secure_filename(order_data["url"])
                    photo_file_path = os.path.join(order_folder, photo_filename)
                    await client.download_media(event.message.media, file=photo_file_path)
                    print(f"Photo saved at: {photo_file_path}")

                # Log success
                print(f"New Order Received: ID {order_id}")
                print(json.dumps(order_data, indent=4))
                print(f"Order successfully saved in folder: {order_folder}")

            except Exception as e:
                # Log failure
                print(f"Failed to process the order: {e}")

        # Keep the client running
        client.run_until_disconnected()

if __name__ == '__main__':
    main()
