import React, { useState, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom'; // 1. Importer useOutletContext
import {
  Container, Typography, Box, Paper, List, ListItem, ListItemIcon, ListItemText,
  CircularProgress, Alert, IconButton, Tooltip, Tabs, Tab, Divider, ListItemButton
} from '@mui/material';
import {
  useGetNotificationsQuery,
  useGetArchivedNotificationsQuery,
  useToggleArchiveNotificationMutation,
  useMarkOneAsReadMutation, // 2. Importer la nouvelle mutation
} from '../redux/slices/notificationApiSlice';
import { useGetMyWarningsQuery } from '../redux/slices/adminApiSlice'; // 3. Importer le hook des avertissements
import { useGetConversationsQuery } from '../redux/slices/messageApiSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import MailIcon from '@mui/icons-material/Mail';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'bonus': return <CardGiftcardIcon sx={{ color: '#FFD700' }} />;
    case 'quest': return <EmojiEventsIcon sx={{ color: '#00BFFF' }} />;
    case 'sale': return <PointOfSaleIcon sx={{ color: '#4CAF50' }} />;
    case 'warning': return <WarningAmberIcon sx={{ color: '#f44336' }} />;
    default: return <AnnouncementIcon sx={{ color: '#9e9e9e' }} />;
  }
};

// 4. Le composant accepte maintenant un `onClick`
const NotificationItem = ({ notification, onClick }) => {
  const [toggleArchive, { isLoading }] = useToggleArchiveNotificationMutation();

  const handleItemClick = () => {
    if (onClick) {
      onClick(notification);
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        mb: 2,
        opacity: notification.isRead ? 0.7 : 1,
        borderLeft: `4px solid ${notification.isRead ? 'transparent' : '#FFD700'}`,
      }}
    >
      <ListItemButton onClick={handleItemClick} sx={{ borderRadius: 1 }}>
        <ListItemIcon>{getNotificationIcon(notification.type)}</ListItemIcon>
        <ListItemText
          primary={notification.message}
          secondary={new Date(notification.createdAt).toLocaleString()}
        />
        <Tooltip title={notification.isArchived ? 'Désarchiver' : 'Archiver'}>
          <IconButton edge="end" onClick={(e) => { e.stopPropagation(); toggleArchive(notification._id); }} disabled={isLoading}>
            {notification.isArchived ? <UnarchiveIcon /> : <ArchiveIcon />}
          </IconButton>
        </Tooltip>
      </ListItemButton>
    </Paper>
  );
};

const UnreadMessageItem = ({ conversation, currentUser }) => {
    const navigate = useNavigate();
    const otherParticipant = conversation.participants.find(p => p._id !== currentUser._id);
    if (!otherParticipant) return null;

    const handleClick = () => {
        navigate('/messages');
    };

    return (
        <Paper elevation={2} sx={{ mb: 2, borderLeft: '4px solid', borderColor: 'success.main' }}>
            <ListItemButton onClick={handleClick}>
                <ListItemIcon><MailIcon color="success" /></ListItemIcon>
                <ListItemText
                    primary={`Nouveau message de ${otherParticipant.name}`}
                    secondary={`${conversation.unreadCount} message(s) non lu(s)`}
                />
            </ListItemButton>
        </Paper>
    );
};


const NotificationsScreen = () => {
  const [tab, setTab] = useState(0);
  const { userInfo } = useSelector((state) => state.auth);
  const { setActiveWarning } = useOutletContext(); // 5. Récupérer la fonction du contexte de l'Outlet

  const { data: notifications = [], isLoading: isLoadingNotifs, error: errorNotifs } = useGetNotificationsQuery();
  const { data: archived = [], isLoading: isLoadingArchived, error: errorArchived } = useGetArchivedNotificationsQuery();
  const { data: conversations = [], isLoading: isLoadingConvos, error: errorConvos } = useGetConversationsQuery();
  const { data: warnings = [], isLoading: isLoadingWarnings, error: errorWarnings } = useGetMyWarningsQuery(); // 6. Récupérer les avertissements
  const [markOneAsRead] = useMarkOneAsReadMutation();

  const unreadConversations = useMemo(() => 
    conversations.filter(c => c.unreadCount > 0), 
  [conversations]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  // 7. Logique de clic sur une notification
  const handleNotificationClick = async (notification) => {
    if (notification.type === 'warning' && notification.link) {
      const warningToDisplay = warnings.find(w => w._id === notification.link);
      if (warningToDisplay) {
        setActiveWarning(warningToDisplay); // Affiche la modale
        if (!notification.isRead) {
          try {
            await markOneAsRead(notification._id).unwrap(); // Marque la notif comme lue
          } catch (err) {
            toast.error("Erreur lors de la mise à jour de la notification.");
          }
        }
      } else {
        toast.error("Impossible de trouver l'avertissement associé.");
      }
    }
    // Ici, on pourrait ajouter des logiques pour d'autres types de notifications (ex: rediriger vers une vente)
  };

  const isLoading = isLoadingNotifs || isLoadingArchived || isLoadingConvos || isLoadingWarnings;
  const error = errorNotifs || errorArchived || errorConvos || errorWarnings;

  const unreadNotifications = notifications.filter(n => !n.isRead);

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
            <>
              {unreadConversations.length === 0 && notifications.length === 0 ? (
                <Typography>Votre boîte de réception est vide.</Typography>
              ) : (
                <List>
                  {unreadConversations.map(convo => (
                    <UnreadMessageItem key={convo._id} conversation={convo} currentUser={userInfo} />
                  ))}
                  
                  {unreadConversations.length > 0 && notifications.length > 0 && <Divider sx={{ my: 3 }} />}

                  {notifications.map(notif => (
                    <NotificationItem key={notif._id} notification={notif} onClick={handleNotificationClick} />
                  ))}
                </List>
              )}
            </>
          )}

          {tab === 1 && !isLoading && (
            <List>
              {archived.length > 0 ? (
                archived.map(notif => (
                  <NotificationItem key={notif._id} notification={notif} onClick={handleNotificationClick} />
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