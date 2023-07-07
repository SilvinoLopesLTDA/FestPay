import { useDispatch, useSelector } from "react-redux";
import Loader, { SpinnerImg } from "../../components/loader/Loader";
import PasswordCard from "../../components/passwordCard/PasswordCard";
import styles from "./Dashboard.module.scss";
import {
  Chart,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { useEffect } from "react";
import { getShops } from "../../redux/features/shop/shopSlice";
import { Bar } from "react-chartjs-2";
import { format } from "date-fns";

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const dispatch = useDispatch();

  const { shop, isLoading, isError, message } = useSelector(
    (state) => state.shop
  );

  const currentItems = Array.isArray(shop) ? shop : [];

  useEffect(() => {
    dispatch(getShops());

    if (isError) {
      console.log(message);
    }
  }, [dispatch, isError, message]);

  const formatNumber = (number) => {
    if (number === null || number === undefined || isNaN(number)) {
      return "0";
    }

    const formattedNumber = Number(number).toFixed(2).toString();

    const parts = formattedNumber.split(".");
    const integerPart = parts[0];
    const decimalPart = parts[1];

    let formattedIntegerPart = "";
    for (let i = 0; i < integerPart.length; i++) {
      formattedIntegerPart += integerPart[i];
      const remainingDigits = integerPart.length - (i + 1);
      if (remainingDigits > 0 && remainingDigits % 3 === 0) {
        formattedIntegerPart += ".";
      }
    }

    return ` ${formattedIntegerPart},${decimalPart}`;
  };

  const profits = Array.isArray(shop) ? shop.map((item) => item.profit) : [];
  const costs = Array.isArray(shop) ? shop.map((item) => item.cost) : [];

  const totalProfit = profits.reduce((acc, curr) => acc + curr, 0);
  const totalCost = costs.reduce((acc, curr) => acc + curr, 0);

  const sortedShops = [...currentItems].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateA - dateB;
  });

  const dataByDate = {};

  sortedShops.forEach((shop) => {
    const updatedAt = format(new Date(shop.updatedAt), "dd/MM/yyyy");
    const createdAt = format(new Date(shop.createdAt), "dd/MM/yyyy");

    if (!dataByDate[createdAt]) {
      dataByDate[createdAt] = {
        cost: shop.cost || 0,
        profit: shop.profit || 0,
      };
    } else {
      dataByDate[createdAt].cost += shop.cost || 0;
    }

    if (!dataByDate[updatedAt]) {
      dataByDate[updatedAt] = {
        profit: shop.profit || 0,
        cost: shop.cost || 0,
      };
    } else {
      dataByDate[updatedAt].profit += shop.profit || 0;
    }
  });

  const dates = Object.keys(dataByDate);
  dates.sort((a, b) => {
    const dateA = new Date(a.split("/").reverse().join("-"));
    const dateB = new Date(b.split("/").reverse().join("-"));
    return dateA - dateB;
  });
  const labels = dates;
  console.log(labels);
  console.log(dataByDate);
  const profitsDated = labels.map((date) => dataByDate[date].profit);
  const costsDated = labels.map((date) => dataByDate[date].cost);

  const PieData = {
    labels: ["Lucros", "Custos"],
    datasets: [
      {
        label: "Valor",
        data: [totalProfit, totalCost],
        backgroundColor: [
          "rgba(129, 140, 248, 0.2)",
          "rgba(255, 99, 132, 0.2)",
        ],
        borderColor: ["rgba(129, 140, 248, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const optionsBar = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Lucros e Custos Diários",
      },
    },
  };

  const optionsPie = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Valores totais das Barracas",
      },
    },
  };

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Lucros",
        data: profitsDated,
        backgroundColor: "rgba(129, 140, 248, 0.2)",
        borderColor: "rgba(129, 140, 248, 1)",
        borderWidth: 1,
      },
      {
        label: "Custos",
        data: costsDated,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <PasswordCard componentId="dashboard" password={"1234"} />
      <div className="flex justify-center items-center">
        {isLoading && <Loader />}
        <div className={styles.content}>
          <h3 className="text-2xl font-semibold mb-10 sm:text-center">
            Dashboard do
            <span className="text-violet-700 font-bold"> FestPay</span>
          </h3>
          <div className="flex justify-between sm:flex-col">
            <div className=" flex w-3/5 sm:w-full">
              <Bar options={optionsBar} data={data} />
            </div>
            <div className="w-1/3 sm:w-full">
              <Pie data={PieData} options={optionsPie} />
            </div>
          </div>
          <div className="flex justify-center items-center h-full flex-col">
            <div className="w-full">
              <div className="flex justify-between items-center mx-10 my-7">
                <h3 className="text-2xl font-semibold mt-6">
                  {" "}
                  Pontos de{" "}
                  <span className="text-violet-700 font-bold">Vendas</span>
                </h3>
              </div>
              <div className="shop-container">
                <div
                  className={`${styles.cardContainer} grid grid-cols-3 gap place-items-center flex-wrap h-full my-8 sm:gap-4`}
                >
                  {isLoading && <SpinnerImg />}
                  {!isLoading && shop.length === 0 ? (
                    <p className={`${styles.placeholder} px-10`}>
                      -- Nenhum ponto de venda cadastrado. Por favor, adicione
                      um Ponto de venda!
                    </p>
                  ) : (
                    sortedShops.map((shop) => {
                      const { _id, name, profit, cost } = shop;
                      return (
                        <div
                          key={_id}
                          className="bg-slate-950/50 drop-shadow-4xl w-11/12 p-4 my-3 rounded sm:mx-5 sm:col-start-1 sm:col-span-4"
                        >
                          <h2 className="bg-slate-900 p-3 text-lg font-semibold mb-5 text-center">
                            {name}
                          </h2>
                          <div className="flex flex-col text-center sm:ml-3">
                            <p className="text-lg">
                              {" "}
                              Lucros:{" "}
                              <span className="font-bold text-green-500">
                                R${formatNumber(profit)}
                              </span>{" "}
                            </p>
                            <p className="text-lg sm:ml-7">
                              {" "}
                              Custos:{" "}
                              <span className=" font-bold text-rose-700">
                                R${formatNumber(cost)}
                              </span>{" "}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
