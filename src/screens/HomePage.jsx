import React from 'react';
import { Typography, Box, Container } from '@mui/material'; // Ajout de Container si jamais nécessaire

const HomeScreen = () => {
  return (
    // Utiliser Box au lieu de Container pour occuper toute la largeur,
    // ou ajuster les props du Container si une largeur maximale est désirée.
    // Ici, nous voulons étendre le contenu, donc Box est plus approprié.
    <Box
      sx={{
        py: 4, // Padding vertical pour un peu d'espace
        px: { xs: 2, md: 8 }, // Padding horizontal pour respirer sur les bords
        minHeight: 'calc(100vh - 64px)', // Hauteur minimale pour prendre l'espace restant après le header
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start', // Aligner le texte à gauche
        justifyContent: 'center', // Centrer verticalement le contenu principal
        color: 'white', // Assurer la couleur du texte
        width: '100%', // S'assurer que la Box prend toute la largeur disponible
        overflowX: 'hidden', // Empêcher le défilement horizontal inattendu
      }}
    >
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        sx={{ fontWeight: 'bold' }}
      >
        Bienvenue sur KevMine !
      </Typography>
      <Typography variant="h5" component="p">
        Tu es connecté(e) ! Clique sur ton nom en haut pour accéder à ton
        profil.
      </Typography>
      {/* Ici tu pourrais ajouter d'autres éléments pour ta page d'accueil */}
    </Box>
  );
};

export default HomeScreen;