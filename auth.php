<?php
// Check all possible locations
echo "1. getenv: " . getenv('EVE_CLIENT_SECRET') . "<br>";
echo "2. $_SERVER: " . ($_SERVER['EVE_CLIENT_SECRET'] ?? 'Not found') . "<br>";
echo "3. $_ENV: " . ($_ENV['EVE_CLIENT_SECRET'] ?? 'Not found') . "<br>";
?>