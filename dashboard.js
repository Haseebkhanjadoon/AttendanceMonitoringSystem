
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