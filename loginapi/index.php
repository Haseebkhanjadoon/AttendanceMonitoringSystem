<?php
require 'config.php';
require 'vendor/autoload.php';

use \Firebase\JWT\JWT;

// JWT secret key
$secret_key = "your_secret_key";
$algorithm = 'HS256'; // Specify the algorithm

header("Access-Control-Allow-Origin: *"); // Allows all origins (change '*' to specific origin for better security)
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allowed methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); 
header("Access-Control-Max-Age: 3600");

$data = json_decode(file_get_contents("php://input"));

$email = $data->email;
$password = $data->password;
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
if($_SERVER['REQUEST_METHOD'] == 'POST'){
    if (!empty($email) && !empty($password)) {
        $sql = "SELECT id, email, password FROM user WHERE email = ?";
        if ($stmt = mysqli_prepare($conn, $sql)) {
            mysqli_stmt_bind_param($stmt, "s", $email);
    
            if (mysqli_stmt_execute($stmt)) {
                mysqli_stmt_store_result($stmt);
    
                if (mysqli_stmt_num_rows($stmt) == 1) {
                    mysqli_stmt_bind_result($stmt, $id, $email, $hashed_password);
    
                    if (mysqli_stmt_fetch($stmt)) {
                        if (password_verify($password, $hashed_password)) {
                            $token = [
                                // "iss" => "http://yourdomain.com",
                                // "aud" => "http://yourdomain.com",
                                // "iat" => time(),
                                // "nbf" => time(),
                                "data" => [
                                    "id" => $id,
                                    "email" => $email
                                ]
                            ];
    
                            $jwt = JWT::encode($token, $secret_key, $algorithm);
    
                            http_response_code(200);
                            echo json_encode([
                                "jwt" => $jwt,
                                "user" => [
                                    "id" => $id,
                                    "email" => $email
                                ]
                            ]);
                        } else {
                            http_response_code(401);
                            echo json_encode(["message" => "Login failed. Incorrect password."]);
                        }
                    } else {
                        http_response_code(500);
                        echo json_encode(["message" => "Something went wrong."]);
                    }
                } else {
                    http_response_code(401);
                    echo json_encode(["message" => "Login failed. Email not found."]);
                }
            } else {
                http_response_code(500);
                echo json_encode(["message" => "Something went wrong."]);
            }
    
            mysqli_stmt_close($stmt);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data."]);
    }
}
else{
    http_response_code(405);
                    echo json_encode(["message" => "Method not allowed."]);
}



mysqli_close($conn);
?>