<?php
ini_set('display_errors', 1);  // Afișează erorile pentru debugging

// Detalii pentru Merchant
$merchant_id = '60399';  // ID-ul tău de merchant
$api_key = '7c919a108aa71a06fc09ef08e9edc9bf';  // Cheia ta API

// Freekassa trimite informații prin metoda GET sau POST
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // Preia parametrii GET din URL
    $order_id = $_GET['order_id']; // Exemplu de parametru
    $status = $_GET['status']; // Statusul plății
    $signature = $_GET['signature']; // Semnătura trimisă de Freekassa

    // Crează semnătura locală pentru a o compara cu semnătura trimisă
    $data = $merchant_id . ':' . $order_id . ':' . $status . ':' . $api_key;
    $local_signature = md5($data);  // Crează semnătura folosind cheia API

    // Verifică dacă semnătura este validă
    if ($signature == $local_signature) {
        // Semnătura este validă, procesăm notificarea

        if ($status == 'success') {
            // Plata a fost procesată cu succes
            // Poți actualiza baza de date sau trimite notificări
            // Redirecționează utilizatorul către o pagină de succes
            header('Location: https://gifthouse.pro/paymentSuccessful.html');
            exit();
        } else {
            // Plata a eșuat
            // Poți actualiza baza de date sau trimite notificări
            // Redirecționează utilizatorul către o pagină de eșec
            header('Location: https://gifthouse.pro/paymentFailed.html');
            exit();
        }
    } else {
        // Semnătura nu este validă
        echo "Semnătura este invalidă. Posibilă tentativă de fraudă.";
    }
} else {
    // Metodă diferită decât GET
    echo "Metoda de notificare nu este acceptată.";
}
?>
