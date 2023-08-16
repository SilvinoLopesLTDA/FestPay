import { MdSpaceDashboard } from "react-icons/md";
import { BsPersonFillAdd, BsShop } from "react-icons/bs";
import { AiOutlineControl } from 'react-icons/ai'
import { TbDatabase } from 'react-icons/tb'

const menu = [
  {
    title: "Dashboard",
    icon: <MdSpaceDashboard />,
    path: "/dashboard",
  },
  {
    title: "Gerenciamento",
    icon: <AiOutlineControl />,
    path: "/manage",
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
  {
    title: "Almoxarifado",
    icon: <TbDatabase />,
    path: "/storage",
  },
];

export default menu;