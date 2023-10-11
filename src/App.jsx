import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./App.css";
import html2canvas from "html2canvas";
import Report from "./Components/Report";
import { Line } from "react-chartjs-2";
import jsPDF from "jspdf";

function App() {
  const [data, setData] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [loading, setloading] = useState(false);
  const chartRef = useRef(null);

  const generateReport = async () => {
    setloading(true);
    await axios
      .get(
        "https://api.usa.gov/crime/fbi/cde/arrest/state/AK/all?from=2015&to=2020&API_KEY=iiHnOKfno2Mgkt5AynpvPpUQTEyxE77jo1RU8PIv"
      )
      .then((response) => {
        setData(response.data);
        if (response.data.data.length > 0) {
          setReportData(response.data.data);
          setTimeout(() => {
            const capture = chartRef.current;
            html2canvas(capture).then((canvas) => {
              const imgData = canvas.toDataURL("image/png");
              const doc = new jsPDF("p", "mm", "a4");
              const componentWidth = doc.internal.pageSize.getWidth();
              const imgWidth = componentWidth;
              const imgHeight = (canvas.height * imgWidth) / canvas.width;

              doc.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
              doc.save("report.pdf");
              setloading(false);
            });
          }, 1500);
        }
      });
  };

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "crime",
        data: [],
        barPercentage: 0.9,
      },
    ],
  });
  useEffect(() => {
    console.log(chartData.datasets[0].data.length > 0, "s");
    if (reportData.length > 0) {
      setChartData({
        labels: reportData.map((data) => data.data_year),
        datasets: [
          {
            label: "crime",
            data: reportData.map((data) => data.Burglary),
            barPercentage: 0.9,
          },
        ],
      });
    }
  }, [reportData]);
  const verticalLineStyle = {
    width: "100%",
    height: "2.5px",
    backgroundColor: "blue",
    margin: "3px",
  };
  const crimeLine = {
    width: "100%",
    height: "1.5px",
    backgroundColor: "blue",
    margin: "3px",
  };
  return (
    <>
      <div className="bg-red-200">
        {loading ? (
          <>
            <h1
              style={{
                color: "black",
                fontSize: "15px",
              }}
            >
              Generating Reports
            </h1>
          </>
        ) : (
          ""
        )}
        <button
          style={{
            color: "white",
          }}
          onClick={() => {
            generateReport();
          }}
        >
          Print
        </button>
        <div
          style={{
            opacity: "0",
            position: "absolute",
          }}
        >
          <div ref={chartRef} className="chart">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "5px",
                padding: "10px",
              }}
            >
              <div>RealAssist.Ai</div>
              <div
                style={{
                  fontWeight: "bold",
                }}
              >
                122 Main Street,Dover ,NH 03820-487
              </div>
            </div>
            <div style={verticalLineStyle}></div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px",
              }}
            >
              <div>Crime</div>
              <div style={crimeLine}></div>
            </div>
            <Line
              style={{
                width: "700px",
              }}
              data={chartData}
            />

            <div>
              <div
                style={{
                  width: "100%",
                  height: "1.5px",
                  backgroundColor: "blue",
                  marginTop: "510px",
                }}
              ></div>
              <div
                style={{
                  display: "flex",
                  gap: "5px",
                  marginTop: "10px",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    color: "blue",
                    fontWeight: "bold",
                  }}
                >
                  Report Generated on Septemper 26,2023
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  RealAssistProperty Report | Page 1 of 25
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
