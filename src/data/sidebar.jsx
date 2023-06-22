import { MdSpaceDashboard } from "react-icons/md";
import { BsPersonFillAdd, BsShop } from "react-icons/bs";

const menu = [
  {
    title: "Barracas",
    icon: <BsShop />,
    path: "/shops",
  },
  {
    title: "Guichê",
    icon: <BsPersonFillAdd />,
    path: "/clients",
  },
  {
    title: "Dashboard",
    icon: <MdSpaceDashboard />,
    path: "/dashboard",
  },
];

export default menu;