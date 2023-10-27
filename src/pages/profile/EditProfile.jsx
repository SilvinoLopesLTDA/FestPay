import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SET_LOGIN,
  SET_USER,
  selectUser,
} from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  deleteAccount,
  updateUser,
} from "../../redux/features/auth/authService";
import ChangePassword from "./ChangePassword";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const initializeProfile = (user) => {
  return {
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    photo: user?.photo || "",
  };
};

const EditProfile = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [visible, setVisible] = useState(false);
  const [profile, setProfile] = useState(initializeProfile(user));
  const [profileImage, setProfileImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    if (!user.email) {
      navigate("/profile");
    }

    setProfile(initializeProfile(user));
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
    if (name === "password") {
      setPassword(value);
    }
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      //Handle Image upload
      let imageURL;
      if (
        profileImage &&
        (profileImage.type === "image/jpeg" ||
          profileImage.type === "image/jpg" ||
          profileImage.type === "image/png")
      ) {
        const image = new FormData();
        image.append("file", profileImage);
        image.append("cloud_name", "dpyrlntco");
        image.append("upload_preset", "nqsh9wjr");
        image.append("folder", "FestPay/avatarImages");

        // First save image to cloudinary
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dpyrlntco/image/upload",
          {
            method: "post",
            body: image,
          }
        );
        const imgData = await response.json();
        imageURL = imgData.url.toString();
      }

      // Save Profile
      const formData = {
        name: profile.name,
        phone: profile.phone,
        bio: profile.bio,
        photo: profileImage ? imageURL : profile.photo,
      };
      await updateUser(formData);
      toast.success("Usuário Atualizado");
      navigate("/profile");
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  const handleShowChangePassword = () => {
    setShowChangePassword(true);
  };

  const handleDeleteAccount = async () => {
    await deleteAccount(password);
    dispatch(SET_LOGIN(false));
    dispatch(SET_USER(null));
    setShowDeleteConfirmation(false);
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center">
      {isLoading && <Loader />}
      <div className="w-[93.5%] p-8 bg-[#0f172a] m-5 rounded-xl">
        <div className="flex justify-between items-center sm:flex-col">
          <h2 className="text-2xl font-semibold">
            Editar <span className="text-violet-600 font-bold">Perfil</span>
          </h2>
          <Link to="/profile">
            <button className="px-4 py-2 bg-violet-800 rounded-sm text-lg font-medium hover:bg-violet-700 transition-colors duration-300">
              Voltar
            </button>
          </Link>
        </div>
        <div className="flex items-center justify-center">
          <hr className="my-6 w-full border-indigo-500/80" />
        </div>
        <div className="flex w-full">
          <div className="flex justify-center w-1/2">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Pré-Visualização da Foto do Perfil"
                className="rounded-sm w-80 h-80"
              />
            ) : (
              <img
                src={user?.photo}
                alt="Foto do Perfil"
                className="rounded-sm w-80 h-80"
              />
            )}
          </div>
          <div className="flex justify-center w-1/2">
            <form
              className={`flex flex-col w-10/12 justify-center ${
                showChangePassword ? "" : "space-y-2"
              }`}
            >
              <div>
                <label htmlFor="image" className="font-semibold text-[#8b5cf6]">
                  Foto:{" "}
                </label>
                <input
                  type="file"
                  name="image"
                  id="image"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleImageChange}
                  className="w-full p-2 bg-gray-100 rounded-sm text-black outline-none"
                />
              </div>
              <div>
                <label htmlFor="name" className="font-semibold text-[#8b5cf6]">
                  Nome:{" "}
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={profile?.name}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-100 rounded-sm text-black outline-none"
                />
              </div>
              <div>
                <label htmlFor="email" className="font-semibold text-[#8b5cf6]">
                  Email:
                </label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  value={profile?.email}
                  disabled
                  className="w-full bg-gray-400 p-2 rounded-sm text-black outline-none cursor-not-allowed"
                />
                <code className="text-gray-400">
                  O Email não pode ser Alterado
                </code>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  className="w-2/5 px-7 py-2 text-md font-semibold rounded bg-violet-800 hover:bg-violet-700 transition-colors duration-300"
                  onClick={handleShowChangePassword}
                >
                  Alterar a senha
                </button>
                <button
                  type="button"
                  className="w-2/5 px-7 py-2 text-md font-semibold rounded bg-slate-800 border-2 border-red-600 text-red-500 hover:bg-slate-800/60 transition-colors duration-300"
                  onClick={() => setShowDeleteConfirmation(true)}
                >
                  Excluir Conta
                </button>
              </div>
              {showChangePassword && (
                <ChangePassword
                  handleCloseChangePassword={() => setShowChangePassword(false)}
                />
              )}
              {showDeleteConfirmation && (
                <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/60">
                  <div className="bg-slate-800 p-6 rounded-lg">
                    <h3 className="text-xl mb-4 font-medium">
                      Confirme a sua senha:
                    </h3>
                    <div className="relative">
                      <input
                        type={visible ? "text" : "password"}
                        placeholder="Digite aqui a sua senha..."
                        required
                        id="password"
                        name="password"
                        value={password}
                        onChange={handleInputChange}
                        minLength="6"
                        className="bg-gray-100 text-black px-4 py-2 rounded-md w-full"
                      />
                      <div
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                        onClick={() => setVisible(!visible)}
                      >
                        {visible ? (
                          <AiOutlineEye color="#000" size={25} />
                        ) : (
                          <AiOutlineEyeInvisible color="#000" size={25} />
                        )}
                      </div>
                    </div>
                    <div className="py-4">
                      <hr />
                    </div>
                    <p>Tem certeza de que deseja excluir sua conta?</p>
                    <div className="mt-4 flex justify-between">
                      <button
                        type="button"
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300"
                        onClick={handleDeleteAccount}
                      >
                        Sim, excluir
                      </button>
                      <button
                        className="px-4 py-2 ml-4 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors duration-300"
                        onClick={() => setShowDeleteConfirmation(false)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <hr className="my-6 w-full border-indigo-500/80" />
        </div>
        <div className="w-full">
          <form className="flex flex-col space-y-2 mx-32">
            <label htmlFor="phone" className="font-semibold text-[#8b5cf6]">
              Telefone:
            </label>
            <input
              type="text"
              name="phone"
              id="phone"
              value={profile?.phone}
              onChange={handleInputChange}
              className="bg-gray-100 text-black px-4 py-2 rounded-sm w-2/5"
            />
            <label htmlFor="bio" className="font-semibold text-[#8b5cf6]">
              Descrição:
            </label>
            <textarea
              name="bio"
              id="bio"
              value={profile?.bio}
              onChange={handleInputChange}
              cols="30"
              rows="10"
              maxLength="250"
              className="bg-gray-100 min-h-[10.5rem] max-h-[10.5rem] text-black px-4 py-2 rounded-sm"
            />
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleSubmit}
                className="px-7 py-3 text-lg font-semibold rounded bg-violet-800 hover:bg-violet-700 transition-colors duration-300 w-2/4"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
