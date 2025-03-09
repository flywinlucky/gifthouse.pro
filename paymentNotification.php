<?php
// Configurația FreeKassa
$merchant_id = "60399"; // ID-ul magazinului tău
$api_key = "7c919a108aa71a06fc09ef08e9edc9bf"; // Merchant API Key din FreeKassa

// ID-ul comenzii pe care vrei să o verifici (poate veni dintr-un formular sau din baza de date)
$transaction_id = $_GET["order_id"] ?? ''; // Poți transmite acest ID prin URL

if (!$transaction_id) {
    die(json_encode(["error" => "Lipsește ID-ul tranzacției"]));
}

// Creăm URL-ul API pentru verificare
$url = "https://api.freekassa.ru/v1/orders/$transaction_id";

// Setăm header-ul pentru autentificare
$headers = [
    "Content-Type: application/json",
    "Authorization: Bearer $api_key"
];

// Inițializăm cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

// Executăm cererea API
$response = curl_exec($ch);
curl_close($ch);

// Procesăm răspunsul
$data = json_decode($response, true);

if (isset($data['order_status']) && $data['order_status'] == 'success') {
    echo json_encode(["status" => "success", "message" => "Plata a fost confirmată"]);
} else {
    echo json_encode(["status" => "pending", "message" => "Plata nu a fost încă procesată"]);
}
?>
