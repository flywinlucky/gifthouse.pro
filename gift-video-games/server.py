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
RESOURCES_DIR = "data/orders"
os.makedirs(RESOURCES_DIR, exist_ok=True)

# Function to generate a unique ID for each order
def generate_unique_id():
    return ''.join(random.choices(string.digits, k=15))

# Function to handle Telegram connection and events
def connect_to_telegram():
    with TelegramClient('session_name', api_id, api_hash) as client:
        client.start(phone_number)

        print("Telegram client is running. Listening for events...")

        @client.on(events.NewMessage(chats=bot_username))
        async def handle_new_message(event):
            try:
                # Extract message text and validate JSON format
                message_text = event.message.text
                try:
                    order_data = json.loads(message_text)
                except json.JSONDecodeError:
                    print("Invalid JSON format in the message.")
                    return

                # Ensure required fields are present
                name = order_data.get("name")
                email = order_data.get("email")
                if not name or not email:
                    print("Missing required fields: 'name' or 'email'.")
                    return

                # Generate a unique ID for the order
                order_id = generate_unique_id()
                order_folder = os.path.join(RESOURCES_DIR, f"GID_{order_id}")
                os.makedirs(order_folder, exist_ok=True)

                # Save the JSON data to a file
                filtered_order_data = {
                    "id": order_id,
                    "name": name,
                    "email": email
                }
                json_file_path = os.path.join(order_folder, f"{order_id}.json")
                with open(json_file_path, "w") as json_file:
                    json.dump(filtered_order_data, json_file, indent=4)

                # Save the photo if it exists
                if event.message.media and isinstance(event.message.media, MessageMediaPhoto):
                    photo_filename = secure_filename(f"{order_id}.jpg")
                    photo_file_path = os.path.join(order_folder, photo_filename)
                    await client.download_media(event.message.media, file=photo_file_path)
                    print(f"Photo saved at: {photo_file_path}")

                # Log success
                print(f"New Order Received: ID {order_id}")
                print(json.dumps(filtered_order_data, indent=4))
                print(f"Order successfully saved in folder: {order_folder}")

            except Exception as e:
                # Log failure
                print(f"Failed to process the order: {e}")

        client.run_until_disconnected()

# Main function to start the server
def main():
    connect_to_telegram()

if __name__ == '__main__':
    main()