import { useState, useEffect } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { ArrowDownTrayIcon, ChartBarIcon, ChartPieIcon } from "@heroicons/react/24/solid";
import {getSalesReport, getProductsReport} from "../services/dashboard_api.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);
function AdminReport() {
    const [reportType, setReportType] = useState("sales");
    const [timeRange, setTimeRange] = useState("7days");
    const [data, setData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const salesReport = await getSalesReport();
                const productsReport = await getProductsReport();
                const salesLabels = salesReport.map((item) =>
                    format(new Date(item.dia), "dd/MM/yyyy")
                );
                const salesData = salesReport.map((item) => parseFloat(item.ventas_totales));
                const totalSales = salesData.reduce((acc, curr) => acc + curr, 0);
                const productsLabels = productsReport.map((item) => item.producto);
                const productsData = productsReport.map((item) => parseFloat(item.ventas_totales));
                const totalProductsSold = productsReport.reduce(
                    (acc, curr) => acc + parseInt(curr.cantidad_total_vendida, 10),
                    0
                );

                setData({
                    sales: {
                        labels: salesLabels,
                        datasets: [
                            {
                                label: "Ventas",
                                data: salesData,
                                backgroundColor: "rgba(75, 192, 192, 0.6)",
                            },
                        ],
                        total: totalSales,
                    },
                    products: {
                        labels: productsLabels,
                        datasets: [
                            {
                                data: productsData,
                                backgroundColor: [
                                    "rgba(255, 99, 132, 0.6)",
                                    "rgba(54, 162, 235, 0.6)",
                                    "rgba(255, 206, 86, 0.6)",
                                    "rgba(75, 192, 192, 0.6)",
                                    "rgba(153, 102, 255, 0.6)",
                                ],
                            },
                        ],
                        total: totalProductsSold,
                    },
                });
            } catch (error) {
                console.error("Error fetching report data:", error);
            }
        };

        fetchData();
    }, [timeRange]);

    const downloadReport = () => {
        if (!data) return;
        // Seleccionamos la data según el tipo de reporte
        const currentData = reportType === "sales" ? data.sales : data.products;
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(
            currentData.labels.map((label, index) => ({
                Fecha: label,
                Valor: currentData.datasets[0].data[index],
            }))
        );
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");
        XLSX.writeFile(workbook, `reporte_${reportType}_${timeRange}.xlsx`);
    };

    if (!data) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard de Administración</h1>
                    <button
                        onClick={downloadReport}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
                    >
                        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                        Descargar Reporte
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="reportType" className="block text-sm font-medium text-gray-700">
                                    Tipo de Reporte
                                </label>
                                <select
                                    id="reportType"
                                    value={reportType}
                                    onChange={(e) => setReportType(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="sales">Ventas</option>
                                    <option value="products">Productos</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="timeRange" className="block text-sm font-medium text-gray-700">
                                    Rango de Tiempo
                                </label>
                                <select
                                    id="timeRange"
                                    value={timeRange}
                                    onChange={(e) => setTimeRange(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="7days">Últimos 7 días</option>
                                    <option value="30days">Últimos 30 días</option>
                                </select>
                            </div>

                            <div className="pt-4">
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                                        <ChartBarIcon className="h-5 w-5 mr-2 text-blue-500" />
                                        Ventas Totales
                                    </h3>
                                    <p className="text-2xl font-bold text-blue-600">
                                        ${data.sales.total.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-2">
                                <div className="bg-green-50 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                                        <ChartPieIcon className="h-5 w-5 mr-2 text-green-500" />
                                        Productos Vendidos
                                    </h3>
                                    <p className="text-2xl font-bold text-green-600">
                                        {data.products.total.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                                {reportType === "sales" ? "Ventas por Día" : "Ventas por Producto"}
                            </h2>
                            <div className="h-[400px]">
                                {reportType === "sales" ? (
                                    <Bar
                                        data={data.sales}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    position: "top",
                                                },
                                            },
                                        }}
                                    />
                                ) : (
                                    <Doughnut
                                        data={data.products}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    position: "right",
                                                },
                                            },
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminReport;
