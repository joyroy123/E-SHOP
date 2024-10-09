"use client";

import {Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend} from "chart.js";
import { Bar } from "react-chartjs-2";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarGraph = ({data}) => {

    const labels = data.map(item => item.day);
    const amounts = data.map(item => item.totalAmount);

    const chatData = {
        labels: labels,
        datasets: [
            {
                label: "Sale Amonut",
                data: amounts,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1
            }
        ]
    }


    const options = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }

    return ( 
        <Bar data={chatData} options={options}></Bar>
    );
}
 
export default BarGraph;