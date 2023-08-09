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
import { useRedirectLoggedOutUser } from "../../customHook/useRedirectLoggedOutUser";

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
    if (sessionStorage.getItem("shouldReloadDashboard")) {
      window.location.reload();
      sessionStorage.removeItem("shouldReloadDashboard");
    }
  }, []);
  useRedirectLoggedOutUser("/login");

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

  const profits = Array.isArray(shop)
    ? shop.map((item) =>
        item.purchases.reduce(
          (total, purchase) => total + purchase.profitValue,
          0
        )
      )
    : [];
  const initialCosts = Array.isArray(shop)
    ? shop.map((item) => item.cost || 0)
    : [];

  if (shop.createdAt) {
    const createdAt = format(new Date(shop.createdAt), "dd/MM/yy");
    const initialCostIndex = uniqueKeys.indexOf(createdAt);

    if (initialCostIndex !== -1) {
      initialCosts[initialCostIndex] -= shop.cost || 0;
    }
  }

  const totalInitialCost = initialCosts.reduce(
    (total, cost) => total + cost,
    0
  );

  const totalProfit = profits.reduce((acc, curr) => acc + curr, 0);
  const totalCost = totalInitialCost;

  const sortedShops = [...currentItems].sort((a, b) => {
    const dateA = new Date(b.createdAt);
    const dateB = new Date(a.createdAt);
    return dateA - dateB;
  });

  const dataByDate = {};

  sortedShops.forEach((shop) => {
    const createdAt = format(new Date(shop.createdAt), "dd/MM/yy");

    // eslint-disable-next-line no-unused-vars
    let totalCostValue = shop.cost || 0;

    shop.costsUpdated.forEach((cost) => {
      const costDate = format(new Date(cost.createdAt), "dd/MM/yy");
      const costValue = cost.costValue;

      if (!dataByDate[costDate]) {
        dataByDate[costDate] = {
          cost: 0,
          profit: 0,
        };
      }
      dataByDate[costDate].cost += costValue;

      if (costDate !== createdAt) {
        if (!dataByDate[createdAt]) {
          dataByDate[createdAt] = {
            cost: 0,
            profit: 0,
          };
        }
        dataByDate[createdAt].cost -= costValue;
      }
    });

    if (shop.cost) {
      if (!dataByDate[createdAt]) {
        dataByDate[createdAt] = {
          cost: 0,
          profit: 0,
        };
      }
      dataByDate[createdAt].cost += shop.cost;
    }

    shop.purchases.forEach((purchase) => {
      const purchaseDate = format(new Date(purchase.createdAt), "dd/MM/yy");
      const purchaseValue = purchase.profitValue;

      if (!dataByDate[purchaseDate]) {
        dataByDate[purchaseDate] = {
          cost: 0,
          profit: 0,
        };
      }
      dataByDate[purchaseDate].profit += purchaseValue;
    });
  });

  const dates = Object.keys(dataByDate);
  dates.sort((a, b) => {
    const dateA = new Date(a.split("/").reverse().join("/"));
    const dateB = new Date(b.split("/").reverse().join("/"));
    return dateA - dateB;
  });

  const uniqueKeys = Array.from(new Set(dates));

  const profitsDated = uniqueKeys.map((date) => dataByDate[date]?.profit || 0);
  const costsDated = uniqueKeys.map((date) => dataByDate[date]?.cost || 0);

  const PieData = {
    labels: ["Lucros", "Custos"],
    datasets: [
      {
        label: "Valor",
        data: [totalProfit, totalCost],
        backgroundColor: ["rgba(	119, 221, 119, 0.2)", "rgba(192, 57, 43, 0.2)"],
        borderColor: ["rgba(	119, 221, 119, 1)", "rgba(192, 57, 43, 1)"],
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
        text: "Valores Totais das Barracas",
      },
    },
  };

  const data = {
    labels: uniqueKeys,
    datasets: [
      {
        label: "Lucros",
        data: profitsDated,
        backgroundColor: "rgba(	119, 221, 119, 0.2)",
        borderColor: "rgba(	119, 221, 119, 1)",
        borderWidth: 1,
      },
      {
        label: "Custos",
        data: costsDated,
        backgroundColor: "rgba(192, 57, 43, 0.2)",
        borderColor: "rgba(192, 57, 43, 1)",
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
