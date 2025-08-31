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
  Tabs,
  Tab,
  Tooltip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import CancelIcon from '@mui/icons-material/Cancel';
import { useSelector } from 'react-redux';
import {
  useGetConversationsQuery,
  useGetArchivedConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkConversationAsReadMutation,
  useToggleArchiveConversationMutation,
} from '../redux/slices/messageApiSlice';
import MessageItem from '../components/MessageItem'; // Importer le nouveau composant

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

const ConversationItem = ({ conversation, onSelect, isActive, currentUser, isArchivedTab }) => {
  const [toggleArchive] = useToggleArchiveConversationMutation();
  const otherParticipant = conversation.participants.find(p => p._id !== currentUser._id);
  if (!otherParticipant) return null;

  const hasUnread = conversation.unreadCount > 0;

  const handleArchiveToggle = (e) => {
    e.stopPropagation();
    toggleArchive(conversation._id);
  };

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
        '&:hover': { backgroundColor: 'action.hover' },
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
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {hasUnread && <Badge color="success" variant="dot" sx={{ mr: 2 }} />}
        <Tooltip title={isArchivedTab ? 'Désarchiver' : 'Archiver'}>
          <IconButton onClick={handleArchiveToggle} size="small">
            {isArchivedTab ? <UnarchiveIcon /> : <ArchiveIcon />}
          </IconButton>
        </Tooltip>
      </Box>
    </ListItemButton>
  );
};

const CustomLoadingIndicator = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <CircularProgress size={20} sx={{ animationDuration: '0.8s' }} />
      <CircularProgress size={20} sx={{ animationDuration: '0.8s', animationDelay: '0.2s', mx: 0.5 }} />
      <CircularProgress size={20} sx={{ animationDuration: '0.8s', animationDelay: '0.4s' }} />
    </Box>
);

