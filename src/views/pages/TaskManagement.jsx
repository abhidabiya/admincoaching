import * as React from 'react';
import { useState, useEffect } from 'react';
import { IconSticker2 } from '@tabler/icons-react';
import Button from '@mui/material/Button';
import { Delete, Add } from '@mui/icons-material';
import Box from '@mui/material/Box';
import { Modal } from 'react-bootstrap';
import {
    CircularProgress,
    Typography,
    IconButton,
    TextField,
    Select,
    MenuItem,
    FormControl,
    Card,
    CardContent,
    Chip,
    Grid,
    FormHelperText,
    Snackbar,
    Alert
} from '@mui/material';

// ===================== STATIC TASK DATA =====================
const STATIC_NOTES = [
    {
        id: 1,
        title: 'Follow up with Aarav Sharma',
        description: 'Call regarding B.Tech CS admission',
        category: 'Work',
        date: '2025-02-02'
    },
    {
        id: 2,
        title: 'Collect fees from Ananya Gupta',
        description: 'Second installment of ₹55,000',
        category: 'Important',
        date: '2025-02-01'
    },
    {
        id: 3,
        title: 'Send admission confirmation to Vikram Singh',
        description: 'Email admission letter and fee receipt',
        category: 'Work',
        date: '2025-01-31'
    },
    {
        id: 4,
        title: 'Schedule campus visit for Karthik Nair',
        description: 'M.Tech Data Science program tour',
        category: 'Personal',
        date: '2025-02-02'
    },
    {
        id: 5,
        title: 'Update Pooja Deshmukh fee records',
        description: 'Update payment schedule in system',
        category: 'Work',
        date: '2025-02-02'
    }
];

