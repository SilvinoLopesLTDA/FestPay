import { useSelector } from "react-redux";
import Loader from "../../components/loader/Loader";
import PasswordCard from "../../components/passwordCard/PasswordCard";
import styles from "./Dashboard.module.scss";
// import { selectIsLoading } from "../../redux/features/client/clientSlice";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

Chart.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  // const isLoading = useSelector(selectIsLoading);

  const { shop, isLoading } = useSelector(
    (state) => state.shop
  );

  const {profit, cost} = shop
  console.log(shop);
  
const data = {
  labels: ["Lucros", "Custos"],
  datasets: [
    {
      label: "Valor",
      data: [profit, cost, 10],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
      ],
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
          <div className="flex justify-between">
            <div className=" flex w-3/5">
              <div className="bg-slate-800 w-1/2 m-3 rounded p-5"></div>
              <div className="bg-slate-800 w-1/2 m-3 rounded p-5"></div>
            </div>
            <div>
              <Pie data={data} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
