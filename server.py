from flask import Flask, request, jsonify
import hashlib

app = Flask(__name__)

# Cheia secretă pe care o ai în contul FreeKassa
SECRET_KEY = "A2^NvFJm]c6]!m8"  # Folosește Secret word 1

# Ruta principală pentru verificarea statusului serverului (optional)
@app.route('/')
def home():
    return "Serverul Flask funcționează!"

# Ruta de notificare a plății
@app.route('/paymentNotification', methods=['POST'])
def payment_notification():
    # Preia datele trimise în POST
    order_id = request.form.get('order_id')
    amount = request.form.get('amount')
    status = request.form.get('status')
    signature = request.form.get('signature')

    # Verifică ce date ai primit pe server
    print("Order ID:", order_id)
    print("Amount:", amount)
    print("Status:", status)
    print("Signature:", signature)

    # Calculează semnătura așteptată
    calculated_signature = hashlib.md5(f"{order_id}:{amount}:{status}:{SECRET_KEY}".encode()).hexdigest()
    print("Calculated Signature:", calculated_signature)

    # Compară semnătura primită cu semnătura calculată
    if signature == calculated_signature:
        if status == 'success':
            return jsonify({"status": "success", "message": "Payment processed successfully!"})
        else:
            return jsonify({"status": "failed", "message": "Payment failed!"})
    else:
        return jsonify({"status": "error", "message": "Invalid signature!"}), 400

if __name__ == '__main__':
    # Rulează serverul pe IP-ul 0.0.0.0 pentru acces extern
    app.run(host='0.0.0.0', port=5000, debug=False)