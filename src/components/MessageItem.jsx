import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Button,
  Avatar,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';
import { useEditMessageMutation, useDeleteMessageMutation } from '../redux/slices/messageApiSlice';
import { toast } from 'react-toastify';

const MessageItem = ({ message, currentUser, onReply, isMobile, otherParticipant }) => {
  const isSender = message.sender._id === currentUser._id;
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);

  const [editMessage] = useEditMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    try {
      await deleteMessage(message._id).unwrap();
      toast.success('Message supprimé.');
    } catch (err) {
      toast.error('Erreur lors de la suppression.');
      console.error(err);
    }
    setAnchorEl(null);
  };

  const handleSaveEdit = async () => {
    if (editText.trim() === message.text) {
      setIsEditing(false);
      return;
    }
    try {
      await editMessage({ messageId: message._id, text: editText }).unwrap();
      toast.success('Message modifié.');
      setIsEditing(false);
    } catch (err) {
      toast.error('Erreur lors de la modification.');
      console.error(err);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(message.text);
  };

  const handleReply = () => {
    onReply(message);
    setAnchorEl(null);
  };

  const messageBubbleStyles = {
    p: 1.5,
    maxWidth: '70%',
    borderRadius: isSender ? '15px 15px 0 15px' : '15px 15px 15px 0',
    backgroundColor: isSender ? 'primary.main' : 'background.default',
    color: isSender ? 'common.black' : 'common.white',
    wordBreak: 'break-word',
    position: 'relative', // Pour le menu
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isSender ? 'flex-end' : 'flex-start',
        mb: 1,
        position: 'relative', // Pour le swipe to reply
      }}
    >
      {!isSender && !isMobile && ( // Afficher l'avatar de l'interlocuteur sur desktop
        <Avatar src={otherParticipant?.photo} sx={{ mr: 1 }}>
          {otherParticipant?.name.charAt(0)}
        </Avatar>
      )}
      <Paper elevation={3} sx={messageBubbleStyles}>
        {message.replyTo && (
          <Box
            sx={{
              backgroundColor: 'rgba(0,0,0,0.2)',
              p: 0.8,
              borderRadius: 1,
              mb: 1,
              borderLeft: `3px solid ${message.replyTo.sender._id === currentUser._id ? 'primary.light' : 'secondary.light'}`,
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {message.replyTo.sender.name}
            </Typography>
            <Typography variant="body2" sx={{ fontStyle: 'italic', fontSize: '0.8rem' }} noWrap>
              {message.replyTo.isDeleted ? 'Ce message a été supprimé' : message.replyTo.text}
            </Typography>
          </Box>
        )}

        {isEditing ? (
          <Box>
            <TextField
              fullWidth
              multiline
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              sx={{ mb: 1, '& .MuiOutlinedInput-root': { color: 'white' } }}
              size="small"
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button size="small" onClick={handleCancelEdit}>Annuler</Button>
              <Button size="small" variant="contained" onClick={handleSaveEdit}>Enregistrer</Button>
            </Box>
          </Box>
        ) : (
          <Typography variant="body1">
            {message.isDeleted ? (
              <Box sx={{ fontStyle: 'italic', color: 'text.secondary' }}>Ce message a été supprimé</Box>
            ) : (
              message.text
            )}
          </Typography>
        )}
        
        {!message.isDeleted && message.isEdited && (
            <Typography variant="caption" sx={{ alignSelf: 'flex-end', mt: 0.5, color: 'text.secondary' }}>
                (Modifiée)
            </Typography>
        )}

        {(!isEditing && !message.isDeleted) && (
          <IconButton
            size="small"
            onClick={handleMenuClick}
            sx={{
              position: 'absolute',
              top: 0,
              right: isSender ? -30 : 'auto', // Ajustement pour qu'il ne recouvre pas le texte
              left: isSender ? 'auto' : -30,
              color: 'text.secondary',
              visibility: isMobile ? 'visible' : 'hidden', // Toujours visible sur mobile, visible au hover sur desktop
              [`@media (min-width:${(theme) => theme.breakpoints.values.md}px)`]: {
                '&:hover': {
                  visibility: 'visible',
                },
              },
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        )}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {isSender && (
            <MenuItem onClick={handleEdit} disabled={message.isDeleted}>
              <EditIcon fontSize="small" sx={{ mr: 1 }} /> Modifier
            </MenuItem>
          )}
          {isSender && (
            <MenuItem onClick={handleDelete} disabled={message.isDeleted}>
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Supprimer
            </MenuItem>
          )}
          <MenuItem onClick={handleReply} disabled={message.isDeleted}>
            <ReplyIcon fontSize="small" sx={{ mr: 1 }} /> Répondre
          </MenuItem>
        </Menu>
      </Paper>
      {isSender && !isMobile && ( // Afficher l'avatar de l'expéditeur sur desktop
        <Avatar src={currentUser?.photo} sx={{ ml: 1 }}>
          {currentUser?.name.charAt(0)}
        </Avatar>
      )}
    </Box>
  );
};

export default MessageItem;