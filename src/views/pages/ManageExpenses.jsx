import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { ArrowDropDown } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './main.css';
import OutlinedInput from '@mui/material/OutlinedInput';
import { IconSearch } from '@tabler/icons-react';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Box from '@mui/material/Box';
import axios from 'axios';
import { API_URL } from 'config/constant';
import { APP_PREFIX_PATH } from 'config/constant';
import { useNavigate } from "react-router-dom";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import PaidIcon from '@mui/icons-material/Paid';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PieChartIcon from '@mui/icons-material/PieChart';

// Expense categories
const expenseCategories = [
  { id: 'shop_rent', label: 'Shop Rent', color: '#FF6B6B', icon: '🏢' },
  { id: 'electricity', label: 'Electricity', color: '#4ECDC4', icon: '💡' },
  { id: 'water', label: 'Water Bill', color: '#45B7D1', icon: '💧' },
  { id: 'salary', label: 'Salary', color: '#96CEB4', icon: '👨‍🏫' },
  { id: 'internet', label: 'Internet', color: '#FFEAA7', icon: '🌐' },
  { id: 'maintenance', label: 'Maintenance', color: '#DDA0DD', icon: '🔧' },
  { id: 'stationery', label: 'Stationery', color: '#98D8C8', icon: '📚' },
  { id: 'marketing', label: 'Marketing', color: '#F7DC6F', icon: '📢' },
  { id: 'others', label: 'Others', color: '#BB8FCE', icon: '📦' }
];

// Table columns
const columns = [
  { id: 'S_No', label: 'S.No.', align: 'center', minWidth: 80 },
  { id: 'actions', label: 'Actions', minWidth: 120, align: 'center' },
  { id: 'date', label: 'Date', align: 'center', minWidth: 120 },
  { id: 'category', label: 'Category', align: 'center', minWidth: 150 },
  { id: 'description', label: 'Description', align: 'center', minWidth: 200 },
  { id: 'amount', label: 'Amount (₹)', align: 'center', minWidth: 120 },
  { id: 'payment_mode', label: 'Payment Mode', align: 'center', minWidth: 150 },
  { id: 'receipt', label: 'Receipt No.', align: 'center', minWidth: 150 },
  { id: 'remarks', label: 'Remarks', align: 'center', minWidth: 200 }
];

// Payment modes
const paymentModes = [
  'Cash',
  'Bank Transfer',
  'UPI',
  'Cheque',
  'Credit Card',
  'Debit Card'
];

