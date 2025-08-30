import React, { useState } from 'react';
import {
  Container, Typography, Box, Paper, List, ListItem, ListItemIcon, ListItemText,
  CircularProgress, Alert, IconButton, Tooltip, Tabs, Tab,
} from '@mui/material';
import {
  useGetNotificationsQuery,
  useGetArchivedNotificationsQuery,
  useToggleArchiveNotificationMutation,
} from '../redux/slices/notificationApiSlice';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'bonus': return <CardGiftcardIcon sx={{ color: '#FFD700' }} />;
    case 'quest': return <EmojiEventsIcon sx={{ color: '#00BFFF' }} />;
    case 'sale': return <PointOfSaleIcon sx={{ color: '#4CAF50' }} />;
    case 'warning': return <WarningAmberIcon sx={{ color: '#f44336' }} />;
    default: return <AnnouncementIcon sx={{ color: '#9e9e9e' }} />;
  }
};

const NotificationItem = ({ notification, onToggleArchive }) => {
  const [toggleArchive, { isLoading }] = onToggleArchive();

  return (
    <Paper
      elevation={2}
      sx={{
        mb: 2,
        opacity: notification.isRead ? 0.7 : 1,
        borderLeft: `4px solid ${notification.isRead ? 'transparent' : '#FFD700'}`,
      }}
    >
      <ListItem
        secondaryAction={
          <Tooltip title={notification.isArchived ? 'Désarchiver' : 'Archiver'}>
            <IconButton edge="end" onClick={() => toggleArchive(notification._id)} disabled={isLoading}>
              {notification.isArchived ? <UnarchiveIcon /> : <ArchiveIcon />}
            </IconButton>
          </Tooltip>
        }
      >
        <ListItemIcon>{getNotificationIcon(notification.type)}</ListItemIcon>
        <ListItemText
          primary={notification.message}
          secondary={new Date(notification.createdAt).toLocaleString()}
        />
      </ListItem>
    </Paper>
  );
};

const NotificationsScreen = () => {
  const [tab, setTab] = useState(0);

  const { data: notifications = [], isLoading: isLoadingNotifs, error: errorNotifs } = useGetNotificationsQuery();
  const { data: archived = [], isLoading: isLoadingArchived, error: errorArchived } = useGetArchivedNotificationsQuery();

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const isLoading = isLoadingNotifs || isLoadingArchived;
  const error = errorNotifs || errorArchived;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Centre de Notifications
      </Typography>

      <Paper>
        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab label="Boîte de réception" />
          <Tab label="Archives" />
        </Tabs>

        <Box sx={{ p: 3, minHeight: '60vh' }}>
          {isLoading && <CircularProgress />}
          {error && <Alert severity="error">{error.data?.message || 'Erreur de chargement'}</Alert>}

          {tab === 0 && !isLoading && (
            <List>
              {notifications.length > 0 ? (
                notifications.map(notif => (
                  <NotificationItem key={notif._id} notification={notif} onToggleArchive={useToggleArchiveNotificationMutation} />
                ))
              ) : (
                <Typography>Votre boîte de réception est vide.</Typography>
              )}
            </List>
          )}

          {tab === 1 && !isLoading && (
            <List>
              {archived.length > 0 ? (
                archived.map(notif => (
                  <NotificationItem key={notif._id} notification={notif} onToggleArchive={useToggleArchiveNotificationMutation} />
                ))
              ) : (
                <Typography>Vos archives sont vides.</Typography>
              )}
            </List>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default NotificationsScreen;