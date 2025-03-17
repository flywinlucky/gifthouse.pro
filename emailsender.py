import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import sys

# Configurare email
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL_SENDER = "flystudiosgames@gmail.com"
EMAIL_PASSWORD = "czjp lbxj hwfu jnuu"

# Get receiver email and game link from command-line arguments
if len(sys.argv) != 3:
    print("Usage: python emailsender.py <receiver_email> <game_link>")
    sys.exit(1)

EMAIL_RECEIVER = sys.argv[1]
GAME_LINK = sys.argv[2]

# Creare mesaj
subject = "🕹️ Jocul Tău Personalizat Este Gata!"
body = f"""Mulțumim că ai ales serviciul nostru pentru a crea un joc personalizat! Jocul tău este acum gata și îl poți accesa imediat folosind linkul de mai jos:

🎮 Joacă acum: {GAME_LINK}

Poți distribui acest link prietenilor sau persoanei pentru care ai creat jocul.

Dacă ai întrebări sau ai nevoie de suport, nu ezita să ne contactezi.

Distracție plăcută! 🎉

Cu drag Echipa Fly Studios Games 😊
"""

msg = MIMEMultipart()
msg["From"] = EMAIL_SENDER
msg["To"] = EMAIL_RECEIVER
msg["Subject"] = subject
msg.attach(MIMEText(body, "plain"))

try:
    # Conectare la server
    server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
    server.starttls()
    server.login(EMAIL_SENDER, EMAIL_PASSWORD)
    server.sendmail(EMAIL_SENDER, EMAIL_RECEIVER, msg.as_string())
    server.quit()
    print("Email sent successfully!")
except Exception as e:
    print(f"Error sending email: {e}")
