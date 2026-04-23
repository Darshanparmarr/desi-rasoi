import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { X, Plus, Trash2, Upload } from 'lucide-react';

interface ProductFormData {
  name: string;
  price: number;
  description: string;
  category: string;
  subCategory: string;
  stock: number;
  ingredients: string;
  weight: string;
  featured: boolean;
  images: string[];
}

interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  category: string;
  subCategory?: string;
  stock: number;
  ingredients?: string[];
  weight?: string;
  featured: boolean;
  image: string;
  images?: string[];
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated: () => void;
  product: Product | null;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ 
  isOpen, 
  onClose, 
  onProductUpdated,
  product 
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: 0,
    description: '',
    category: '',
    subCategory: '',
    stock: 0,
    ingredients: '',
    weight: '',
    featured: false,
    images: []
  });
  const [newImageUrl, setNewImageUrl] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Array<{ _id: string; name: string }>>([]);
  const [subCategories, setSubCategories] = useState<Array<{ _id: string; name: string; category: string | { _id: string; name: string } }>>([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState<Array<{ _id: string; name: string }>>([]);

  // Fetch categories and subcategories on mount
  useEffect(() => {
    if (isOpen) {
      fetchCategoriesAndSubCategories();
    }
  }, [isOpen]);

  // Update form data when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        description: product.description || '',
        category: product.category,
        subCategory: product.subCategory || '',
        stock: product.stock,
        ingredients: product.ingredients ? product.ingredients.join(', ') : '',
        weight: product.weight || '',
        featured: product.featured,
        images: product.images || [product.image] || []
      });
    }
  }, [product]);

  // Filter subcategories when category changes
  useEffect(() => {
    if (formData.category) {
      const filtered = subCategories.filter(
        sub => typeof sub.category === 'object' 
          ? sub.category.name === formData.category 
          : sub.category === formData.category
      );
      setFilteredSubCategories(filtered);
    } else {
      setFilteredSubCategories([]);
    }
  }, [formData.category, subCategories]);

  const fetchCategoriesAndSubCategories = async () => {
    try {
      const [catRes, subCatRes] = await Promise.all([
        api.get('/categories'),
        api.get('/subcategories')
      ]);
      setCategories(catRes.data);
      setSubCategories(subCatRes.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || user.role !== 'admin') {
      toast.error('Only admin users can update products');
      return;
    }

    if (!product?._id) {
      toast.error('No product selected for editing');
      return;
    }

    setLoading(true);
    
    try {
      const updateData: any = {
        ...formData,
        ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(i => i),
        image: formData.images[0] || product.image
      };
      
      // Only include subCategory if one is selected
      if (!formData.subCategory) {
        updateData.subCategory = null;
      }

      const response = await api.put(
        `/products/${product._id}`, 
        updateData
      );
      
      if (response.data) {
        toast.success('Product updated successfully!');
        onProductUpdated();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()]
      }));
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSetPrimaryImage = (index: number) => {
    const newImages = [...formData.images];
    const [primary] = newImages.splice(index, 1);
    newImages.unshift(primary);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleFileBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setFormData(prev => ({
              ...prev,
              images: [...prev.images, event.target!.result as string]
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Product</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-400 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Premium Saunf Mukhwas"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="120"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Describe your mukhwas product..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={(e) => {
                  handleSelectChange(e);
                  // Reset subcategory when category changes
                  setFormData(prev => ({ ...prev, subCategory: '' }));
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sub-Category
              </label>
              <select
                name="subCategory"
                value={formData.subCategory}
                onChange={handleSelectChange}
                disabled={!formData.category || filteredSubCategories.length === 0}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 dark:bg-gray-700 disabled:text-gray-500 dark:text-gray-400"
              >
                <option value="">
                  {!formData.category 
                    ? 'Select a category first' 
                    : filteredSubCategories.length === 0 
                      ? 'No sub-categories available' 
                      : 'Select a sub-category'}
                </option>
                {filteredSubCategories.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="50"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ingredients (comma separated)
              </label>
              <input
                type="text"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Fennel, Sugar, Cardamom"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Weight
              </label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="200g"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
            />
            <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Featured Product (show on homepage)
            </label>
          </div>

          {/* Multiple Images Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <label className="block text-lg font-medium text-gray-900 dark:text-white mb-4">
              Product Images
            </label>
            
            {/* Current Images Grid */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className={`w-full h-32 object-cover rounded-lg border-2 ${
                        index === 0 ? 'border-primary-500' : 'border-gray-200 dark:border-gray-700'
                      }`}
                      onError={(e) => {
                        e.currentTarget.src = '/images/products/product-1.webp';
                      }}
                    />
                    {index === 0 && (
                      <span className="absolute top-2 left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded">
                        Primary
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                      {index !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryImage(index)}
                          className="bg-white dark:bg-gray-800 text-primary-600 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700"
                          title="Set as primary"
                        >
                          <Upload className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="bg-white dark:bg-gray-800 text-red-600 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700"
                        title="Remove image"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Image */}
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Enter image URL (or use local path like /images/products/product-1.webp)"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  disabled={!newImageUrl.trim()}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add URL
                </button>
              </div>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileBrowse}
                className="hidden"
              />
              
              {/* Browse Button */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Browse Files from Computer
                </button>
                <span className="text-sm text-gray-500 dark:text-gray-400">or drag & drop</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Supports: JPG, PNG, WEBP, GIF (Max 5MB each)</p>
            </div>

            {/* Quick Select from Local Images */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Quick Add from Local Images:
              </label>
              <div className="flex flex-wrap gap-2">
                {['/images/products/product-1.webp', '/images/products/product-2.webp', '/images/products/product-3.webp', '/images/products/product-4.webp', '/images/products/product-5.webp', '/images/products/product-6.webp', '/images/products/product-7.webp'].map((img) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => {
                      if (!formData.images.includes(img)) {
                        setFormData(prev => ({
                          ...prev,
                          images: [...prev.images, img]
                        }));
                      }
                    }}
                    disabled={formData.images.includes(img)}
                    className="relative disabled:opacity-50"
                  >
                    <img
                      src={img}
                      alt="Local product"
                      className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors"
                    />
                    {formData.images.includes(img) && (
                      <span className="absolute -top-1 -right-1 bg-green-50 dark:bg-green-900/200 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
