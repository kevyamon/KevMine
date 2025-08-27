import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const HomeScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 text-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold text-yellow-400 mb-4">
          Bienvenue sur KevMine !
        </h1>
        {userInfo ? (
          <p className="text-xl text-gray-300">
            Tu es connecté(e) ! Clique sur ton nom en haut pour accéder à ton profil.
          </p>
        ) : (
          <p className="text-xl text-gray-300">
            Commence à miner du Kevium en te connectant ou en t'inscrivant.
          </p>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;