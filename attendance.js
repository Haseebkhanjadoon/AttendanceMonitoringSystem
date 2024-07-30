
document.addEventListener('DOMContentLoaded', (event) => {
    fetchAttendanceData();
    document.getElementById('checkInOutButton').addEventListener('click', handleCheckInOut);
});

function handleCheckInOut() {
    const button = document.getElementById('checkInOutButton');
    const action = button.innerText === 'Check In' ? 'checkin' : 'checkout';

    const payload = {
        employee_id: "78",
        action: action
    };

    fetch('http://192.168.10.250/attendance/attendapi.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Response:', data);
            if (data.message === 'Success') {
                button.innerText = action === 'checkin' ? 'Check Out' : 'Check In';
                fetchAttendanceData();
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function fetchAttendanceData() {
    fetch('http://192.168.10.250/attendance/attendapi.php', {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            console.log('Fetched Data:', data);
            const tableBody = document.getElementById('attendanceTableBody');
            tableBody.innerHTML = '';

            if (data.length > 0) {
                const row = data[0];
                const tr = document.createElement('tr');

                const dateTd = document.createElement('td');
                dateTd.innerText = row.date;
                tr.appendChild(dateTd);

                const checkInTd = document.createElement('td');
                checkInTd.innerText = row.check_in_time;
                tr.appendChild(checkInTd);

                const checkOutTd = document.createElement('td');
                checkOutTd.innerText = row.check_out_time;
                tr.appendChild(checkOutTd);

                const totalHoursTd = document.createElement('td');
                totalHoursTd.innerText = row.total_hours;
                tr.appendChild(totalHoursTd);

                const hoursLeftTd = document.createElement('td');
                hoursLeftTd.innerText = row.hours_left;
                tr.appendChild(hoursLeftTd);

                const statusTd = document.createElement('td');
                statusTd.innerText = row.status;
                tr.appendChild(statusTd);

                tableBody.appendChild(tr);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


document.querySelector('.logout').addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = 'index.html';
});

const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
if (loggedInUserEmail) {
    const username = loggedInUserEmail.toUpperCase().split('@')[0];
    const profileElement = document.querySelector('.profile span');
    profileElement.textContent = username;
}

const loggedInUserEmail2 = localStorage.getItem('loggedInUserEmail');
if (loggedInUserEmail) {
    const username = loggedInUserEmail.split('@')[0];
    const monthElement = document.querySelector('#month');
    const nameElement = document.querySelector('#name');
    nameElement.textContent = `${username.toUpperCase()} - `;
}
document.querySelector('.logout').addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = 'index.html';
});
async function fetchData() {
    try {
        const response = await fetch('http://192.168.10.250/attendance/fetch.php');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

function filterByMonth(data, month) {
    return data.filter(item => {
        const itemMonth = new Date(item.date).toLocaleString('default', { month: 'long' });
        return itemMonth === month;
    });
}

function updateTable(data) {
    const tableBody = document.getElementById('monthlyAttendanceTableBody');
    tableBody.innerHTML = '';



    if (data.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="9">No data available for the selected month</td>';
        tableBody.appendChild(row);
    } else {
        data.forEach(item => {
            const isComplete = parseFloat(item.total_hours) >= 8;
            const present = isComplete ? 'Present' : '-';
            const absent = isComplete ? '-' : 'Absent';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.employee_name}</td>
                <td>${item.date}</td>
                <td>${item.check_in_time}</td>
                <td>${item.check_out_time}</td>
                <td>${item.total_hours}</td>
                <td>${present}</td>
                <td>${absent}</td>
                <td>${item.hours_left}</td>
                <td>${item.status}</td>
            `;
            tableBody.appendChild(row);
        });
    }
}

async function handleMonthChange() {
    const selectedMonth = document.getElementById('monthDropdown').value;
    const data = await fetchData();
    const filteredData = selectedMonth ? filterByMonth(data, selectedMonth) : [];
    updateTable(filteredData);
}

document.getElementById('monthDropdown').addEventListener('change', handleMonthChange);
document.getElementById('filterrecord').addEventListener('click', handleMonthChange);
document.addEventListener('DOMContentLoaded', handleMonthChange);




document.addEventListener('DOMContentLoaded', () => {

    fetch('http://192.168.10.250/attendance/fetch.php')
        .then(response => response.json())
        .then(data => {
            let weeklyTotalHours = 0;
            let monthlyTotalHours = 0;
            let yearlyTotalHours = 0;

            let weeklyAbsentDays = 0;
            let monthlyAbsentDays = 0;
            let yearlyAbsentDays = 0;

            data.forEach(record => {
                let date = new Date(record.date);

                let today = new Date();
                let oneWeekAgo = new Date();
                oneWeekAgo.setDate(today.getDate() - 7);
                let oneMonthAgo = new Date();
                oneMonthAgo.setMonth(today.getMonth() - 1);
                let oneYearAgo = new Date();
                oneYearAgo.setFullYear(today.getFullYear() - 1);
                if (date >= oneWeekAgo) {
                    weeklyTotalHours += parseFloat(record.total_hours);
                    if (parseFloat(record.total_hours) < 8) {
                        weeklyAbsentDays += 1;
                    }
                }
                if (date >= oneMonthAgo) {
                    monthlyTotalHours += parseFloat(record.total_hours);
                    if (parseFloat(record.total_hours) < 8) {
                        monthlyAbsentDays += 1;
                    }
                }
                if (date >= oneYearAgo) {
                    yearlyTotalHours += parseFloat(record.total_hours);
                    if (parseFloat(record.total_hours) < 8) {
                        yearlyAbsentDays += 1;
                    }
                }
            });

            const dailyHours = 8;

            let weeklyHoursLeft = 7 * dailyHours - weeklyTotalHours;
            let monthlyHoursLeft = 30 * dailyHours - monthlyTotalHours;
            let yearlyHoursLeft = 365 * dailyHours - yearlyTotalHours;

            // Update the UI
            document.getElementById('weeklyTotalHours').textContent = weeklyTotalHours.toFixed(2);
            document.getElementById('weeklyHoursLeft').textContent = weeklyHoursLeft.toFixed(2);
            document.getElementById('weeklyTotalAbsent').textContent = weeklyAbsentDays;

            document.getElementById('monthlyTotalHours').textContent = monthlyTotalHours.toFixed(2);
            document.getElementById('monthlyHoursLeft').textContent = monthlyHoursLeft.toFixed(2);
            document.getElementById('monthlyTotalAbsent').textContent = monthlyAbsentDays;

            document.getElementById('yearlyTotalHours').textContent = yearlyTotalHours.toFixed(2);
            document.getElementById('yearlyHoursLeft').textContent = yearlyHoursLeft.toFixed(2);
            document.getElementById('yearlyTotalAbsent').textContent = yearlyAbsentDays;
        })
        .catch(error => console.error('Error fetching data:', error));
});