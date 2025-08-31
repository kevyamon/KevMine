import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Alert,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  TextField,
  IconButton,
  Modal,
  useTheme,
  useMediaQuery,
  Badge,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';
import {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkConversationAsReadMutation,
} from '../redux/slices/messageApiSlice';

// --- STYLES ---
const modalStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  bgcolor: 'background.default',
  display: 'flex',
  flexDirection: 'column',
};

// --- COMPOSANTS ---

// Composant pour une seule conversation dans la liste
const ConversationItem = ({ conversation, onSelect, isActive, currentUser }) => {
  const otherParticipant = conversation.participants.find(p => p._id !== currentUser._id);
  if (!otherParticipant) return null;

  const hasUnread = conversation.unreadCount > 0;

  return (
    <ListItemButton
      onClick={() => onSelect(conversation)}
      sx={{
        mb: 1,
        borderRadius: 2,
        backgroundColor: isActive ? 'action.selected' : 'background.paper',
        border: '2px solid',
        borderColor: hasUnread ? 'success.main' : 'transparent',
        transition: 'border-color 0.3s',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
    >
      <ListItemAvatar>
        <Avatar src={otherParticipant.photo}>{otherParticipant.name.charAt(0)}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={otherParticipant.name}
        secondary={
          <Typography variant="body2" color="text.secondary" noWrap>
            {conversation.lastMessage ? `${conversation.lastMessage.sender._id === currentUser._id ? 'Vous: ' : ''}${conversation.lastMessage.text}` : 'Aucun message'}
          </Typography>
        }
      />
      {hasUnread && (
        <Badge color="success" variant="dot" />
      )}
    </ListItemButton>
  );
};

// Composant de chargement avec 3 points
const CustomLoadingIndicator = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
    <CircularProgress size={20} sx={{ animationDuration: '0.8s' }} />
    <CircularProgress size={20} sx={{ animationDuration: '0.8s', animationDelay: '0.2s', mx: 0.5 }} />
    <CircularProgress size={20} sx={{ animationDuration: '0.8s', animationDelay: '0.4s' }} />
  </Box>
);

// Composant pour la fenêtre de chat
const ChatWindow = ({ conversation, currentUser, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { data: messages, isLoading, error } = useGetMessagesQuery(conversation._id, {
    pollingInterval: 5000,
    skip: !conversation,
  });
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  const otherParticipant = conversation.participants.find(p => p._id !== currentUser._id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await sendMessage({ receiverId: otherParticipant._id, text }).unwrap();
      setText('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <Paper sx={{ height: '75vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">{otherParticipant.name}</Typography>
        {isMobile && (
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column' }}>
        {isLoading && <CustomLoadingIndicator />} {/* Utilisation de l'animation personnalisée */}
        {error && <Alert severity="error">Erreur de chargement des messages.</Alert>}
        {messages && messages.map((msg) => (
          <Box
            key={msg._id}
            sx={{
              display: 'flex',
              justifyContent: msg.sender._id === currentUser._id ? 'flex-end' : 'flex-start',
              mb: 1,
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 1.5,
                backgroundColor: msg.sender._id === currentUser._id ? 'primary.main' : 'background.default',
                color: msg.sender._id === currentUser._id ? 'common.black' : 'common.white',
                maxWidth: '70%',
                borderRadius: msg.sender._id === currentUser._id ? '15px 15px 0 15px' : '15px 15px 15px 0',
              }}
            >
              <Typography variant="body1">{msg.text}</Typography>
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2, display: 'flex', alignItems: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Écrivez un message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          size="small"
          autoComplete="off"
        />
        <IconButton type="submit" color="primary" disabled={isSending}>
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

// --- ÉCRAN PRINCIPAL ---
const MessagesScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: conversations, isLoading, error } = useGetConversationsQuery(undefined, {
      pollingInterval: 15000,
  });
  const [markConversationAsRead] = useMarkConversationAsReadMutation();
  const [selectedConversationId, setSelectedConversationId] = useState(null); // Changement ici
  const [isModalOpen, setIsModalOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Trouver la conversation sélectionnée à partir de son ID
  const selectedConversation = conversations?.find(
    (convo) => convo._id === selectedConversationId
  );

  const handleSelectConversation = async (conversation) => {
    setSelectedConversationId(conversation._id); // Met à jour l'ID
    if (conversation.unreadCount > 0) {
      await markConversationAsRead(conversation._id).unwrap();
    }
    if (isMobile) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // On ne réinitialise PLUS selectedConversationId ici pour qu'elle reste active
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Messagerie
      </Typography>
      <Grid container spacing={3}>
        {/* Colonne des conversations */}
        <Grid item xs={12} md={4} sx={{ display: isMobile && isModalOpen ? 'none' : 'block' }}> {/* Condition d'affichage modifiée */}
          <Paper sx={{ height: '75vh', overflowY: 'auto', p: 1 }}>
            {isLoading && <CircularProgress />}
            {error && <Alert severity="error">Erreur de chargement des conversations.</Alert>}
            <List>
              {conversations && conversations.map((convo) => (
                <ConversationItem
                  key={convo._id}
                  conversation={convo}
                  onSelect={handleSelectConversation}
                  isActive={selectedConversationId === convo._id} // Comparaison avec l'ID
                  currentUser={userInfo}
                />
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Fenêtre de chat */}
        <Grid item xs={12} md={8} sx={{ display: { xs: 'none', md: 'block' } }}>
          {selectedConversation ? (
            <ChatWindow conversation={selectedConversation} currentUser={userInfo} />
          ) : (
            <Paper sx={{ height: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">Sélectionnez une conversation pour commencer</Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
      
      {/* Modale pour le chat sur mobile */}
      <Modal open={isMobile && isModalOpen} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          {selectedConversation ? ( // S'assurer qu'il y a une conversation sélectionnée
            <ChatWindow
              conversation={selectedConversation}
              currentUser={userInfo}
              onClose={handleCloseModal}
            />
          ) : (
            <CustomLoadingIndicator /> // Animation si la conversation est en cours de chargement dans la modale
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default MessagesScreen;