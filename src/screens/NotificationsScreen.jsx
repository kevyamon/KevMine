import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, List, ListItem, ListItemIcon, ListItemText,
  CircularProgress, Alert, IconButton, Tooltip, Tabs, Tab, Divider, ListItemButton
} from '@mui/material';
import {
  useGetNotificationsQuery,
  useGetArchivedNotificationsQuery,
  useToggleArchiveNotificationMutation,
} from '../redux/slices/notificationApiSlice';
import { useGetConversationsQuery } from '../redux/slices/messageApiSlice'; // 1. Importer le hook des conversations
import { useSelector } from 'react-redux';

import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import MailIcon from '@mui/icons-material/Mail'; // Pour les messages

const getNotificationIcon = (type) => {
  switch (type) {
    case 'bonus': return <CardGiftcardIcon sx={{ color: '#FFD700' }} />;
    case 'quest': return <EmojiEventsIcon sx={{ color: '#00BFFF' }} />;
    case 'sale': return <PointOfSaleIcon sx={{ color: '#4CAF50' }} />;
    case 'warning': return <WarningAmberIcon sx={{ color: '#f44336' }} />;
    default: return <AnnouncementIcon sx={{ color: '#9e9e9e' }} />;
  }
};

const NotificationItem = ({ notification }) => {
  const [toggleArchive, { isLoading }] = useToggleArchiveNotificationMutation();

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

// 2. Nouveau composant pour afficher les messages non lus
const UnreadMessageItem = ({ conversation, currentUser }) => {
    const navigate = useNavigate();
    const otherParticipant = conversation.participants.find(p => p._id !== currentUser._id);
    if (!otherParticipant) return null;

    const handleClick = () => {
        // Naviguer vers la messagerie (la logique de "marquer comme lu" est déjà là-bas)
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
  const navigate = useNavigate();

  const { data: notifications = [], isLoading: isLoadingNotifs, error: errorNotifs } = useGetNotificationsQuery();
  const { data: archived = [], isLoading: isLoadingArchived, error: errorArchived } = useGetArchivedNotificationsQuery();
  // 3. Récupérer les conversations
  const { data: conversations = [], isLoading: isLoadingConvos, error: errorConvos } = useGetConversationsQuery();

  // 4. Filtrer pour ne garder que les conversations avec des messages non lus
  const unreadConversations = useMemo(() => 
    conversations.filter(c => c.unreadCount > 0), 
  [conversations]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const isLoading = isLoadingNotifs || isLoadingArchived || isLoadingConvos;
  const error = errorNotifs || errorArchived || errorConvos;

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
              {unreadConversations.length === 0 && unreadNotifications.length === 0 ? (
                <Typography>Votre boîte de réception est vide.</Typography>
              ) : (
                <List>
                  {/* 5. Afficher les messages non lus en premier */}
                  {unreadConversations.map(convo => (
                    <UnreadMessageItem key={convo._id} conversation={convo} currentUser={userInfo} />
                  ))}
                  
                  {unreadConversations.length > 0 && unreadNotifications.length > 0 && <Divider sx={{ my: 3 }} />}

                  {/* Puis afficher les notifications non archivées */}
                  {notifications.map(notif => (
                    <NotificationItem key={notif._id} notification={notif} />
                  ))}
                </List>
              )}
            </>
          )}

          {tab === 1 && !isLoading && (
            <List>
              {archived.length > 0 ? (
                archived.map(notif => (
                  <NotificationItem key={notif._id} notification={notif} />
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