// ===================== MAIN COMPONENT =====================
const TaskManagement = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedNoteId, setSelectedNoteId] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    
    const [newNote, setNewNote] = useState({
        title: '',
        description: '',
        category: 'Personal'
    });

    // Validation errors
    const [errors, setErrors] = useState({
        title: ''
    });

    // Category options
    const categories = ['Personal', 'Work', 'Important', 'Study', 'Other'];

    // Load initial data
    useEffect(() => {
        const timer = setTimeout(() => {
            setNotes(STATIC_NOTES);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // Validate form
    const validateForm = () => {
        let isValid = true;
        const newErrors = { title: '' };

        if (!newNote.title.trim()) {
            newErrors.title = 'Title is required';
            isValid = false;
        } else if (newNote.title.trim().length < 3) {
            newErrors.title = 'Title must be at least 3 characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Delete note
    const handleDeleteClick = (noteId) => {
        setSelectedNoteId(noteId);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        const noteToDelete = notes.find(n => n.id === selectedNoteId);
        setNotes(prev => prev.filter(note => note.id !== selectedNoteId));
        setShowDeleteModal(false);
        setSelectedNoteId(null);
        
        // Show success message
        setSnackbar({
            open: true,
            message: `Note "${noteToDelete?.title}" deleted successfully`,
            severity: 'success'
        });
    };

    // Add new note
    const handleAddNote = () => {
        if (!validateForm()) {
            return;
        }

        const noteToAdd = {
            id: Date.now(),
            title: newNote.title.trim(),
            description: newNote.description.trim(),
            category: newNote.category,
            date: new Date().toISOString().split('T')[0]
        };

        setNotes(prev => [noteToAdd, ...prev]);
        setNewNote({
            title: '',
            description: '',
            category: 'Personal'
        });
        setErrors({ title: '' });
        setShowAddModal(false);
        
        // Show success message
        setSnackbar({
            open: true,
            message: 'Note added successfully!',
            severity: 'success'
        });
    };

    // Close snackbar
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Handle modal close
    const handleModalClose = () => {
        setShowAddModal(false);
        setErrors({ title: '' });
        setNewNote({
            title: '',
            description: '',
            category: 'Personal'
        });
    };

    // Get category color
    const getCategoryColor = (category) => {
        const colors = {
            'Personal': '#6366F1',
            'Work': '#4CAF50',
            'Important': '#f44336',
            'Study': '#FF9800',
            'Other': '#757575'
        };
        return colors[category] || '#757575';
    };

    // Format date
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        } catch (e) {
            return '';
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
                <span style={{ marginLeft: '16px' }}>Loading notes...</span>
            </Box>
        );
    }

    return (
        <>
            {/* Header */}
            <div style={{ 
                padding: '20px 0', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderBottom: '1px solid #e5e7eb'
            }}>
                <div>
                    <h2 style={{ 
                        margin: 0, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px',
                        fontSize: '24px',
                        color: '#ffffff'
                    }}>
                        <IconSticker2 style={{ color: '#6366F1' }} />
                        My Notes
                    </h2>
                    <p style={{ margin: '4px 0 0 0', color: '#6B7280', fontSize: '14px' }}>
                        {notes.length} notes total
                    </p>
                </div>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setShowAddModal(true)}
                    style={{
                        borderRadius: '8px',
                        padding: '8px 20px',
                        textTransform: 'none',
                        fontSize: '14px',
                        backgroundColor: '#6366F1',
                        boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
                    }}
                >
                    Add Note
                </Button>
            </div>

            {/* Notes Grid - Cards */}
            <div style={{ marginTop: '24px' }}>
                {notes.length === 0 ? (
                    <Box textAlign="center" py={8}>
                        <Typography variant="body1" color="text.secondary">
                            No notes yet. Click "Add Note" to create your first note!
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {notes.map((note) => (
                            <Grid item xs={12} sm={6} md={4} key={note.id}>
                                <Card 
                                    elevation={2}
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: '12px',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            boxShadow: '0 8px 24px rgba(228, 35, 35, 0.12)',
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                >
                                    <CardContent sx={{ flex: 1, position: 'relative' }}>
                                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                            <Typography 
                                                variant="h6" 
                                                sx={{ 
                                                    fontWeight: 600,
                                                    fontSize: '16px',
                                                    color: '#d5d9e2',
                                                    mb: 1,
                                                    pr: 4
                                                }}
                                            >
                                                {note.title}
                                            </Typography>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDeleteClick(note.id)}
                                                sx={{
                                                    color: '#f44336',
                                                    padding: '4px',
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    '&:hover': { backgroundColor: 'rgba(244,67,54,0.1)' }
                                                }}
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Box>
                                        
                                        <Typography 
                                            variant="body2" 
                                            color="text.secondary"
                                            sx={{
                                                mb: 2,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                minHeight: '60px'
                                            }}
                                        >
                                            {note.description || 'No description'}
                                        </Typography>
                                        
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Chip
                                                label={note.category}
                                                size="small"
                                                sx={{
                                                    backgroundColor: getCategoryColor(note.category),
                                                    color: '#fff',
                                                    fontSize: '11px',
                                                    height: '24px'
                                                }}
                                            />
                                            <Typography variant="caption" color="text.secondary">
                                                {formatDate(note.date)}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </div>

            {/* Add Note Modal */}
            <Modal
                show={showAddModal}
                onHide={handleModalClose}
                centered
                size="sm"
            >
                <Modal.Header
                    closeButton
                    style={{
                        background: "#ffffff",
                        borderBottom: "1px solid #e5e7eb",
                        padding: "16px 24px"
                    }}
                >
                    <Modal.Title
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#111827"
                        }}
                    >
                        <IconSticker2 style={{ color: "#6366F1", fontSize: "22px" }} />
                        Add New Note
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body style={{ padding: "24px", background: "#ffffff" }}>
                    <div style={{ marginBottom: "16px" }}>
                        <label style={{
                            display: "block",
                            marginBottom: "6px",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#374151"
                        }}>
                            Title *
                        </label>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Enter note title..."
                            value={newNote.title}
                            onChange={(e) => {
                                setNewNote((prev) => ({
                                    ...prev,
                                    title: e.target.value,
                                }));
                                if (errors.title) {
                                    setErrors({ ...errors, title: '' });
                                }
                            }}
                            error={!!errors.title}
                            helperText={errors.title}
                            onBlur={() => {
                                if (!newNote.title.trim()) {
                                    setErrors({ ...errors, title: 'Title is required' });
                                }
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                        <label style={{
                            display: "block",
                            marginBottom: "6px",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#374151"
                        }}>
                            Description
                        </label>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            size="small"
                            placeholder="Write your note..."
                            value={newNote.description}
                            onChange={(e) =>
                                setNewNote((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                }))
                            }
                        />
                    </div>

                    <div>
                        <label style={{
                            display: "block",
                            marginBottom: "6px",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#374151"
                        }}>
                            Category
                        </label>
                        <FormControl fullWidth size="small">
                            <Select
                                value={newNote.category}
                                onChange={(e) =>
                                    setNewNote((prev) => ({
                                        ...prev,
                                        category: e.target.value,
                                    }))
                                }
                            >
                                {categories.map((cat) => (
                                    <MenuItem key={cat} value={cat}>
                                        {cat}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </Modal.Body>

                <Modal.Footer
                    style={{
                        borderTop: "1px solid #e5e7eb",
                        padding: "12px 24px",
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px",
                        background: "#fafafa"
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={handleModalClose}
                        style={{
                            borderRadius: "8px",
                            padding: "6px 20px",
                            textTransform: "none",
                            fontSize: "14px"
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleAddNote}
                        style={{
                            background: "#6366F1",
                            color: "#fff",
                            borderRadius: "8px",
                            padding: "6px 20px",
                            textTransform: "none",
                            fontSize: "14px",
                            boxShadow: "0 4px 12px rgba(99,102,241,0.3)"
                        }}
                    >
                        Save Note
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                centered
                size="sm"
            >
                <Modal.Header
                    closeButton
                    style={{
                        background: "#ffffff",
                        borderBottom: "1px solid #e5e7eb",
                        padding: "16px 24px"
                    }}
                >
                    <Modal.Title
                        style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#111827"
                        }}
                    >
                        Delete Note
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body style={{ padding: "24px", background: "#ffffff" }}>
                    <Typography variant="body1" sx={{ color: '#374151' }}>
                        Are you sure you want to delete this note?
                    </Typography>
                    {selectedNoteId && (
                        <Typography variant="body2" sx={{ color: '#6B7280', mt: 1, fontWeight: 500 }}>
                            "{notes.find(n => n.id === selectedNoteId)?.title}"
                        </Typography>
                    )}
                </Modal.Body>

                <Modal.Footer
                    style={{
                        borderTop: "1px solid #e5e7eb",
                        padding: "12px 24px",
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px",
                        background: "#fafafa"
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={() => setShowDeleteModal(false)}
                        style={{
                            borderRadius: "8px",
                            padding: "6px 20px",
                            textTransform: "none",
                            fontSize: "14px"
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={confirmDelete}
                        style={{
                            background: "#f44336",
                            color: "#fff",
                            borderRadius: "8px",
                            padding: "6px 20px",
                            textTransform: "none",
                            fontSize: "14px"
                        }}
                    >
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Snackbar for Success Messages */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity}
                    sx={{ 
                        width: '100%',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default TaskManagement;