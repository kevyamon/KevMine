import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  TextField,
  IconButton,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useSelector } from 'react-redux';
import {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
} from '../redux/slices/messageApiSlice';

// Composant pour une seule conversation dans la liste
const ConversationItem = ({ conversation, onSelect, isActive, currentUser }) => {
  const otherParticipant = conversation.participants.find(p => p._id !== currentUser._id);
  if (!otherParticipant) return null;

  return (
    <ListItem
      button
      onClick={() => onSelect(conversation)}
      sx={{
        backgroundColor: isActive ? 'action.selected' : 'transparent',
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
            {conversation.lastMessage ? `${conversation.lastMessage.sender.name}: ${conversation.lastMessage.text}` : 'Aucun message'}
          </Typography>
        }
      />
    </ListItem>
  );
};

// Composant pour la fenêtre de chat
const ChatWindow = ({ conversation, currentUser }) => {
  const { data: messages, isLoading, error } = useGetMessagesQuery(conversation._id, {
    pollingInterval: 5000, // Rafraîchir les messages toutes les 5 secondes
    skip: !conversation,
  });
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [text, setText] = useState('');

  const otherParticipant = conversation.participants.find(p => p._id !== currentUser._id);

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
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6">{otherParticipant.name}</Typography>
      </Box>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        {isLoading && <CircularProgress />}
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
              sx={{
                p: 1.5,
                backgroundColor: msg.sender._id === currentUser._id ? 'primary.main' : 'background.default',
                color: msg.sender._id === currentUser._id ? 'common.black' : 'common.white',
                maxWidth: '70%',
                borderRadius: 2,
              }}
            >
              <Typography variant="body1">{msg.text}</Typography>
            </Paper>
          </Box>
        ))}
      </Box>
      <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2, display: 'flex', alignItems: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Écrivez un message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          size="small"
        />
        <IconButton type="submit" color="primary" disabled={isSending}>
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

// Écran principal de la messagerie
const MessagesScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: conversations, isLoading, error } = useGetConversationsQuery();
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Messagerie
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '75vh', overflowY: 'auto' }}>
            {isLoading && <CircularProgress />}
            {error && <Alert severity="error">Erreur de chargement des conversations.</Alert>}
            <List>
              {conversations && conversations.map((convo) => (
                <ConversationItem
                  key={convo._id}
                  conversation={convo}
                  onSelect={setSelectedConversation}
                  isActive={selectedConversation?._id === convo._id}
                  currentUser={userInfo}
                />
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          {selectedConversation ? (
            <ChatWindow conversation={selectedConversation} currentUser={userInfo} />
          ) : (
            <Paper sx={{ height: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">Sélectionnez une conversation pour commencer</Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default MessagesScreen;