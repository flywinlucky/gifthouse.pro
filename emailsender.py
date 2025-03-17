import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Configurare email
SMTP_SERVER = "smtp.gmail.com"  # Server SMTP (ex: Gmail)
SMTP_PORT = 587  # Port SMTP pentru TLS
EMAIL_SENDER = "flystudiosgames@gmail.com"  # Schimbă cu adresa ta de email
EMAIL_PASSWORD = "czjp lbxj hwfu jnuu "  # Înlocuiește cu parola specifică aplicației
EMAIL_RECEIVER = "flycrossmd@gmail.com"  # Destinatar

# Creare mesaj
subject = "🕹️ Jocul Tău Personalizat Este Gata!"
body = """Mulțumim că ai ales serviciul nostru pentru a crea un joc personalizat! Jocul tău este acum gata și îl poți accesa imediat folosind linkul de mai jos:

🎮 Joacă acum: https://gifthouse.pro/Games/G1/?GID=690543087132218

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
    server.starttls()  # Inițiere conexiune securizată
    server.login(EMAIL_SENDER, EMAIL_PASSWORD)  # Autentificare
    server.sendmail(EMAIL_SENDER, EMAIL_RECEIVER, msg.as_string())  # Trimitere email
    server.quit()
    print("Email sent successfully!")
except Exception as e:
    print(f"Error sending email: {e}")
