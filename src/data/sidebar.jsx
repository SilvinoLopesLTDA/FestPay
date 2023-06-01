import { MdSpaceDashboard } from "react-icons/md";
import { BsPersonFillAdd, BsShop } from "react-icons/bs";

const menu = [
  {
    title: "Dashboard",
    icon: <MdSpaceDashboard />,
    path: "/",
  },
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
];

export default menu;