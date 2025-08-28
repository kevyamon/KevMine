import React from 'react';
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Box,
  Divider,
} from '@mui/material';
import { useGetRobotsQuery } from '../redux/slices/robotsApiSlice';
import { useGetCategoriesQuery } from '../redux/slices/categoryApiSlice';
import RobotCard from '../components/RobotCard';

const RobotStoreScreen = () => {
  const { data: robots, isLoading: isLoadingRobots, error: errorRobots } = useGetRobotsQuery();
  const { data: categories, isLoading: isLoadingCategories, error: errorCategories } = useGetCategoriesQuery();

  const isLoading = isLoadingRobots || isLoadingCategories;
  const error = errorRobots || errorCategories;

  // Séparer les robots d'occasion des robots neufs
  const playerSaleRobots = robots?.filter(r => r.isPlayerSale) || [];
  const newRobots = robots?.filter(r => !r.isPlayerSale) || [];

  // Grouper les robots neufs par catégorie
  const robotsByCategory = newRobots?.reduce((acc, robot) => {
    const categoryId = robot.category?._id || 'uncategorized';
    if (!acc[categoryId]) {
      acc[categoryId] = {
        name: robot.category?.name || 'Autres Robots',
        robots: [],
      };
    }
    acc[categoryId].robots.push(robot);
    return acc;
  }, {});

  const sortedCategories = categories 
    ? [...categories].sort((a, b) => a.name.localeCompare(b.name)) 
    : [];

  const displayOrder = [
    ...sortedCategories.map(c => c._id),
    'uncategorized'
  ];

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom textAlign="center" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Marché des Robots
      </Typography>
      <Typography variant="h6" component="p" gutterBottom textAlign="center" sx={{ mb: 5, color: 'white' }}>
        Acquérez de nouveaux robots pour augmenter votre production de Kevium.
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress size={60} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 3 }}>
          Erreur de chargement des données : {error?.data?.message || error.error}
        </Alert>
      ) : (
        <Box>
          {/* Section pour les reventes de joueurs */}
          {playerSaleRobots.length > 0 && (
            <Box sx={{ mb: 6 }}>
              <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 3, color: 'secondary.main' }}>
                Marché des Joueurs
              </Typography>
              <Divider sx={{ mb: 4, borderColor: 'rgba(0, 191, 255, 0.3)' }} />
              <Grid container spacing={4}>
                {playerSaleRobots.map((robot) => (
                  <Grid item key={robot._id} xs={12} sm={6} md={4}>
                    <RobotCard robot={robot} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Sections pour les robots neufs par catégorie */}
          {displayOrder.map(categoryId => {
            const group = robotsByCategory[categoryId];
            if (!group || group.robots.length === 0) return null;

            return (
              <Box key={categoryId} sx={{ mb: 6 }}>
                <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
                  {group.name}
                </Typography>
                <Divider sx={{ mb: 4, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
                <Grid container spacing={4}>
                  {group.robots.map((robot) => (
                    <Grid item key={robot._id} xs={12} sm={6} md={4}>
                      <RobotCard robot={robot} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )
          })}
        </Box>
      )}
    </Container>
  );
};

export default RobotStoreScreen;