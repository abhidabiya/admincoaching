// TaskManagement.js
import React from 'react';
import { useState, useEffect } from 'react';
import { IconSticker2 } from '@tabler/icons-react';
import Button from '@mui/material/Button';
import { Delete, Add } from '@mui/icons-material';
import Box from '@mui/material/Box';
import { Modal } from 'react-bootstrap';

import { API_URL } from 'config/constant';

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
    Snackbar,
    Alert
} from '@mui/material';

// ===================== API SERVICES =====================
const apiService = {
    // 1. Add Note
    async addNote(noteData) {
        const formData = new FormData();
        formData.append('title', noteData.title);
        formData.append('description', noteData.description || '');
        formData.append('category', noteData.category || 'Personal');
        formData.append('date', noteData.date || new Date().toISOString().split('T')[0]);

        const response = await fetch(`${API_URL}/add_note`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || 'Failed to add note');
        }
        return data;
    },

    // 2. Get All Notes
    async getAllNotes(params = {}) {
        const queryParams = new URLSearchParams();
        if (params.category) queryParams.append('category', params.category);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.offset) queryParams.append('offset', params.offset);

        const url = `${API_URL}/get_all_notes${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        
        const response = await fetch(url);
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || 'Failed to fetch notes');
        }
        return data;
    },

    // 3. Get Single Note
    async getNoteById(id) {
        const response = await fetch(`${API_URL}/get_note/${id}`);
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || 'Failed to fetch note');
        }
        return data;
    },

    // 4. Update Note
    async updateNote(id, noteData) {
        const formData = new FormData();
        if (noteData.title) formData.append('title', noteData.title);
        if (noteData.description !== undefined) formData.append('description', noteData.description);
        if (noteData.category) formData.append('category', noteData.category);
        if (noteData.date) formData.append('date', noteData.date);

        const response = await fetch(`${API_URL}/update_note/${id}`, {
            method: 'PUT',
            body: formData
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || 'Failed to update note');
        }
        return data;
    },

    // 5. Delete Note
    async deleteNote(id) {
        const response = await fetch(`${API_URL}/delete_note/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || 'Failed to delete note');
        }
        return data;
    },

    // 6. Get Notes by Category
    async getNotesByCategory(category) {
        const response = await fetch(`${API_URL}/get_notes_by_category/${category}`);
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || 'Failed to fetch notes by category');
        }
        return data;
    },

    // 7. Get Notes Summary
    async getNotesSummary(params = {}) {
        const queryParams = new URLSearchParams();
        if (params.year) queryParams.append('year', params.year);
        if (params.month) queryParams.append('month', params.month);

        const url = `${API_URL}/get_notes_summary${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        
        const response = await fetch(url);
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || 'Failed to fetch summary');
        }
        return data;
    },

    // 8. Get Notes by Date Range
    async getNotesByDateRange(startDate, endDate) {
        const response = await fetch(
            `${API_URL}/get_notes_by_date_range?start_date=${startDate}&end_date=${endDate}`
        );
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || 'Failed to fetch notes by date range');
        }
        return data;
    },

    // 9. Get Recent Notes
    async getRecentNotes(limit = 5) {
        const response = await fetch(`${API_URL}/get_recent_notes?limit=${limit}`);
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || 'Failed to fetch recent notes');
        }
        return data;
    },

    // 10. Get Category Stats
    async getCategoryStats() {
        const response = await fetch(`${API_URL}/get_category_stats`);
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || 'Failed to fetch category stats');
        }
        return data;
    }
};

// ===================== MAIN COMPONENT =====================
const TaskManagement = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedNoteId, setSelectedNoteId] = useState(null);
    const [selectedNote, setSelectedNote] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [categoryStats, setCategoryStats] = useState(null);
    const [summary, setSummary] = useState(null);
    
    const [newNote, setNewNote] = useState({
        title: '',
        description: '',
        category: 'Personal'
    });

    const [editNoteData, setEditNoteData] = useState({
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

    // ===================== LOAD DATA =====================
    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchNotes(),
                fetchCategoryStats(),
                fetchSummary()
            ]);
        } catch (error) {
            showSnackbar('Failed to load data', 'error');
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchNotes = async (category = '') => {
        try {
            const params = {};
            if (category) params.category = category;
            const response = await apiService.getAllNotes(params);
            setNotes(response.data || []);
        } catch (error) {
            showSnackbar('Failed to load notes', 'error');
            console.error('Error fetching notes:', error);
        }
    };

    const fetchCategoryStats = async () => {
        try {
            const response = await apiService.getCategoryStats();
            setCategoryStats(response.data);
        } catch (error) {
            console.error('Error fetching category stats:', error);
        }
    };

    const fetchSummary = async () => {
        try {
            const response = await apiService.getNotesSummary();
            setSummary(response.data);
        } catch (error) {
            console.error('Error fetching summary:', error);
        }
    };

    // ===================== HANDLE FILTER =====================
    const handleCategoryFilter = async (category) => {
        setCategoryFilter(category);
        if (category) {
            try {
                const response = await apiService.getNotesByCategory(category);
                setNotes(response.data || []);
            } catch (error) {
                showSnackbar('Failed to filter notes', 'error');
                console.error('Error filtering notes:', error);
            }
        } else {
            await fetchNotes();
        }
    };

    // ===================== SHOW SNACKBAR =====================
    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    // ===================== VALIDATE FORM =====================
    const validateForm = (noteData) => {
        let isValid = true;
        const newErrors = { title: '' };

        if (!noteData.title.trim()) {
            newErrors.title = 'Title is required';
            isValid = false;
        } else if (noteData.title.trim().length < 3) {
            newErrors.title = 'Title must be at least 3 characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // ===================== ADD NOTE =====================
    const handleAddNote = async () => {
        if (!validateForm(newNote)) {
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await apiService.addNote({
                title: newNote.title.trim(),
                description: newNote.description.trim(),
                category: newNote.category
            });

            // Refresh notes
            await fetchNotes(categoryFilter);
            await fetchCategoryStats();
            await fetchSummary();

            setNewNote({
                title: '',
                description: '',
                category: 'Personal'
            });
            setErrors({ title: '' });
            setShowAddModal(false);
            showSnackbar('Note added successfully!');
        } catch (error) {
            showSnackbar(error.message || 'Failed to create note', 'error');
            console.error('Error creating note:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ===================== DELETE NOTE =====================
    const handleDeleteClick = (noteId) => {
        setSelectedNoteId(noteId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const noteToDelete = notes.find(n => n.id === selectedNoteId);
            await apiService.deleteNote(selectedNoteId);
            
            // Refresh notes
            await fetchNotes(categoryFilter);
            await fetchCategoryStats();
            await fetchSummary();
            
            setShowDeleteModal(false);
            setSelectedNoteId(null);
            showSnackbar(`Note "${noteToDelete?.title}" deleted successfully`);
        } catch (error) {
            showSnackbar('Failed to delete note', 'error');
            console.error('Error deleting note:', error);
        }
    };

    // ===================== EDIT NOTE =====================
    const handleEditClick = (note) => {
        setSelectedNote(note);
        setEditNoteData({
            title: note.title,
            description: note.description || '',
            category: note.category
        });
        setShowEditModal(true);
    };

    const handleUpdateNote = async () => {
        if (!validateForm(editNoteData)) {
            return;
        }

        setIsSubmitting(true);
        try {
            await apiService.updateNote(selectedNote.id, {
                title: editNoteData.title.trim(),
                description: editNoteData.description.trim(),
                category: editNoteData.category
            });

            // Refresh notes
            await fetchNotes(categoryFilter);
            await fetchCategoryStats();
            await fetchSummary();

            setShowEditModal(false);
            setSelectedNote(null);
            showSnackbar('Note updated successfully!');
        } catch (error) {
            showSnackbar(error.message || 'Failed to update note', 'error');
            console.error('Error updating note:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ===================== CLOSE HANDLERS =====================
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleModalClose = () => {
        setShowAddModal(false);
        setErrors({ title: '' });
        setNewNote({
            title: '',
            description: '',
            category: 'Personal'
        });
    };

    const handleEditModalClose = () => {
        setShowEditModal(false);
        setSelectedNote(null);
        setErrors({ title: '' });
    };

    // ===================== UTILITY FUNCTIONS =====================
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

    // ===================== LOADING STATE =====================
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
                <span style={{ marginLeft: '16px', color: '#6B7280' }}>Loading notes...</span>
            </Box>
        );
    }

    // ===================== RENDER =====================
    return (
        <>
            {/* Header */}
            <div style={{ 
                padding: '20px 0', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderBottom: '1px solid #e5e7eb',
                flexWrap: 'wrap',
                gap: '10px'
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
                        {summary && ` • ${summary.total_notes || 0} total`}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Category Filter Dropdown */}
                    <FormControl size="small" style={{ minWidth: '120px' }}>
                        <Select
                            value={categoryFilter}
                            onChange={(e) => handleCategoryFilter(e.target.value)}
                            displayEmpty
                            style={{ backgroundColor: '#1F2937', color: '#fff' }}
                        >
                            <MenuItem value="">All Categories</MenuItem>
                            {categories.map((cat) => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    
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
            </div>

            {/* Category Stats */}
            {categoryStats && categoryStats.categories && categoryStats.categories.length > 0 && (
                <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {categoryStats.categories.map((stat) => (
                        <Chip
                            key={stat.category}
                            label={`${stat.category}: ${stat.count}`}
                            onClick={() => handleCategoryFilter(stat.category)}
                            style={{
                                backgroundColor: getCategoryColor(stat.category),
                                color: '#fff',
                                cursor: 'pointer'
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Notes Grid */}
            <div style={{ marginTop: '24px' }}>
                {notes.length === 0 ? (
                    <Box textAlign="center" py={8}>
                        <Typography variant="body1" color="text.secondary">
                            No notes found. Click "Add Note" to create your first note!
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
                                        backgroundColor: '#1F2937',
                                        '&:hover': {
                                            boxShadow: '0 8px 24px rgba(99,102,241,0.2)',
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
                                                    pr: 4,
                                                    cursor: 'pointer',
                                                    '&:hover': { color: '#6366F1' }
                                                }}
                                                onClick={() => handleEditClick(note)}
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
                                            sx={{
                                                mb: 2,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                minHeight: '60px',
                                                color: '#9CA3AF'
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
                                            <Typography variant="caption" sx={{ color: '#6B7280' }}>
                                                {formatDate(note.date || note.createtime)}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </div>

            {/* ==================== ADD NOTE MODAL ==================== */}
            <Modal
                show={showAddModal}
                onHide={handleModalClose}
                centered
                size="sm"
            >
                <Modal.Header
                    closeButton
                    style={{
                        background: "#1F2937",
                        borderBottom: "1px solid #374151",
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
                            color: "#ffffff"
                        }}
                    >
                        <IconSticker2 style={{ color: "#6366F1", fontSize: "22px" }} />
                        Add New Note
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body style={{ padding: "24px", background: "#1F2937" }}>
                    <div style={{ marginBottom: "16px" }}>
                        <label style={{
                            display: "block",
                            marginBottom: "6px",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#9CA3AF"
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
                            sx={{
                                '& .MuiInputBase-root': {
                                    backgroundColor: '#374151',
                                    color: '#fff'
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#9CA3AF'
                                },
                                '& .MuiFormHelperText-root': {
                                    color: '#f44336'
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
                            color: "#9CA3AF"
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
                            sx={{
                                '& .MuiInputBase-root': {
                                    backgroundColor: '#374151',
                                    color: '#fff'
                                }
                            }}
                        />
                    </div>

                    <div>
                        <label style={{
                            display: "block",
                            marginBottom: "6px",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#9CA3AF"
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
                                style={{
                                    backgroundColor: '#374151',
                                    color: '#fff'
                                }}
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
                        borderTop: "1px solid #374151",
                        padding: "12px 24px",
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px",
                        background: "#1F2937"
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={handleModalClose}
                        disabled={isSubmitting}
                        style={{
                            borderRadius: "8px",
                            padding: "6px 20px",
                            textTransform: "none",
                            fontSize: "14px",
                            color: '#9CA3AF',
                            borderColor: '#374151'
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleAddNote}
                        disabled={isSubmitting}
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
                        {isSubmitting ? 'Saving...' : 'Save Note'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* ==================== EDIT NOTE MODAL ==================== */}
            <Modal
                show={showEditModal}
                onHide={handleEditModalClose}
                centered
                size="sm"
            >
                <Modal.Header
                    closeButton
                    style={{
                        background: "#1F2937",
                        borderBottom: "1px solid #374151",
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
                            color: "#ffffff"
                        }}
                    >
                        <IconSticker2 style={{ color: "#6366F1", fontSize: "22px" }} />
                        Edit Note
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body style={{ padding: "24px", background: "#1F2937" }}>
                    <div style={{ marginBottom: "16px" }}>
                        <label style={{
                            display: "block",
                            marginBottom: "6px",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#9CA3AF"
                        }}>
                            Title *
                        </label>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Enter note title..."
                            value={editNoteData.title}
                            onChange={(e) => {
                                setEditNoteData((prev) => ({
                                    ...prev,
                                    title: e.target.value,
                                }));
                                if (errors.title) {
                                    setErrors({ ...errors, title: '' });
                                }
                            }}
                            error={!!errors.title}
                            helperText={errors.title}
                            sx={{
                                '& .MuiInputBase-root': {
                                    backgroundColor: '#374151',
                                    color: '#fff'
                                },
                                '& .MuiFormHelperText-root': {
                                    color: '#f44336'
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
                            color: "#9CA3AF"
                        }}>
                            Description
                        </label>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            size="small"
                            placeholder="Write your note..."
                            value={editNoteData.description}
                            onChange={(e) =>
                                setEditNoteData((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                }))
                            }
                            sx={{
                                '& .MuiInputBase-root': {
                                    backgroundColor: '#374151',
                                    color: '#fff'
                                }
                            }}
                        />
                    </div>

                    <div>
                        <label style={{
                            display: "block",
                            marginBottom: "6px",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#9CA3AF"
                        }}>
                            Category
                        </label>
                        <FormControl fullWidth size="small">
                            <Select
                                value={editNoteData.category}
                                onChange={(e) =>
                                    setEditNoteData((prev) => ({
                                        ...prev,
                                        category: e.target.value,
                                    }))
                                }
                                style={{
                                    backgroundColor: '#374151',
                                    color: '#fff'
                                }}
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
                        borderTop: "1px solid #374151",
                        padding: "12px 24px",
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px",
                        background: "#1F2937"
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={handleEditModalClose}
                        disabled={isSubmitting}
                        style={{
                            borderRadius: "8px",
                            padding: "6px 20px",
                            textTransform: "none",
                            fontSize: "14px",
                            color: '#9CA3AF',
                            borderColor: '#374151'
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleUpdateNote}
                        disabled={isSubmitting}
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
                        {isSubmitting ? 'Updating...' : 'Update Note'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* ==================== DELETE CONFIRMATION MODAL ==================== */}
            <Modal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                centered
                size="sm"
            >
                <Modal.Header
                    closeButton
                    style={{
                        background: "#1F2937",
                        borderBottom: "1px solid #374151",
                        padding: "16px 24px"
                    }}
                >
                    <Modal.Title
                        style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#ffffff"
                        }}
                    >
                        Delete Note
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body style={{ padding: "24px", background: "#1F2937" }}>
                    <Typography variant="body1" sx={{ color: '#9CA3AF' }}>
                        Are you sure you want to delete this note?
                    </Typography>
                    {selectedNoteId && (
                        <Typography variant="body2" sx={{ color: '#d5d9e2', mt: 1, fontWeight: 500 }}>
                            "{notes.find(n => n.id === selectedNoteId)?.title}"
                        </Typography>
                    )}
                </Modal.Body>

                <Modal.Footer
                    style={{
                        borderTop: "1px solid #374151",
                        padding: "12px 24px",
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px",
                        background: "#1F2937"
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={() => setShowDeleteModal(false)}
                        style={{
                            borderRadius: "8px",
                            padding: "6px 20px",
                            textTransform: "none",
                            fontSize: "14px",
                            color: '#9CA3AF',
                            borderColor: '#374151'
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

            {/* ==================== SNACKBAR ==================== */}
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
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        backgroundColor: snackbar.severity === 'success' ? '#1F2937' : '#1F2937',
                        color: '#fff'
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default TaskManagement;