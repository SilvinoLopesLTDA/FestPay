import { useDispatch, useSelector } from "react-redux";
import Loader, { SpinnerImg } from "../../components/loader/Loader";
// import PasswordCard from "../../components/passwordCard/PasswordCard";
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
import { Pie, Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { getPurchases, getShops } from "../../redux/features/shop/shopSlice";
import { format } from "date-fns";
import printJS from "print-js";
import ShopCard from "./ShopCard";
import { Link } from "react-router-dom";

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
    dispatch(getPurchases());

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

  if (shop.createdAt) {
    const createdAt = format(new Date(shop.createdAt), "dd/MM/yy");
    const initialCostIndex = uniqueKeys.indexOf(createdAt);

    if (initialCostIndex !== -1) {
      initialCosts[initialCostIndex] -= shop.cost || 0;
    }
  }

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
        text: "Lucros e Custos Diários (Em reais)",
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
        text: "Valores Totais das Barracas (Em reais)",
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

  const handlePrint = () => {
    printJS({
      printable: "print-container",
      type: "html",
      targetStyles: ["*"],
      header: "Dashboard do FestPay",
      style: `
      @media print {
        .numGraphs {
            display: flex !important;
            justify-content: space-between !important;
            margin-top: 2rem !important;
            font-size: 4.5rem !important;
        }
      }
      `,
    });
  };

  const recargaCompras = useSelector((state) => state.shop.purchases);
  const guichesRecarga = recargaCompras?.filter((guiche) => {
    const noShop = !guiche?.shop;
    const hasRecargaItem = guiche?.items?.some(
      (item) => item?.name === "Recarga"
    );

    return noShop && hasRecargaItem;
  });

  const totalProfitGuiche = guichesRecarga?.reduce((acc, curr) => {
    const guicheProfit = curr?.items?.reduce((sum, item) => {
      const itemProfit = item?.price || 0;
      return sum + itemProfit;
    }, 0);

    return acc + guicheProfit;
  }, 0);

  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    if (
      shop.length > 0 &&
      guichesRecarga &&
      guichesRecarga.length > 0 &&
      totalProfitGuiche !== null
    ) {
      setDataReady(true);
    }
  }, [shop, guichesRecarga, totalProfitGuiche]);

  if (!isLoading && (!dataReady || shop.length === 0)) {
    return (
      <div className="flex flex-col justify-center items-center h-[75vh]">
        <div className="w-[93%] px-16 py-48 bg-[#0f172a] m-5 rounded-xl text-center">
          <p className="text-4xl text-gray-200 mb-4">Nenhum dado disponível.</p>
          <p className="text-lg text-gray-400">
            <Link to="/shops" className="hover:text-violet-500">
              Crie Barracas
            </Link>
            ,{" "}
            <Link to="/clients" className="hover:text-violet-500">
              cadastre clientes
            </Link>{" "}
            e comece a gerar dados!
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* <PasswordCard componentId="dashboard" password={"1234"} /> */}
      <div className="flex justify-center items-center">
        {isLoading && (
          <div className="w-full h-full flex justify-center items-center absolute inset-0 bg-gray-900 opacity-75 z-50">
            <Loader />
          </div>
        )}
        <div className={`${styles.content} relative`}>
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-2xl font-semibold sm:text-center">
              Dashboard do
              <span className="text-violet-600 font-bold"> FestPay</span>
            </h3>
            <button
              className="px-4 py-2 bg-violet-800 rounded-sm text-lg font-medium hover:bg-violet-700 transition-colors duration-300"
              onClick={handlePrint}
            >
              Imprimir Dashboard
            </button>
          </div>
          <div id="print-container">
            <hr className="my-5 border-indigo-500/80" />
            <div className="flex justify-between sm:flex-col">
              <div className="flex w-3/5 sm:w-full">
                <Bar options={optionsBar} data={data} />
              </div>
              <div className="w-1/3 sm:w-full">
                <Pie data={PieData} options={optionsPie} />
              </div>
            </div>
            <div className="hidden numGraphs">
              <p>
                Total de Lucros:{" "}
                <span className="font-bold">R${formatNumber(totalProfit)}</span>
              </p>
              <p>
                Total de Custos:{" "}
                <span className="font-bold">R${formatNumber(totalCost)}</span>
              </p>
            </div>
            <div className="flex justify-center items-center h-full flex-col">
              <div className="w-full">
                <div className="flex justify-between items-center my-7">
                  <h3 className="text-2xl font-semibold mt-6">
                    {" "}
                    Pontos de{" "}
                    <span className="text-violet-700 font-bold">Vendas</span>
                  </h3>
                </div>
                <div className="w-full">
                  <hr className="my-5 border-indigo-500/80" />
                  {isLoading && (
                    <div className="w-full flex justify-center items-center h-40">
                      <SpinnerImg />
                    </div>
                  )}
                  {dataReady && (
                    <>
                      <ShopCard
                        name="Guichê de Recarga"
                        profit={totalProfitGuiche}
                        isGuicheRecarga={true}
                      />
                    </>
                  )}
                  <div
                    className={`grid grid-cols-3 gap place-items-center flex-wrap h-full sm:gap-4`}
                  >
                    {!isLoading && shop.length !== 0 ? (
                      sortedShops.map((shop) => {
                        return (
                          <ShopCard
                            key={shop._id}
                            name={shop.name}
                            profit={shop.profit}
                            cost={shop.cost}
                            isGuicheRecarga={false}
                          />
                        );
                      })
                    ) : (
                      <p className="p-4 text-center">
                        Nenhuma barraca cadastrada. Por favor, adicione uma
                        barraca!
                      </p>
                    )}
                  </div>
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
