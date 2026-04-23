import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  X,
  Tag,
  FolderOpen,
  Layers,
  Camera,
  UserCog
} from 'lucide-react';
import { toast } from 'react-toastify';
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  featured: boolean;
  image: string;
  images?: string[];
  description?: string;
  ingredients?: string[];
  weight?: string;
}

interface Order {
  _id: string;
  user: { name: string; email: string };
  orderItems: Array<{ name: string; quantity: number; price: number }>;
  totalPrice: number;
  orderStatus: string;
  createdAt: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    phone: string;
  };
  deliveryPhoto?: string;
}

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  createdAt: string;
}

interface SubCategory {
  _id: string;
  name: string;
  category: string | { _id: string; name: string };
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt?: string;
}

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';
  const isEmployee = user?.role === 'employee';
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'categories' | 'subcategories' | 'users'>('dashboard');
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  
  // Category modals
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    image: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // SubCategory state
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [subCategoryLoading, setSubCategoryLoading] = useState(false);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const [isEditSubCategoryModalOpen, setIsEditSubCategoryModalOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [subCategoryFormData, setSubCategoryFormData] = useState({
    name: '',
    category: '',
    description: '',
    image: ''
  });
  const [subCategorySelectedFile, setSubCategorySelectedFile] = useState<File | null>(null);
  const [subCategoryImagePreview, setSubCategoryImagePreview] = useState<string>('');

  // Users state (Admin only)
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Delivery modal state
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [selectedOrderForDelivery, setSelectedOrderForDelivery] = useState<Order | null>(null);
  const [deliveryPhoto, setDeliveryPhoto] = useState<File | null>(null);
  const [deliveryPhotoPreview, setDeliveryPhotoPreview] = useState<string>('');

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      // Employees are not allowed to call admin-only users endpoint.
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        api.get('/products'),
        api.get('/orders'),
        isAdmin ? api.get('/users') : Promise.resolve({ data: [] })
      ]);

      setProducts(productsRes.data.products || productsRes.data);
      setOrders(ordersRes.data);
      
      // Calculate stats
      const totalRevenue = ordersRes.data.reduce((sum: number, order: Order) => 
        order.orderStatus !== 'Cancelled' ? sum + order.totalPrice : sum, 0
      );

      setStats({
        totalProducts: productsRes.data.products?.length || productsRes.data.length || 0,
        totalOrders: ordersRes.data.length,
        totalUsers: Array.isArray(usersRes.data) ? usersRes.data.length : 0,
        totalRevenue
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin && !isEmployee) {
      toast.error('Access denied. Admin or Employee privileges required.');
      return;
    }
    fetchDashboardData();
  }, [isAdmin, isEmployee, fetchDashboardData]);

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.delete(`/products/${productId}`);
      toast.success('Product deleted successfully');
      fetchDashboardData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus: status });
      toast.success('Order status updated successfully');
      fetchDashboardData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const handleAddProduct = () => {
    setIsAddModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleViewProduct = (product: Product) => {
    setViewProduct(product);
  };

  const handleViewOnSite = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleProductAdded = () => {
    fetchDashboardData();
  };

  const handleProductUpdated = () => {
    fetchDashboardData();
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  // Category CRUD Functions
  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);
      const { data } = await api.get('/categories/admin/all');
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleAddCategory = () => {
    setCategoryFormData({ name: '', description: '', image: '' });
    setSelectedFile(null);
    setImagePreview('');
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description || '',
      image: category.image || ''
    });
    setSelectedFile(null);
    setImagePreview(category.image || '');
    setIsEditCategoryModalOpen(true);
  };

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', categoryFormData.name);
      formData.append('description', categoryFormData.description);
      if (selectedFile) {
        formData.append('image', selectedFile);
      } else if (categoryFormData.image) {
        formData.append('image', categoryFormData.image);
      }

      await api.post('/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Category created successfully');
      setIsCategoryModalOpen(false);
      fetchCategories();
      setCategoryFormData({ name: '', description: '', image: '' });
      setSelectedFile(null);
      setImagePreview('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create category');
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;
    try {
      const formData = new FormData();
      formData.append('name', categoryFormData.name);
      formData.append('description', categoryFormData.description);
      if (selectedFile) {
        formData.append('image', selectedFile);
      } else if (categoryFormData.image) {
        formData.append('image', categoryFormData.image);
      }

      await api.put(`/categories/${selectedCategory._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Category updated successfully');
      setIsEditCategoryModalOpen(false);
      fetchCategories();
      setSelectedCategory(null);
      setSelectedFile(null);
      setImagePreview('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update category');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/categories/${categoryId}`);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleToggleCategoryStatus = async (category: Category) => {
    try {
      await api.put(`/categories/${category._id}`, { isActive: !category.isActive });
      toast.success(`Category ${category.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update category status');
    }
  };

  // SubCategory CRUD Functions
  const fetchSubCategories = async () => {
    try {
      setSubCategoryLoading(true);
      const { data } = await api.get('/subcategories/admin/all');
      setSubCategories(data);
    } catch (error) {
      console.error('Failed to fetch sub-categories:', error);
      toast.error('Failed to load sub-categories');
    } finally {
      setSubCategoryLoading(false);
    }
  };

  const handleAddSubCategory = () => {
    setSubCategoryFormData({ name: '', category: '', description: '', image: '' });
    setSubCategorySelectedFile(null);
    setSubCategoryImagePreview('');
    setIsSubCategoryModalOpen(true);
  };

  const handleEditSubCategory = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    const categoryId = typeof subCategory.category === 'object' ? subCategory.category._id : subCategory.category;
    setSubCategoryFormData({
      name: subCategory.name,
      category: categoryId,
      description: subCategory.description || '',
      image: subCategory.image || ''
    });
    setSubCategorySelectedFile(null);
    setSubCategoryImagePreview(subCategory.image || '');
    setIsEditSubCategoryModalOpen(true);
  };

  const handleSubmitSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', subCategoryFormData.name);
      formData.append('category', subCategoryFormData.category);
      formData.append('description', subCategoryFormData.description);
      if (subCategorySelectedFile) {
        formData.append('image', subCategorySelectedFile);
      } else if (subCategoryFormData.image) {
        formData.append('image', subCategoryFormData.image);
      }

      await api.post('/subcategories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Sub-category created successfully');
      setIsSubCategoryModalOpen(false);
      fetchSubCategories();
      setSubCategoryFormData({ name: '', category: '', description: '', image: '' });
      setSubCategorySelectedFile(null);
      setSubCategoryImagePreview('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create sub-category');
    }
  };

  const handleUpdateSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubCategory) return;
    try {
      const formData = new FormData();
      formData.append('name', subCategoryFormData.name);
      formData.append('category', subCategoryFormData.category);
      formData.append('description', subCategoryFormData.description);
      if (subCategorySelectedFile) {
        formData.append('image', subCategorySelectedFile);
      } else if (subCategoryFormData.image) {
        formData.append('image', subCategoryFormData.image);
      }

      await api.put(`/subcategories/${selectedSubCategory._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Sub-category updated successfully');
      setIsEditSubCategoryModalOpen(false);
      fetchSubCategories();
      setSelectedSubCategory(null);
      setSubCategorySelectedFile(null);
      setSubCategoryImagePreview('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update sub-category');
    }
  };

  const handleDeleteSubCategory = async (subCategoryId: string) => {
    if (!window.confirm('Are you sure you want to delete this sub-category?')) return;
    try {
      await api.delete(`/subcategories/${subCategoryId}`);
      toast.success('Sub-category deleted successfully');
      fetchSubCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete sub-category');
    }
  };

  const handleToggleSubCategoryStatus = async (subCategory: SubCategory) => {
    try {
      await api.put(`/subcategories/${subCategory._id}`, { isActive: !subCategory.isActive });
      toast.success(`Sub-category ${subCategory.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchSubCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update sub-category status');
    }
  };

  const getCategoryName = (category: string | { _id: string; name: string }) => {
    if (typeof category === 'object' && category !== null) {
      return category.name;
    }
    // Find category name from categories list
    const cat = categories.find(c => c._id === category);
    return cat?.name || 'Unknown';
  };

  // Users management functions (Admin only)
  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (error: any) {
      console.error('Failed to fetch users:', error);
      toast.error(error.response?.data?.message || 'Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: 'user' | 'employee' | 'admin') => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      toast.success(`User role updated to ${newRole} successfully`);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update user role');
    }
  };

  // Delivery functions for Employee/Admin
  const handleOpenDeliveryModal = (order: Order) => {
    if (order.orderStatus !== 'Shipped') {
      toast.error('Order must be in Shipped status to mark as delivered');
      return;
    }
    setSelectedOrderForDelivery(order);
    setDeliveryPhoto(null);
    setDeliveryPhotoPreview('');
    setIsDeliveryModalOpen(true);
  };

  const handleDeliveryPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDeliveryPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setDeliveryPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMarkDelivered = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForDelivery) return;

    try {
      const formData = new FormData();
      if (deliveryPhoto) {
        formData.append('deliveryPhoto', deliveryPhoto);
      }

      await api.put(`/orders/${selectedOrderForDelivery._id}/deliver`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Order marked as delivered successfully');
      setIsDeliveryModalOpen(false);
      setSelectedOrderForDelivery(null);
      setDeliveryPhoto(null);
      setDeliveryPhotoPreview('');
      fetchDashboardData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to mark order as delivered');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Processing': return <Truck className="h-4 w-4 text-blue-500" />;
      case 'Shipped': return <Package className="h-4 w-4 text-purple-500" />;
      case 'Delivered': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800 dark:text-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  if (!isAdmin && !isEmployee) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">You don't have permission to access this page.</p>
          <button
            onClick={() => window.history.back()}
            className="btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-8">Admin Dashboard</h1>

          {/* Tab Navigation - Scrollable on mobile */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-4 md:mb-8 overflow-x-auto hide-scrollbar">
            <nav className="-mb-px flex space-x-4 md:space-x-8 min-w-max">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-2 px-1 border-b-2 font-medium text-xs md:text-sm transition-colors whitespace-nowrap ${
                  activeTab === 'dashboard'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:border-gray-600'
                }`}
              >
                <BarChart3 className="h-4 w-4 inline mr-1 md:mr-2" />
                Dashboard
              </button>
              
              {/* Products tab - Admin can add/edit, Employee can only view */}
              <button
                onClick={() => setActiveTab('products')}
                className={`py-2 px-1 border-b-2 font-medium text-xs md:text-sm transition-colors whitespace-nowrap ${
                  activeTab === 'products'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:border-gray-600'
                }`}
              >
                <Package className="h-4 w-4 inline mr-1 md:mr-2" />
                Products
              </button>
              
              {/* Orders tab - Both Admin and Employee can manage */}
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-2 px-1 border-b-2 font-medium text-xs md:text-sm transition-colors whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:border-gray-600'
                }`}
              >
                <ShoppingCart className="h-4 w-4 inline mr-1 md:mr-2" />
                Orders
              </button>
              
              {/* Categories tab - Admin only */}
              {isAdmin && (
                <button
                  onClick={() => {
                    setActiveTab('categories');
                    fetchCategories();
                  }}
                  className={`py-2 px-1 border-b-2 font-medium text-xs md:text-sm transition-colors whitespace-nowrap ${
                    activeTab === 'categories'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <FolderOpen className="h-4 w-4 inline mr-1 md:mr-2" />
                  Categories
                </button>
              )}
              
              {/* Sub-Categories tab - Admin only */}
              {isAdmin && (
                <button
                  onClick={() => {
                    setActiveTab('subcategories');
                    fetchCategories();
                    fetchSubCategories();
                  }}
                  className={`py-2 px-1 border-b-2 font-medium text-xs md:text-sm transition-colors whitespace-nowrap ${
                    activeTab === 'subcategories'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <Layers className="h-4 w-4 inline mr-1 md:mr-2" />
                  Sub-Categories
                </button>
              )}
              
              {/* Users tab - Admin only */}
              {isAdmin && (
                <button
                  onClick={() => {
                    setActiveTab('users');
                    fetchUsers();
                  }}
                  className={`py-2 px-1 border-b-2 font-medium text-xs md:text-sm transition-colors whitespace-nowrap ${
                    activeTab === 'users'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <UserCog className="h-4 w-4 inline mr-1 md:mr-2" />
                  Users
                </button>
              )}
            </nav>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-pulse">Loading dashboard...</div>
            </div>
          ) : (
            <>
              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
                  <div className="bg-white dark:bg-gray-800 p-3 md:p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                      <div className="p-2 md:p-3 bg-primary-100 rounded-lg">
                        <Package className="h-5 w-5 md:h-6 md:w-6 text-primary-600" />
                      </div>
                      <div className="ml-2 md:ml-4">
                        <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Total Products</p>
                        <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">{stats.totalProducts}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 md:p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                      <div className="p-2 md:p-3 bg-secondary-100 rounded-lg">
                        <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 text-secondary-600" />
                      </div>
                      <div className="ml-2 md:ml-4">
                        <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
                        <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 md:p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                      <div className="p-2 md:p-3 bg-gold-100 rounded-lg">
                        <Users className="h-5 w-5 md:h-6 md:w-6 text-gold-600" />
                      </div>
                      <div className="ml-2 md:ml-4">
                        <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                        <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 md:p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                      <div className="p-2 md:p-3 bg-green-100 rounded-lg">
                        <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                      </div>
                      <div className="ml-2 md:ml-4">
                        <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                        <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">₹{stats.totalRevenue.toFixed(0)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Products Tab */}
              {activeTab === 'products' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                  <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Products</h2>
                      {isAdmin && (
                        <button 
                          onClick={handleAddProduct}
                          className="btn-primary flex items-center justify-center text-sm md:text-base py-2.5 md:py-2"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Product
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Product
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Stock
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Featured
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                        {products.map((product) => (
                          <tr key={product._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="h-10 w-10 rounded-lg object-cover mr-4"
                                  onError={(e) => {
                                    const fallbackImages = [
                                      '/images/products/product-1.webp',
                                      '/images/products/product-2.webp',
                                      '/images/products/product-3.webp',
                                      '/images/products/product-4.webp',
                                      '/images/products/product-5.webp',
                                      '/images/products/product-6.webp',
                                      '/images/products/product-7.webp'
                                    ];
                                    const randomIndex = Math.floor(Math.random() * fallbackImages.length);
                                    e.currentTarget.src = fallbackImages[randomIndex];
                                  }}
                                />
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                                {product.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              ₹{product.price}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`text-sm font-medium ${
                                product.stock < 10 ? 'text-red-600' : 'text-green-600'
                              }`}>
                                {product.stock}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                product.featured ? 'bg-gold-100 text-gold-800' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                              }`}>
                                {product.featured ? 'Yes' : 'No'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                {isAdmin && (
                                  <button 
                                    onClick={() => handleEditProduct(product)}
                                    className="text-primary-600 hover:text-primary-900"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                )}
                                <button 
                                  onClick={() => handleViewProduct(product)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="View product details"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                {isAdmin && (
                                  <button
                                    onClick={() => handleDeleteProduct(product._id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Orders</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Order ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Items
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Total
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                        {orders.map((order) => (
                          <tr key={order._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              #{order._id.slice(-8)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{order.user.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{order.user.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {order.orderItems.length} items
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              ₹{order.totalPrice.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {getStatusIcon(order.orderStatus)}
                                {order.orderStatus === 'Delivered' ? (
                                  <span className={`ml-2 text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(order.orderStatus)}`}>
                                    Delivered
                                  </span>
                                ) : (
                                  <select
                                    value={order.orderStatus}
                                    onChange={(e) => {
                                      // Only allow changing to Delivered through the delivery modal
                                      if (e.target.value === 'Delivered') {
                                        toast.info('Please use the camera button to mark as delivered with photo');
                                        return;
                                      }
                                      handleUpdateOrderStatus(order._id, e.target.value);
                                    }}
                                    className={`ml-2 text-xs font-medium px-2 py-1 rounded-full border-0 focus:ring-0 cursor-pointer ${getStatusColor(order.orderStatus)}`}
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered" disabled>Delivered (Use Camera)</option>
                                    <option value="Cancelled">Cancelled</option>
                                  </select>
                                )}
                              </div>
                              {order.deliveryPhoto && (
                                <div className="mt-2">
                                  <img 
                                    src={order.deliveryPhoto} 
                                    alt="Delivery" 
                                    className="h-16 w-16 object-cover rounded-lg cursor-pointer hover:opacity-80"
                                    onClick={() => window.open(order.deliveryPhoto, '_blank')}
                                    title="Click to view delivery photo"
                                  />
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                {order.orderStatus === 'Shipped' && (
                                  <button 
                                    onClick={() => handleOpenDeliveryModal(order)}
                                    className="text-green-600 hover:text-green-900"
                                    title="Mark as delivered with photo"
                                  >
                                    <Camera className="h-4 w-4" />
                                  </button>
                                )}
                                <button 
                                  onClick={() => handleViewOnSite(order.orderItems[0]?.name || '')}
                                  className="text-primary-600 hover:text-primary-900"
                                  title="View on site"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Categories Tab */}
              {activeTab === 'categories' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Categories</h2>
                      <button 
                        onClick={handleAddCategory}
                        className="btn-primary flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                      </button>
                    </div>
                  </div>
                  {categoryLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-pulse">Loading categories...</div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Created
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                          {categories.map((category) => (
                            <tr key={category._id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  {category.image ? (
                                    <img
                                      src={category.image}
                                      alt={category.name}
                                      className="h-10 w-10 rounded-lg object-cover mr-4"
                                      onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                                      }}
                                    />
                                  ) : (
                                    <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center mr-4">
                                      <Tag className="h-5 w-5 text-primary-600" />
                                    </div>
                                  )}
                                  <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{category.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                  {category.description || '-'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                  onClick={() => handleToggleCategoryStatus(category)}
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${
                                    category.isActive 
                                      ? 'bg-green-100 text-green-800 dark:text-green-200 hover:bg-green-200' 
                                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                                  }`}
                                >
                                  {category.isActive ? 'Active' : 'Inactive'}
                                </button>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {new Date(category.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button 
                                    onClick={() => handleEditCategory(category)}
                                    className="text-primary-600 hover:text-primary-900"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCategory(category._id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {categories.length === 0 && (
                        <div className="text-center py-12">
                          <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 dark:text-gray-400">No categories found</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Sub-Categories Tab */}
              {activeTab === 'subcategories' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sub-Categories</h2>
                      <button 
                        onClick={handleAddSubCategory}
                        className="btn-primary flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Sub-Category
                      </button>
                    </div>
                  </div>
                  {subCategoryLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-pulse">Loading sub-categories...</div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Sub-Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Parent Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                          {subCategories.map((subCategory) => (
                            <tr key={subCategory._id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  {subCategory.image ? (
                                    <img
                                      src={subCategory.image}
                                      alt={subCategory.name}
                                      className="h-10 w-10 rounded-lg object-cover mr-4"
                                      onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                                      }}
                                    />
                                  ) : (
                                    <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center mr-4">
                                      <Layers className="h-5 w-5 text-primary-600" />
                                    </div>
                                  )}
                                  <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{subCategory.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                  {getCategoryName(subCategory.category)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                  {subCategory.description || '-'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                  onClick={() => handleToggleSubCategoryStatus(subCategory)}
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${
                                    subCategory.isActive 
                                      ? 'bg-green-100 text-green-800 dark:text-green-200 hover:bg-green-200' 
                                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                                  }`}
                                >
                                  {subCategory.isActive ? 'Active' : 'Inactive'}
                                </button>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button 
                                    onClick={() => handleEditSubCategory(subCategory)}
                                    className="text-primary-600 hover:text-primary-900"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSubCategory(subCategory._id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {subCategories.length === 0 && (
                        <div className="text-center py-12">
                          <Layers className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 dark:text-gray-400">No sub-categories found</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Users Tab - Admin Only */}
              {activeTab === 'users' && isAdmin && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">User Management</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Assign roles to users. Admin has full access, Employee can manage orders but cannot add products/categories.</p>
                  </div>
                  {usersLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-pulse">Loading users...</div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Current Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Change Role
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                          {users.map((u) => (
                            <tr key={u._id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                                    <Users className="h-5 w-5 text-primary-600" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{u.name}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">ID: {u._id.slice(-8)}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {u.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  u.role === 'admin' 
                                    ? 'bg-red-100 text-red-800' 
                                    : u.role === 'employee'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-green-100 text-green-800 dark:text-green-200'
                                }`}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {u._id === user?._id ? (
                                  <span className="text-gray-400">Cannot change own role</span>
                                ) : (
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleUpdateUserRole(u._id, 'user')}
                                      disabled={u.role === 'user'}
                                      className={`px-3 py-1 rounded text-xs font-medium ${
                                        u.role === 'user'
                                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                                          : 'bg-green-100 text-green-700 dark:text-green-300 hover:bg-green-200'
                                      }`}
                                    >
                                      User
                                    </button>
                                    <button
                                      onClick={() => handleUpdateUserRole(u._id, 'employee')}
                                      disabled={u.role === 'employee'}
                                      className={`px-3 py-1 rounded text-xs font-medium ${
                                        u.role === 'employee'
                                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                      }`}
                                    >
                                      Employee
                                    </button>
                                    <button
                                      onClick={() => handleUpdateUserRole(u._id, 'admin')}
                                      disabled={u.role === 'admin'}
                                      className={`px-3 py-1 rounded text-xs font-medium ${
                                        u.role === 'admin'
                                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                                      }`}
                                    >
                                      Admin
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {users.length === 0 && (
                        <div className="text-center py-12">
                          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 dark:text-gray-400">No users found</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Category</h2>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-400 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmitCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category Image
                </label>
                <div className="space-y-3">
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative w-32 h-32 mx-auto">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('');
                          setSelectedFile(null);
                          setCategoryFormData({ ...categoryFormData, image: '' });
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  {/* File Input */}
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile(file);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setImagePreview(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      id="category-image-upload"
                    />
                    <label
                      htmlFor="category-image-upload"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 transition-colors cursor-pointer text-center"
                    >
                      Browse Image
                    </label>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedFile ? selectedFile.name : 'No file chosen'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsCategoryModalOpen(false);
                    setSelectedFile(null);
                    setImagePreview('');
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {isEditCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Category</h2>
              <button
                onClick={() => {
                  setIsEditCategoryModalOpen(false);
                  setSelectedCategory(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-400 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleUpdateCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category Image
                </label>
                <div className="space-y-3">
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative w-32 h-32 mx-auto">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('');
                          setSelectedFile(null);
                          setCategoryFormData({ ...categoryFormData, image: '' });
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  {/* File Input */}
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile(file);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setImagePreview(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      id="edit-category-image-upload"
                    />
                    <label
                      htmlFor="edit-category-image-upload"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 transition-colors cursor-pointer text-center"
                    >
                      Browse Image
                    </label>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedFile ? selectedFile.name : (imagePreview ? 'Current image' : 'No file chosen')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditCategoryModalOpen(false);
                    setSelectedCategory(null);
                    setSelectedFile(null);
                    setImagePreview('');
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Update Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Sub-Category Modal */}
      {isSubCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Sub-Category</h2>
              <button
                onClick={() => setIsSubCategoryModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-400 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmitSubCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sub-Category Name *
                </label>
                <input
                  type="text"
                  value={subCategoryFormData.name}
                  onChange={(e) => setSubCategoryFormData({ ...subCategoryFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Parent Category *
                </label>
                <select
                  value={subCategoryFormData.category}
                  onChange={(e) => setSubCategoryFormData({ ...subCategoryFormData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={subCategoryFormData.description}
                  onChange={(e) => setSubCategoryFormData({ ...subCategoryFormData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sub-Category Image
                </label>
                <div className="space-y-3">
                  {subCategoryImagePreview && (
                    <div className="relative w-32 h-32 mx-auto">
                      <img
                        src={subCategoryImagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSubCategoryImagePreview('');
                          setSubCategorySelectedFile(null);
                          setSubCategoryFormData({ ...subCategoryFormData, image: '' });
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSubCategorySelectedFile(file);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setSubCategoryImagePreview(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      id="subcategory-image-upload"
                    />
                    <label
                      htmlFor="subcategory-image-upload"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 transition-colors cursor-pointer text-center"
                    >
                      Browse Image
                    </label>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {subCategorySelectedFile ? subCategorySelectedFile.name : 'No file chosen'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsSubCategoryModalOpen(false);
                    setSubCategorySelectedFile(null);
                    setSubCategoryImagePreview('');
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Add Sub-Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Sub-Category Modal */}
      {isEditSubCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Sub-Category</h2>
              <button
                onClick={() => {
                  setIsEditSubCategoryModalOpen(false);
                  setSelectedSubCategory(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-400 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleUpdateSubCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sub-Category Name *
                </label>
                <input
                  type="text"
                  value={subCategoryFormData.name}
                  onChange={(e) => setSubCategoryFormData({ ...subCategoryFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Parent Category *
                </label>
                <select
                  value={subCategoryFormData.category}
                  onChange={(e) => setSubCategoryFormData({ ...subCategoryFormData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={subCategoryFormData.description}
                  onChange={(e) => setSubCategoryFormData({ ...subCategoryFormData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sub-Category Image
                </label>
                <div className="space-y-3">
                  {subCategoryImagePreview && (
                    <div className="relative w-32 h-32 mx-auto">
                      <img
                        src={subCategoryImagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSubCategoryImagePreview('');
                          setSubCategorySelectedFile(null);
                          setSubCategoryFormData({ ...subCategoryFormData, image: '' });
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSubCategorySelectedFile(file);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setSubCategoryImagePreview(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      id="edit-subcategory-image-upload"
                    />
                    <label
                      htmlFor="edit-subcategory-image-upload"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 transition-colors cursor-pointer text-center"
                    >
                      Browse Image
                    </label>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {subCategorySelectedFile ? subCategorySelectedFile.name : (subCategoryImagePreview ? 'Current image' : 'No file chosen')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditSubCategoryModalOpen(false);
                    setSelectedSubCategory(null);
                    setSubCategorySelectedFile(null);
                    setSubCategoryImagePreview('');
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Update Sub-Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProductAdded={handleProductAdded}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
        onProductUpdated={handleProductUpdated}
        product={selectedProduct}
      />

      {/* View Product Modal */}
      {viewProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Product Details</h2>
              <button
                onClick={() => setViewProduct(null)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-400 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Product Image */}
              <div className="flex justify-center">
                <img
                  src={viewProduct.image}
                  alt={viewProduct.name}
                  className="w-64 h-64 object-cover rounded-lg shadow-md"
                  onError={(e) => {
                    const fallbackImages = [
                      '/images/products/product-1.webp',
                      '/images/products/product-2.webp',
                      '/images/products/product-3.webp',
                      '/images/products/product-4.webp',
                      '/images/products/product-5.webp',
                      '/images/products/product-6.webp',
                      '/images/products/product-7.webp'
                    ];
                    const randomIndex = Math.floor(Math.random() * fallbackImages.length);
                    e.currentTarget.src = fallbackImages[randomIndex];
                  }}
                />
              </div>

              {/* Product Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{viewProduct.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Price</label>
                  <p className="text-lg font-semibold text-green-600">₹{viewProduct.price}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Category</label>
                  <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                    {viewProduct.category}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Stock</label>
                  <p className={`text-lg font-semibold ${viewProduct.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                    {viewProduct.stock} units
                  </p>
                </div>
              </div>

              {viewProduct.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</label>
                  <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">{viewProduct.description}</p>
                </div>
              )}

              {viewProduct.ingredients && viewProduct.ingredients.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Ingredients</label>
                  <div className="flex flex-wrap gap-2">
                    {viewProduct.ingredients.map((ingredient, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                {viewProduct.weight && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Weight</label>
                    <p className="text-gray-900 dark:text-white">{viewProduct.weight}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Featured</label>
                  <span className={`px-2 py-1 rounded-full text-sm ${viewProduct.featured ? 'bg-gold-100 text-gold-800' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                    {viewProduct.featured ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setViewProduct(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setViewProduct(null);
                    handleEditProduct(viewProduct);
                  }}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Edit Product
                </button>
                <button
                  onClick={() => handleViewOnSite(viewProduct._id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  View on Site
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Modal - For Employee/Admin to mark order as delivered with photo */}
      {isDeliveryModalOpen && selectedOrderForDelivery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Mark as Delivered</h2>
              <button
                onClick={() => {
                  setIsDeliveryModalOpen(false);
                  setSelectedOrderForDelivery(null);
                  setDeliveryPhoto(null);
                  setDeliveryPhotoPreview('');
                }}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-400 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleMarkDelivered} className="p-6 space-y-4">
              <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <p><strong>Order ID:</strong> #{selectedOrderForDelivery._id.slice(-8)}</p>
                <p><strong>Customer:</strong> {selectedOrderForDelivery.user?.name || 'Guest'}</p>
                <p><strong>Address:</strong> {selectedOrderForDelivery.shippingAddress?.address}, {selectedOrderForDelivery.shippingAddress?.city}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Delivery Photo (Required)
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Please take a photo of the delivered package at the customer's location.
                </p>
                
                {deliveryPhotoPreview && (
                  <div className="relative w-full h-48 mb-4">
                    <img
                      src={deliveryPhotoPreview}
                      alt="Delivery preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setDeliveryPhotoPreview('');
                        setDeliveryPhoto(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleDeliveryPhotoChange}
                    className="hidden"
                    id="delivery-photo-upload"
                  />
                  <label
                    htmlFor="delivery-photo-upload"
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 transition-colors cursor-pointer text-center flex items-center justify-center"
                  >
                    <Camera className="h-5 w-5 mr-2" />
                    {deliveryPhoto ? 'Change Photo' : 'Take Photo'}
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Click to open camera and capture delivery proof
                </p>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeliveryModalOpen(false);
                    setSelectedOrderForDelivery(null);
                    setDeliveryPhoto(null);
                    setDeliveryPhotoPreview('');
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!deliveryPhoto}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Mark as Delivered
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
