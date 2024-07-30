<?php
header("Content-Type: application/json");
include 'config.php';
include('header.php');

// Check if the request method is GET
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $sql = "SELECT * FROM employe_attendance";
    $result = $conn->query($sql);
    
    $data = array();
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }
    
    echo json_encode($data);
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(array("error" => "Method Not Allowed"));
}
?>
