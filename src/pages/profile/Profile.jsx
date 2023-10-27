import { useState } from "react";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getUser } from "../../redux/features/auth/authService";
import { SET_NAME, SET_USER } from "../../redux/features/auth/authSlice";
import { SpinnerImg } from "../../components/loader/Loader";
import { Link } from "react-router-dom";

const roleNames = {
  master: "Dono",
  admin: "Administrador",
  worker: "Trabalhador",
};

const Profile = () => {
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const data = await getUser();
        setProfile(data);
        dispatch(SET_USER(data));
        dispatch(SET_NAME(data.name));
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [dispatch]);

  const getRoleName = (role) => roleNames[role] || role;

  return (
    <div className="flex items-center justify-center">
      <div className="w-[93%] p-8 bg-[#0f172a] m-5 rounded-xl">
        {isLoading && <SpinnerImg />}
        <div className="text-justify mx-16">
          <div className="profile-photo">
            <img
              src={profile?.photo}
              alt="Foto do Perfil"
              className="rounded-full w-52 h-52 mx-auto mb-4"
            />
          </div>
          <div className="profile-data">
            <div>
              <p className="text-3xl text-center">
                <b>Nome:</b> {profile?.name}
              </p>
              <p className="text-xl text-center">
                <b>Email:</b>{" "}
                <span className="text-primary">{profile?.email}</span>
              </p>
            </div>
            <div className="flex items-center justify-center">
              <hr className="my-3 w-3/5 border-indigo-500/80" />
            </div>
            <div>
              <p className="text-xl text-center">
                <b>Tipo de conta:</b>{" "}
                <span className="text-primary">
                  {getRoleName(profile?.role)}
                </span>
              </p>
              {profile?.role === "worker" && (
                <p className="text-xl text-center">
                  <b>Função:</b>{" "}
                  <span className="text-primary">
                    {profile?.workerFunction}
                  </span>
                </p>
              )}
            </div>
            <div className="flex items-center justify-center">
              <hr className="my-3 w-3/5 border-indigo-500/80" />
            </div>
            <div className="my-2 mx-14">
              <p className="text-lg text-center">
                <b>Telefone:</b> {profile?.phone}
              </p>
              <p className="text-lg text-center mt-2">
                <b>Descrição:</b>{" "}
                <span className="whitespace-pre-wrap">{profile?.bio}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <hr className="my-6 w-3/4 border-indigo-500/80" />
        </div>
        <div className="flex justify-center">
          <Link to="/edit-profile">
            <button className="px-4 py-2 bg-violet-800 rounded-sm text-lg font-medium hover:bg-violet-700 transition-colors duration-300">
              Editar Perfil
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