const ManageExpenses = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  // State management
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [expenseData, setExpenseData] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState('');
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [expenseToView, setExpenseToView] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Summary states
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [yearlyExpenses, setYearlyExpenses] = useState(0);
  const [categoryWiseExpenses, setCategoryWiseExpenses] = useState({});
  const [currentMonth, setCurrentMonth] = useState(dayjs().format('MMMM YYYY'));
  const [currentYear, setCurrentYear] = useState(dayjs().format('YYYY'));
  
  // Filter states
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterMonth, setFilterMonth] = useState('all');
  const [filterYear, setFilterYear] = useState(currentYear);
  
  // Add state
  const [addDate, setAddDate] = useState(dayjs());
  const [addCategory, setAddCategory] = useState('');
  const [addDescription, setAddDescription] = useState('');
  const [addAmount, setAddAmount] = useState('');
  const [addPaymentMode, setAddPaymentMode] = useState('Cash');
  const [addReceiptNo, setAddReceiptNo] = useState('');
  const [addRemarks, setAddRemarks] = useState('');
  
  // Add error states
  const [addDateError, setAddDateError] = useState('');
  const [addCategoryError, setAddCategoryError] = useState('');
  const [addDescriptionError, setAddDescriptionError] = useState('');
  const [addAmountError, setAddAmountError] = useState('');
  
  // Edit state
  const [editDate, setEditDate] = useState(dayjs());
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editPaymentMode, setEditPaymentMode] = useState('Cash');
  const [editReceiptNo, setEditReceiptNo] = useState('');
  const [editRemarks, setEditRemarks] = useState('');
  
  // Edit error states
  const [editDateError, setEditDateError] = useState('');
  const [editCategoryError, setEditCategoryError] = useState('');
  const [editDescriptionError, setEditDescriptionError] = useState('');
  const [editAmountError, setEditAmountError] = useState('');
  
  // General error
  const [error, setError] = useState('');

  // Initialize with mock data
  useEffect(() => {
    fetchData();
  }, []);

  // Calculate summary when data changes
  useEffect(() => {
    calculateSummary();
  }, [expenseData]);

  // Filter expenses when filters change
  useEffect(() => {
    filterExpenses();
  }, [searchQuery, filterCategory, filterMonth, filterYear, expenseData]);

  const fetchData = () => {
    // Mock data for demonstration
    const mockExpenseData = [
      {
        id: 'E001',
        date: '2024-03-01',
        category: 'shop_rent',
        description: 'Monthly shop rent',
        amount: 15000,
        payment_mode: 'Bank Transfer',
        receipt_no: 'RCPT-001',
        remarks: 'Paid to landlord'
      },
      {
        id: 'E002',
        date: '2024-03-05',
        category: 'electricity',
        description: 'Monthly electricity bill',
        amount: 2500,
        payment_mode: 'UPI',
        receipt_no: 'RCPT-002',
        remarks: 'March bill payment'
      },
      {
        id: 'E003',
        date: '2024-03-10',
        category: 'water',
        description: 'Water bill payment',
        amount: 800,
        payment_mode: 'Cash',
        receipt_no: 'RCPT-003',
        remarks: 'Quarterly bill'
      },
      {
        id: 'E004',
        date: '2024-03-15',
        category: 'salary',
        description: 'Teacher salaries',
        amount: 45000,
        payment_mode: 'Bank Transfer',
        receipt_no: 'RCPT-004',
        remarks: 'March salary disbursement'
      },
      {
        id: 'E005',
        date: '2024-03-20',
        category: 'internet',
        description: 'Internet subscription',
        amount: 1200,
        payment_mode: 'UPI',
        receipt_no: 'RCPT-005',
        remarks: 'Monthly plan'
      },
      {
        id: 'E006',
        date: '2024-02-01',
        category: 'shop_rent',
        description: 'Monthly shop rent',
        amount: 15000,
        payment_mode: 'Bank Transfer',
        receipt_no: 'RCPT-006',
        remarks: 'February rent'
      },
      {
        id: 'E007',
        date: '2024-02-05',
        category: 'electricity',
        description: 'Electricity bill',
        amount: 2200,
        payment_mode: 'UPI',
        receipt_no: 'RCPT-007',
        remarks: 'February bill'
      }
    ].map((expense, index) => ({
      ...expense,
      s_no: index + 1,
      category_label: expenseCategories.find(cat => cat.id === expense.category)?.label || expense.category,
      category_color: expenseCategories.find(cat => cat.id === expense.category)?.color || '#000',
      category_icon: expenseCategories.find(cat => cat.id === expense.category)?.icon || '📦'
    }));

    setExpenseData(mockExpenseData);
  };

  const calculateSummary = () => {
    if (expenseData.length === 0) {
      setTotalExpenses(0);
      setMonthlyExpenses(0);
      setYearlyExpenses(0);
      setCategoryWiseExpenses({});
      return;
    }

    // Total expenses
    const total = expenseData.reduce((sum, expense) => sum + expense.amount, 0);
    setTotalExpenses(total);

    // Monthly expenses (current month)
    const currentMonthStart = dayjs().startOf('month').format('YYYY-MM-DD');
    const currentMonthEnd = dayjs().endOf('month').format('YYYY-MM-DD');
    const monthly = expenseData
      .filter(expense => expense.date >= currentMonthStart && expense.date <= currentMonthEnd)
      .reduce((sum, expense) => sum + expense.amount, 0);
    setMonthlyExpenses(monthly);

    // Yearly expenses (current year)
    const yearly = expenseData
      .filter(expense => expense.date.startsWith(currentYear))
      .reduce((sum, expense) => sum + expense.amount, 0);
    setYearlyExpenses(yearly);

    // Category-wise expenses
    const categoryTotals = {};
    expenseCategories.forEach(category => {
      const total = expenseData
        .filter(expense => expense.category === category.id)
        .reduce((sum, expense) => sum + expense.amount, 0);
      categoryTotals[category.id] = total;
    });
    setCategoryWiseExpenses(categoryTotals);
  };

  const filterExpenses = () => {
    let filtered = [...expenseData];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(expense =>
        expense.description?.toLowerCase().includes(query) ||
        expense.category_label?.toLowerCase().includes(query) ||
        expense.payment_mode?.toLowerCase().includes(query) ||
        expense.receipt_no?.toLowerCase().includes(query) ||
        expense.remarks?.toLowerCase().includes(query) ||
        expense.amount?.toString().includes(query)
      );
    }

    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(expense => expense.category === filterCategory);
    }

    // Apply month filter
    if (filterMonth !== 'all') {
      filtered = filtered.filter(expense => {
        const expenseMonth = dayjs(expense.date).format('MMMM');
        return expenseMonth === filterMonth;
      });
    }

    // Apply year filter
    if (filterYear !== 'all') {
      filtered = filtered.filter(expense => expense.date.startsWith(filterYear));
    }

    setFilteredExpenses(filtered);
  };

  const handleClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setSelectedIndex(index);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedIndex(null);
  };

  const handleAction = (action, expenseData) => {
    if (action === 'view') {
      setShowViewModal(true);
      setExpenseToView(expenseData);
      setSelectedIndex(null);
    } else if (action === 'Edit') {
      setShowEditModal(true);
      setExpenseToEdit(expenseData);
      setEditDate(dayjs(expenseData.date));
      setEditCategory(expenseData.category);
      setEditDescription(expenseData.description || '');
      setEditAmount(expenseData.amount.toString());
      setEditPaymentMode(expenseData.payment_mode || 'Cash');
      setEditReceiptNo(expenseData.receipt_no || '');
      setEditRemarks(expenseData.remarks || '');
      setExpenseToDelete(expenseData.id || expenseData.s_no);
    } else if (action === 'Delete') {
      setShowDeleteModal(true);
      setExpenseToDelete(expenseData.id || expenseData.s_no);
      setSelectedIndex(null);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();

    let hasError = false;

    // Clear previous errors
    setAddDateError('');
    setAddCategoryError('');
    setAddDescriptionError('');
    setAddAmountError('');
    setError('');

    // Validation
    if (!addDate) {
      setAddDateError('Please select date');
      hasError = true;
    }

    if (!addCategory) {
      setAddCategoryError('Please select category');
      hasError = true;
    }

    if (!addDescription.trim()) {
      setAddDescriptionError('Please enter description');
      hasError = true;
    }

    if (!addAmount.trim()) {
      setAddAmountError('Please enter amount');
      hasError = true;
    } else if (isNaN(addAmount) || parseFloat(addAmount) <= 0) {
      setAddAmountError('Please enter valid amount');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // Create new expense
    const newExpense = {
      id: `E${(expenseData.length + 1).toString().padStart(3, '0')}`,
      s_no: expenseData.length + 1,
      date: addDate.format('YYYY-MM-DD'),
      category: addCategory,
      category_label: expenseCategories.find(cat => cat.id === addCategory)?.label || addCategory,
      category_color: expenseCategories.find(cat => cat.id === addCategory)?.color || '#000',
      category_icon: expenseCategories.find(cat => cat.id === addCategory)?.icon || '📦',
      description: addDescription,
      amount: parseFloat(addAmount),
      payment_mode: addPaymentMode,
      receipt_no: addReceiptNo,
      remarks: addRemarks
    };

    // Add to data
    setExpenseData(prev => [...prev, newExpense]);
    setShowAddModal(false);
    resetAddForm();
  };

  const handleEdit = (e) => {
    e.preventDefault();

    let hasError = false;

    // Clear previous errors
    setEditDateError('');
    setEditCategoryError('');
    setEditDescriptionError('');
    setEditAmountError('');
    setError('');

    // Validation
    if (!editDate) {
      setEditDateError('Please select date');
      hasError = true;
    }

    if (!editCategory) {
      setEditCategoryError('Please select category');
      hasError = true;
    }

    if (!editDescription.trim()) {
      setEditDescriptionError('Please enter description');
      hasError = true;
    }

    if (!editAmount.trim()) {
      setEditAmountError('Please enter amount');
      hasError = true;
    } else if (isNaN(editAmount) || parseFloat(editAmount) <= 0) {
      setEditAmountError('Please enter valid amount');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // Update expense
    setExpenseData(prev => prev.map(expense => {
      if (expense.id === expenseToDelete || expense.s_no === expenseToDelete) {
        return {
          ...expense,
          date: editDate.format('YYYY-MM-DD'),
          category: editCategory,
          category_label: expenseCategories.find(cat => cat.id === editCategory)?.label || editCategory,
          category_color: expenseCategories.find(cat => cat.id === editCategory)?.color || '#000',
          category_icon: expenseCategories.find(cat => cat.id === editCategory)?.icon || '📦',
          description: editDescription,
          amount: parseFloat(editAmount),
          payment_mode: editPaymentMode,
          receipt_no: editReceiptNo,
          remarks: editRemarks
        };
      }
      return expense;
    }));

    setShowEditModal(false);
    resetEditForm();
  };

  const deleteExpense = () => {
    setExpenseData(prev => prev.filter(expense => 
      expense.id !== expenseToDelete && expense.s_no !== expenseToDelete
    ));
    setShowDeleteModal(false);
  };

  const resetAddForm = () => {
    setAddDate(dayjs());
    setAddCategory('');
    setAddDescription('');
    setAddAmount('');
    setAddPaymentMode('Cash');
    setAddReceiptNo('');
    setAddRemarks('');
    setAddDateError('');
    setAddCategoryError('');
    setAddDescriptionError('');
    setAddAmountError('');
    setError('');
  };

  const resetEditForm = () => {
    setEditDate(dayjs());
    setEditCategory('');
    setEditDescription('');
    setEditAmount('');
    setEditPaymentMode('Cash');
    setEditReceiptNo('');
    setEditRemarks('');
    setEditDateError('');
    setEditCategoryError('');
    setEditDescriptionError('');
    setEditAmountError('');
    setError('');
    setExpenseToEdit(null);
    setExpenseToDelete('');
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getMonths = () => {
    return [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  };

  const getYears = () => {
    const currentYear = dayjs().year();
    return Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {/* Header */}
      <div className="col-xl-12" style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '10px', marginBottom: '20px' }}>
        <p
          style={{
            fontSize: '1.25rem',
            color: '#121926',
            fontWeight: '600',
            fontFamily: 'Poppins',
            lineHeight: '1.167',
            marginBottom: '5px'
          }}
        >
          Expense Management
        </p>
        <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
          Track and manage all your coaching center expenses
        </p>
      </div>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#F0F9FF', border: '1px solid #B3E0FF' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <div>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Total Expenses
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(totalExpenses)}
                  </Typography>
                </div>
                <AttachMoneyIcon sx={{ fontSize: 40, color: '#0369A1' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <div>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Monthly Expenses ({currentMonth})
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(monthlyExpenses)}
                  </Typography>
                </div>
                <TrendingUpIcon sx={{ fontSize: 40, color: '#16A34A' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#FEF3C7', border: '1px solid #FDE68A' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <div>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Yearly Expenses ({currentYear})
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(yearlyExpenses)}
                  </Typography>
                </div>
                <TrendingDownIcon sx={{ fontSize: 40, color: '#D97706' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Category-wise Expenses */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PieChartIcon /> Category-wise Expenses
        </Typography>
        <Grid container spacing={2}>
          {expenseCategories.map(category => (
            <Grid item xs={6} sm={4} md={3} lg={2.4} key={category.id}>
              <Box
                sx={{
                  p: 2,
                  border: '1px solid #E5E7EB',
                  borderRadius: 2,
                  textAlign: 'center',
                  bgcolor: category.color + '15'
                }}
              >
                <Typography variant="body2" color="textSecondary">
                  {category.icon} {category.label}
                </Typography>
                <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
                  {formatCurrency(categoryWiseExpenses[category.id] || 0)}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Search and Filters */}
      <Box alignItems="center" justifyContent="space-between" display="flex" className="mobile-res" sx={{ mb: 3 }}>
        <OutlinedInput
          sx={{ pr: 1, pl: 2, flex: 1, mr: 2 }}
          id="input-search-expenses"
          onChange={handleSearch}
          placeholder="Search expenses by description, category, amount..."
          startAdornment={
            <InputAdornment position="start">
              <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
            </InputAdornment>
          }
          aria-describedby="search-helper-text"
          inputProps={{
            'aria-label': 'weight'
          }}
        />
        
        {/* Filters */}
        <Box display="flex" gap={2}>
          <select
            className="form-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="all">All Categories</option>
            {expenseCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
          
          <select
            className="form-select"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="all">All Months</option>
            {getMonths().map(month => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          
          <select
            className="form-select"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            style={{ width: '120px' }}
          >
            <option value="all">All Years</option>
            {getYears().map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </Box>
        
        <Button 
          className="btn btn-primary" 
          onClick={() => setShowAddModal(true)}
          style={{ width: '180px', marginLeft: '16px' }}
        >
          <AddIcon />
          Add Expense
        </Button>
      </Box>

      {/* Expenses Table */}
      <Paper sx={{ width: '100%' }}>
        <TableContainer sx={{ maxHeight: 640 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell 
                    key={column.id} 
                    align={column.align} 
                    style={{ 
                      minWidth: column.minWidth,
                      backgroundColor: '#F9FAFB',
                      fontWeight: '600'
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExpenses.length > 0 ? (
                filteredExpenses
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      <TableCell style={{ textAlign: 'center' }}>{row.s_no}</TableCell>
                      
                      <TableCell style={{ textAlign: 'center' }}>
                        <Button
                          className="btn btn-primary"
                          aria-label="more"
                          aria-controls="long-menu"
                          aria-haspopup="true"
                          onClick={(event) => handleClick(event, index)}
                          size="small"
                        >
                          Actions <ArrowDropDown />
                        </Button>
                        <Menu
                          id="long-menu"
                          anchorEl={anchorEl}
                          keepMounted
                          open={selectedIndex === index}
                          onClose={handleClose}
                        >
                          <MenuItem onClick={() => handleAction('view', row)} className="menu-icons">
                            <VisibilityIcon style={{ marginRight: '8px' }} />
                            View Details
                          </MenuItem>
                          <MenuItem onClick={() => handleAction('Edit', row)} className="menu-icons">
                            <EditIcon style={{ marginRight: '8px' }} />
                            Edit
                          </MenuItem>
                          <MenuItem onClick={() => handleAction('Delete', row)} className="menu-icons">
                            <DeleteIcon style={{ marginRight: '8px' }} />
                            Delete
                          </MenuItem>
                        </Menu>
                      </TableCell>

                      <TableCell style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CalendarTodayIcon sx={{ mr: 1, fontSize: 16 }} />
                          {dayjs(row.date).format('DD/MM/YYYY')}
                        </div>
                      </TableCell>

                      <TableCell style={{ textAlign: 'center' }}>
                        <Chip
                          label={row.category_label}
                          style={{
                            backgroundColor: row.category_color + '20',
                            color: row.category_color,
                            border: `1px solid ${row.category_color}`,
                            fontWeight: '500'
                          }}
                          icon={<span>{row.category_icon}</span>}
                          size="small"
                        />
                      </TableCell>

                      <TableCell style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <DescriptionIcon sx={{ mr: 1, fontSize: 16 }} />
                          {row.description}
                        </div>
                      </TableCell>

                      <TableCell style={{ textAlign: 'center', fontWeight: 'bold', color: '#DC2626' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <AttachMoneyIcon sx={{ mr: 1, fontSize: 16 }} />
                          {formatCurrency(row.amount)}
                        </div>
                      </TableCell>

                      <TableCell style={{ textAlign: 'center' }}>
                        <Chip
                          label={row.payment_mode}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>

                      <TableCell style={{ textAlign: 'center' }}>
                        {row.receipt_no || '-'}
                      </TableCell>

                      <TableCell style={{ textAlign: 'center' }}>
                        {row.remarks || '-'}
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} style={{ textAlign: 'center', padding: '40px' }}>
                    <DescriptionIcon sx={{ fontSize: 48, color: '#9CA3AF', mb: 2 }} />
                    <Typography variant="h6" color="textSecondary">
                      No expenses found
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      {searchQuery || filterCategory !== 'all' || filterMonth !== 'all' || filterYear !== 'all'
                        ? 'Try adjusting your search or filters'
                        : 'Add your first expense using the "Add Expense" button'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
          <p style={{ marginLeft: '26px', marginTop: '15px' }}>
            {`Showing ${Math.min(filteredExpenses.length > 0 ? page * rowsPerPage + 1 : 0, filteredExpenses.length)} to ${Math.min((page + 1) * rowsPerPage, filteredExpenses.length)} of ${filteredExpenses.length} entries`}
          </p>
          <div style={{ marginRight: '15px' }}>
            <button 
              onClick={() => handleChangePage(null, page - 1)} 
              disabled={page === 0} 
              style={{ marginRight: '8px' }}
            >
              {'<'}
            </button>
            <button
              onClick={() => handleChangePage(null, page + 1)}
              disabled={(page + 1) * rowsPerPage >= filteredExpenses.length}
            >
              {'>'}
            </button>
          </div>
        </div>
      </Paper>

      {/* View Expense Modal */}
      <Modal 
        show={showViewModal} 
        onHide={() => setShowViewModal(false)} 
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Expense Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {expenseToView && (
            <div>
              <div className="row mb-4">
                <div className="col-md-3 d-flex justify-content-center align-items-center">
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      backgroundColor: expenseToView.category_color + '30',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem'
                    }}
                  >
                    {expenseToView.category_icon}
                  </div>
                </div>
                <div className="col-md-9">
                  <h4>{expenseToView.category_label}</h4>
                  <h3 className="text-danger">{formatCurrency(expenseToView.amount)}</h3>
                  <p className="text-muted mb-1">
                    <CalendarTodayIcon fontSize="small" className="me-2" />
                    {dayjs(expenseToView.date).format('DD MMMM YYYY')}
                  </p>
                  <p className="text-muted">
                    <ReceiptIcon fontSize="small" className="me-2" />
                    Receipt No: {expenseToView.receipt_no || 'Not provided'}
                  </p>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-12 mb-3">
                  <h6>Description</h6>
                  <p className="p-2 bg-light rounded">
                    {expenseToView.description}
                  </p>
                </div>
                
                <div className="col-md-6 mb-3">
                  <h6>Payment Mode</h6>
                  <p>
                    <PaidIcon fontSize="small" className="me-2" />
                    {expenseToView.payment_mode}
                  </p>
                </div>
                
                <div className="col-md-6 mb-3">
                  <h6>Remarks</h6>
                  <p className="p-2 bg-light rounded">
                    {expenseToView.remarks || 'No remarks'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Expense Modal */}
      <Modal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleEdit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Date *</label>
                <DatePicker
                  value={editDate}
                  onChange={(newValue) => {
                    setEditDate(newValue);
                    setEditDateError('');
                  }}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!editDateError,
                      helperText: editDateError
                    }
                  }}
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label">Category *</label>
                <select
                  className={`form-select ${editCategoryError ? 'is-invalid' : ''}`}
                  value={editCategory}
                  onChange={(e) => {
                    setEditCategory(e.target.value);
                    setEditCategoryError('');
                  }}
                >
                  <option value="">Select Category</option>
                  {expenseCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.label}
                    </option>
                  ))}
                </select>
                {editCategoryError && <div className="text-danger small">{editCategoryError}</div>}
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-12 mb-3">
                <label className="form-label">Description *</label>
                <textarea
                  className={`form-control ${editDescriptionError ? 'is-invalid' : ''}`}
                  value={editDescription}
                  onChange={(e) => {
                    setEditDescription(e.target.value);
                    setEditDescriptionError('');
                  }}
                  placeholder="Enter expense description"
                  rows={3}
                />
                {editDescriptionError && <div className="text-danger small">{editDescriptionError}</div>}
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Amount (₹) *</label>
                <input
                  type="number"
                  className={`form-control ${editAmountError ? 'is-invalid' : ''}`}
                  value={editAmount}
                  onChange={(e) => {
                    setEditAmount(e.target.value);
                    setEditAmountError('');
                  }}
                  placeholder="Enter amount"
                  step="0.01"
                />
                {editAmountError && <div className="text-danger small">{editAmountError}</div>}
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label">Payment Mode</label>
                <select
                  className="form-select"
                  value={editPaymentMode}
                  onChange={(e) => setEditPaymentMode(e.target.value)}
                >
                  {paymentModes.map(mode => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Receipt Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={editReceiptNo}
                  onChange={(e) => setEditReceiptNo(e.target.value)}
                  placeholder="Enter receipt number"
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label">Remarks</label>
                <input
                  type="text"
                  className="form-control"
                  value={editRemarks}
                  onChange={(e) => setEditRemarks(e.target.value)}
                  placeholder="Any additional remarks"
                />
              </div>
            </div>
            
            {error && <div className="alert alert-danger">{error}</div>}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEdit}>
            Update Expense
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Expense Modal */}
      <Modal 
        show={showAddModal} 
        onHide={() => setShowAddModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAdd}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Date *</label>
                <DatePicker
                  value={addDate}
                  onChange={(newValue) => {
                    setAddDate(newValue);
                    setAddDateError('');
                  }}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!addDateError,
                      helperText: addDateError
                    }
                  }}
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label">Category *</label>
                <select
                  className={`form-select ${addCategoryError ? 'is-invalid' : ''}`}
                  value={addCategory}
                  onChange={(e) => {
                    setAddCategory(e.target.value);
                    setAddCategoryError('');
                  }}
                >
                  <option value="">Select Category</option>
                  {expenseCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.label}
                    </option>
                  ))}
                </select>
                {addCategoryError && <div className="text-danger small">{addCategoryError}</div>}
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-12 mb-3">
                <label className="form-label">Description *</label>
                <textarea
                  className={`form-control ${addDescriptionError ? 'is-invalid' : ''}`}
                  value={addDescription}
                  onChange={(e) => {
                    setAddDescription(e.target.value);
                    setAddDescriptionError('');
                  }}
                  placeholder="Enter expense description"
                  rows={3}
                />
                {addDescriptionError && <div className="text-danger small">{addDescriptionError}</div>}
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Amount (₹) *</label>
                <input
                  type="number"
                  className={`form-control ${addAmountError ? 'is-invalid' : ''}`}
                  value={addAmount}
                  onChange={(e) => {
                    setAddAmount(e.target.value);
                    setAddAmountError('');
                  }}
                  placeholder="Enter amount"
                  step="0.01"
                />
                {addAmountError && <div className="text-danger small">{addAmountError}</div>}
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label">Payment Mode</label>
                <select
                  className="form-select"
                  value={addPaymentMode}
                  onChange={(e) => setAddPaymentMode(e.target.value)}
                >
                  {paymentModes.map(mode => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Receipt Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={addReceiptNo}
                  onChange={(e) => setAddReceiptNo(e.target.value)}
                  placeholder="Enter receipt number"
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label">Remarks</label>
                <input
                  type="text"
                  className="form-control"
                  value={addRemarks}
                  onChange={(e) => setAddRemarks(e.target.value)}
                  placeholder="Any additional remarks"
                />
              </div>
            </div>
            
            {error && <div className="alert alert-danger">{error}</div>}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            Add Expense
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)} 
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this expense record? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteExpense}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </LocalizationProvider>
  );
};

export default ManageExpenses;