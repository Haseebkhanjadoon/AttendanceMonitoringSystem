document.addEventListener('DOMContentLoaded', function () {
    const ctxDonut = document.getElementById('myDonutChart').getContext('2d');
    const dataDonut = {
        labels: ['Total Hours', 'Remaining Hours'],
        datasets: [{
            data: [8, 4],
            backgroundColor: ['#FF6384', '#36A2EB'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB']
        }]
    };

    const configDonut = {
        type: 'doughnut',
        data: dataDonut,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true }
            }
        }
    };

    const myDonutChart = new Chart(ctxDonut, configDonut);

    function updateLabels() {
        const hourLabelsDiv = document.getElementById('hourLabels');
        const colors = dataDonut.datasets[0].backgroundColor;
        const labels = dataDonut.labels;
        const data = dataDonut.datasets[0].data;

        hourLabelsDiv.innerHTML = labels.map((label, index) =>
            `<span style="color: ${colors[index]};">${label}: ${data[index]}</span>`
        ).join(' | ');
    }

    updateLabels();

    document.getElementById('thisWeekDropdown').addEventListener('change', (event) => {
        const selectedValue = event.target.value;
        let totalHours = 8;
        let remainingHours = 2;

        switch (selectedValue) {
            case 'thisWeek':
                totalHours = 8;
                remainingHours = 2;
                break;
            case 'lastWeek':
                totalHours = 7;
                remainingHours = 3;
                break;
            case '2weeksAgo':
                totalHours = 6;
                remainingHours = 4;
                break;
        }

        dataDonut.datasets[0].data = [totalHours, remainingHours];
        myDonutChart.update();
        updateLabels();
    });

    const ctxBar = document.getElementById('myBarChart').getContext('2d');
    let dataBar = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'Sep , Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Monthly Hours',
            data: [50, 60, 70, 180, 190, 220, 240],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    const configBar = {
        type: 'bar',
        data: dataBar,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 50 },
                    title: { display: true, text: 'Hours' }
                },
                x: { title: { display: true, text: 'Dates' } }
            },
            plugins: {
                legend: { display: true, position: 'top' },
                tooltip: { enabled: true }
            }
        }
    };

    let myBarChart = new Chart(ctxBar, configBar);

    document.getElementById('last7DaysDropdown').addEventListener('change', (event) => {
        const selectedValue = event.target.value;

        switch (selectedValue) {
            case 'last7Days':
                dataBar.labels = ['July 5', 'July 6', 'July 7', 'July 8', 'July 9', 'July 10', 'July 11'];
                dataBar.datasets[0].data = [3, 5, 2, 7, 4, 6, 8];
                break;
            case 'last14Days':
                dataBar.labels = ['July 1', 'July 2', 'July 3', 'July 4', 'July 5', 'July 6', 'July 7', 'July 8', 'July 9', 'July 10', 'July 11', 'July 12', 'July 13', 'July 14'];
                dataBar.datasets[0].data = [3, 4, 2, 5, 6, 7, 3, 5, 2, 7, 4, 6, 8, 5];
                break;
            case 'last30Days':
                dataBar.labels = Array.from({ length: 30 }, (v, k) => `June ${k + 1}`);
                dataBar.datasets[0].data = Array.from({ length: 30 }, () => Math.floor(Math.random() * 10) + 1);
                break;
        }

        myBarChart.update();
    });
});