const ChatWindow = ({ conversation, currentUser, onClose }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { data: messages, isLoading, error } = useGetMessagesQuery(conversation._id, {
      pollingInterval: 5000,
      skip: !conversation,
    });
    const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
    const [text, setText] = useState('');
    const [replyTo, setReplyTo] = useState(null); // État pour la réponse
    const messagesEndRef = useRef(null);
  
    const otherParticipant = conversation.participants.find(p => p._id !== currentUser._id);
  
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
  
    useEffect(() => {
      scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Réinitialiser la réponse si on change de conversation
        setReplyTo(null);
    }, [conversation._id]);
  
    const handleSendMessage = async (e) => {
      e.preventDefault();
      if (!text.trim()) return;
      try {
        await sendMessage({ 
            receiverId: otherParticipant._id, 
            text,
            replyTo: replyTo?._id // Envoyer l'ID du message auquel on répond
        }).unwrap();
        setText('');
        setReplyTo(null); // Réinitialiser après l'envoi
      } catch (err) {
        console.error('Failed to send message:', err);
      }
    };
  
    return (
      <Paper sx={{ height: '75vh', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
          {isMobile && <IconButton onClick={onClose} sx={{mr: 1}}><CloseIcon /></IconButton>}
          <Avatar src={otherParticipant.photo} sx={{ mr: 2 }}>{otherParticipant.name.charAt(0)}</Avatar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>{otherParticipant.name}</Typography>
        </Box>
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column' }}>
          {isLoading && <CustomLoadingIndicator />}
          {error && <Alert severity="error">Erreur de chargement des messages.</Alert>}
          {messages && messages.map((msg) => (
            <MessageItem key={msg._id} message={msg} currentUser={currentUser} onReply={setReplyTo} isMobile={isMobile} otherParticipant={otherParticipant}/>
          ))}
          <div ref={messagesEndRef} />
        </Box>
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            {replyTo && (
                <Box sx={{ p: 1, mb: 1, backgroundColor: 'action.hover', borderRadius: 1.5, position: 'relative' }}>
                    <Typography variant="caption" color="secondary.main">Répondre à {replyTo.sender.name}</Typography>
                    <Typography variant="body2" noWrap>{replyTo.text}</Typography>
                    <IconButton onClick={() => setReplyTo(null)} size="small" sx={{ position: 'absolute', top: 4, right: 4}}><CancelIcon fontSize="small"/></IconButton>
                </Box>
            )}
            <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField fullWidth variant="outlined" placeholder="Écrivez un message..." value={text} onChange={(e) => setText(e.target.value)} size="small" autoComplete="off" autoFocus/>
                <IconButton type="submit" color="primary" disabled={isSending}><SendIcon /></IconButton>
            </Box>
        </Box>
      </Paper>
    );
};

// --- ÉCRAN PRINCIPAL ---
const MessagesScreen = ({ initialConversationId }) => {
    // ... (Logique principale reste majoritairement la même)
    const { userInfo } = useSelector((state) => state.auth);
    const [tab, setTab] = useState(0);
  
    const { data: conversations, isLoading: isLoadingConvos, error: errorConvos } = useGetConversationsQuery(undefined, { skip: tab !== 0 });
    const { data: archived, isLoading: isLoadingArchived, error: errorArchived } = useGetArchivedConversationsQuery(undefined, { skip: tab !== 1 });
    
    const [markConversationAsRead] = useMarkConversationAsReadMutation();
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
    const currentConversations = tab === 0 ? conversations : archived;
    const isLoading = tab === 0 ? isLoadingConvos : isLoadingArchived;
    const error = tab === 0 ? errorConvos : errorArchived;
  
    const selectedConversation = currentConversations?.find(
      (convo) => convo._id === selectedConversationId
    );
    
    const handleTabChange = (event, newValue) => {
      setTab(newValue);
      setSelectedConversationId(null);
    };
  
    const handleSelectConversation = async (conversation) => {
      setSelectedConversationId(conversation._id);
      if (conversation.unreadCount > 0) {
        await markConversationAsRead(conversation._id).unwrap();
      }
      if (isMobile) {
        setIsModalOpen(true);
      }
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };
  
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Messagerie
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} sx={{ display: isMobile && isModalOpen ? 'none' : 'block' }}>
            <Paper sx={{ height: '75vh', display: 'flex', flexDirection: 'column' }}>
              <Tabs value={tab} onChange={handleTabChange} variant="fullWidth">
                <Tab label="Boîte de réception" />
                <Tab label="Archives" />
              </Tabs>
              <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
                {isLoading && <CircularProgress sx={{ display: 'block', m: 'auto', mt: 4 }} />}
                {error && <Alert severity="error">Erreur de chargement.</Alert>}
                <List>
                  {currentConversations?.map((convo) => (
                    <ConversationItem
                      key={convo._id}
                      conversation={convo}
                      onSelect={handleSelectConversation}
                      isActive={selectedConversationId === convo._id}
                      currentUser={userInfo}
                      isArchivedTab={tab === 1}
                    />
                  ))}
                </List>
              </Box>
            </Paper>
          </Grid>
  
          <Grid item xs={12} md={8} sx={{ display: { xs: 'none', md: 'block' } }}>
            {selectedConversation ? (
              <ChatWindow conversation={selectedConversation} currentUser={userInfo} />
            ) : (
              <Paper sx={{ height: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">
                  {tab === 0 ? 'Sélectionnez une conversation' : 'Consultez vos conversations archivées'}
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
        
        <Modal open={isMobile && isModalOpen} onClose={handleCloseModal}>
          <Box sx={modalStyle}>
            {selectedConversation ? (
              <ChatWindow
                conversation={selectedConversation}
                currentUser={userInfo}
                onClose={handleCloseModal}
              />
            ) : (
              <CustomLoadingIndicator />
            )}
          </Box>
        </Modal>
      </Container>
    );
};

export default MessagesScreen;