<?php

require_once('config.php');
require_once('header.php');

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $employee_id = $data['employee_id'];
    $date = date('Y-m-d');
    $time = date('H:i:s');

    if ($data['action'] == 'checkin') {
        $status = 'Checked In';
        $sql = "SELECT * FROM employe_attendance WHERE employee_id='$employee_id' AND date='$date'";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            echo json_encode(["message" => "Already Checked In"]);
            exit();
        } else {
            $sql = "INSERT INTO employe_attendance (employee_id, date, check_in_time, status)
                    VALUES ('$employee_id', '$date', '$time', '$status')";
        }
    } elseif ($data['action'] == 'checkout') {
        $status = 'Checked Out';
        
        // Fetch check-in time
        $result = $conn->query("SELECT check_in_time FROM employe_attendance WHERE employee_id='$employee_id' AND date='$date'");
        if ($result->num_rows == 0) {
            echo json_encode(["message" => "No Check-In found for Check-Out"]);
            exit();
        }
        $row = $result->fetch_assoc();
        $check_in_time = new DateTime($row['check_in_time']);
        $check_out_time = new DateTime($time);
        $interval = $check_in_time->diff($check_out_time);
        $total_hours = $interval->h + ($interval->i / 60);
        $hours_left = 8 - $total_hours; // Assuming 8 hours work day

        $sql = "UPDATE employe_attendance SET check_out_time='$time', total_hours='$total_hours', hours_left='$hours_left', status='$status'
                WHERE employee_id='$employee_id' AND date='$date'";
    } else {
        echo json_encode(["message" => "Invalid action"]);
        exit();
    }

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "Success"]);
    } else {
        echo json_encode(["message" => "Error: " . $conn->error]);
    }
} elseif ($method == 'GET') {
    $date = date('Y-m-d');
    
    // Check if it's a check-in or check-out request
    $checkin_status = isset($_GET['status']) ? $_GET['status'] : null;
    
    if ($checkin_status === 'checkin') {
        // Show only check-in data
        $sql = "SELECT * FROM employe_attendance WHERE date='$date' AND check_in_time IS NOT NULL AND check_out_time IS NULL";
    } else {
        // Show the latest entry for the current date
        $sql = "SELECT * FROM employe_attendance WHERE date='$date' ORDER BY check_in_time DESC LIMIT 1";
    }
    
    $result = $conn->query($sql);

    $attendance_data = [];
    while ($row = $result->fetch_assoc()) {
        $attendance_data[] = $row;
    }

    echo json_encode($attendance_data);
} else {
    echo json_encode(["message" => "Only POST and GET methods are supported"]);
}

$conn->close();
?>
