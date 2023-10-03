import { useSelector } from "react-redux";
import { AiFillHome, AiOutlineControl } from "react-icons/ai";
import {
  BsShop,
  BsPersonFillAdd,
  BsPersonCircle,
  BsFillPeopleFill,
} from "react-icons/bs";
import { MdSpaceDashboard } from "react-icons/md";
import { TbDatabase } from "react-icons/tb";

const getMenuItems = (user) => {
  if (!user || !user.role) {
    return [
      {
        title: "Página Inicial",
        icon: <AiFillHome />,
        path: "/home",
        visible: true,
      },
    ];
  }

  const menu = [
    {
      title: "Página Inicial",
      icon: <AiFillHome />,
      path: "/home",
      visible: true,
    },
    {
      title: "Dashboard",
      icon: <MdSpaceDashboard />,
      path: "/dashboard",
      visible: user.role === "master",
    },
    {
      title: "Gerenciamento",
      icon: <AiOutlineControl />,
      path: "/manage",
      visible: user.role === "master",
    },
    {
      title: "Clientes",
      icon: <BsFillPeopleFill />,
      path: "/clients",
      visible: user.role === "master",
    },
    {
      title: "Barracas",
      icon: <BsShop />,
      path: "/shops",
      visible:
        user.role === "master" ||
        user.role === "admin" ||
        user.workerFunction === "Barraca",
    },
    {
      title: "Guichê",
      icon: <BsPersonFillAdd />,
      path: "/ticket-window",
      visible:
        user.role === "master" ||
        user.role === "admin" ||
        user.workerFunction === "Caixa",
    },
    {
      title: "Almoxarifado",
      icon: <TbDatabase />,
      path: "/storage",
      visible:
        user.role === "master" ||
        user.role === "admin" ||
        user.workerFunction === "Almoxarifado",
    },
    {
      title: "Conta",
      icon: <BsPersonCircle />,
      path: "/profile",
      visible: true,
    },
  ];

  return menu.filter((item) => item.visible !== undefined);
};

const Menu = () => {
  const user = useSelector((state) => state.auth.user);
  const menu = getMenuItems(user);
  return menu;
};

export default Menu;
