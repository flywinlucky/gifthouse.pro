<?php
// Preia datele trimise prin POST
$order_id = $_POST['order_id'];
$amount = $_POST['amount'];
$status = $_POST['status'];
$signature = $_POST['signature'];

// Cheia secretă pe care o ai în contul FreeKassa (Secret Word 1)
$secret_key = "A2^NvFJm]c6]!m8"; // Secret Word 1

// Calculează semnătura pentru validarea datelor
$calculated_signature = md5($order_id . ':' . $amount . ':' . $status . ':' . $secret_key);

// Verifică dacă semnătura este validă
if ($signature == $calculated_signature) {
    // Procesați plata (marcă plata ca fiind acceptată/confirmată)
    if ($status == "success") {
        // Cod pentru procesarea plății reușite
        // De exemplu, actualizează statusul comenzii în baza de date
    } else {
        // Cod pentru procesarea plății eșuate
    }
} else {
    // Semnătura nu se potrivește, posibil un atac
    // Tratează cazul corespunzător
}
?>
