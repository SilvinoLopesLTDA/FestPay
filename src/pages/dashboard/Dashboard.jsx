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
  console.log(shop);

  const currentItems = Array.isArray(shop) ? shop : [];

  useEffect(() => {
    dispatch(getShops());

    if (isError) {
      console.log(message);
    }
  }, [dispatch, isError, message]);

  const profits = Array.isArray(shop) ? shop.map((item) => item.profit) : [];
  const costs = Array.isArray(shop) ? shop.map((item) => item.cost) : [];

  const totalProfit = profits.reduce((acc, curr) => acc + curr, 0);
  const totalCost = costs.reduce((acc, curr) => acc + curr, 0);

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

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const data = {
    labels: ["Dia 1", "Dia 2", "Dia 3", "Dia 4", "Dia 5", "Dia 6", "Dia 7"],
    datasets: [
      {
        label: "Lucros",
        data: profits,
        backgroundColor: "rgba(129, 140, 248, 0.2)",
        borderColor: "rgba(129, 140, 248, 1)",
        borderWidth: 1,
      },
      {
        label: "Custos",
        data: costs,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <PasswordCard password={"1234"} />
      <div className="flex justify-center items-center">
        {isLoading && <Loader />}
        <div className={styles.content}>
          <h3 className="text-2xl font-semibold mb-10">
            Dashboard do
            <span className="text-violet-700 font-bold"> FestPay</span>
          </h3>
          <div className="flex justify-between">
            <div className=" flex w-3/5">
              <Bar options={options} data={data} />
            </div>
            <div className="w-1/3">
              <Pie data={PieData} />
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
                  className={`${styles.cardContainer} grid grid-cols-3 gap place-items-center flex-wrap h-full my-8`}
                >
                  {isLoading && <SpinnerImg />}
                  {!isLoading && shop.length === 0 ? (
                    <p className={`${styles.placeholder} px-10`}>
                      -- Nenhum ponto de venda cadastrado. Por favor, adicione
                      um Ponto de venda!
                    </p>
                  ) : (
                    currentItems.map((shop) => {
                      const { _id, name, profit, cost } = shop;
                      return (
                        <div
                          key={_id}
                          className="bg-slate-950/50 drop-shadow-4xl w-11/12 p-4 my-3 rounded"
                        >
                          <h2 className="bg-slate-900 p-3 text-lg font-semibold mb-5 text-center">
                            {name}
                          </h2>
                          <div className="flex justify-around">
                            <p className="text-lg">
                              {" "}
                              Lucros:{" "}
                              <span className="font-bold text-green-500">
                                R$
                                {profit === null || undefined || ""
                                  ? "0"
                                  : profit}
                              </span>{" "}
                            </p>
                            <p className="text-lg">
                              {" "}
                              Custos:{" "}
                              <span className=" font-bold text-rose-700">
                                R$
                                {cost === null || undefined || "" ? "0" : cost}
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
