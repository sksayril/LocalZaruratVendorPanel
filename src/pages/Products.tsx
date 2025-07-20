import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter, 
  MoreVertical,
  Package,
  Tag,
  DollarSign,
  Users,
  TrendingUp,
  Star,
  Camera,
  Save,
  X,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  Zap,
  Award,
  ShoppingCart,
  Grid,
  List,
  MapPin,
  Info
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Skeleton, { SkeletonCard } from '../components/ui/Skeleton';
import PincodeInput from '../components/ui/PincodeInput';
import ImageUpload from '../components/ui/ImageUpload';
import { 
  apiService, 
  Product, 
  ProductListItem, 
  ProductsResponse,
  ProductsApiResponse,
  CreateProductResponse,
  UpdateProductResponse
} from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

interface Specification {
  name: string;
  value: string;
}

interface Price {
  amount: number;
  currency: string;
  isNegotiable: boolean;
}

interface Stock {
  quantity: number;
  isInStock: boolean;
}

interface Category {
  mainCategory: {
    _id: string;
    name: string;
    icon: string;
  };
  subCategory: {
    _id: string;
    name: string;
    image: string;
  };
}

interface ProductImage {
  url: string;
  isPrimary: boolean;
  alt: string;
}

interface ContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface VendorDetails {
  shopName: string;
  mainCategory: string;
  subCategory: string;
  phone: string;
  email: string;
}

// Pincode API Response Interface
interface PincodeResponse {
  Message: string;
  Status: string;
  PostOffice: Array<{
    Name: string;
    Description: string | null;
    BranchType: string;
    DeliveryStatus: string;
    Circle: string;
    District: string;
    Division: string;
    Region: string;
    Block: string;
    State: string;
    Country: string;
    Pincode: string;
  }>;
}

interface PincodeDetails {
  [pincode: string]: {
    data: PincodeResponse | null;
    loading: boolean;
    error: string | null;
  };
}

const Products: React.FC = () => {
  const { user } = useAuth();
  
  // State for products list
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // State for create/edit modal
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priceAmount: '',
    priceCurrency: 'INR',
    isNegotiable: false,
    stockQuantity: '',
    isInStock: true,
    metaTitle: '',
    metaDescription: '',
    availableInPincodes: [] as string[],
    contactPhone: '',
    contactWhatsapp: '',
    contactEmail: ''
  });

  // State for specifications, features, tags
  const [specifications, setSpecifications] = useState<Specification[]>([
    { name: '', value: '' }
  ]);
  const [features, setFeatures] = useState<string[]>(['']);
  const [tags, setTags] = useState<string[]>(['']);
  const [images, setImages] = useState<File[]>([]);

  // State for vendor details
  const [vendorDetails, setVendorDetails] = useState<VendorDetails | null>(null);
  const [vendorLoading, setVendorLoading] = useState(true);
  
  // State for categories
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');
  const [filteredProducts, setFilteredProducts] = useState<ProductListItem[]>([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  // State for pincode details
  const [pincodeDetails, setPincodeDetails] = useState<PincodeDetails>({});
  const [showPincodeModal, setShowPincodeModal] = useState(false);
  const [selectedProductPincodes, setSelectedProductPincodes] = useState<string[]>([]);

  useEffect(() => {
    fetchVendorDetails();
    fetchCategories();
    fetchProducts();
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter products based on search term
  useEffect(() => {
    if (!products) {
      setFilteredProducts([]);
      return;
    }

    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(product => {
      const searchLower = searchTerm.toLowerCase();
      
      // Search in product name
      if (product.name?.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Search in product description
      if (product.description?.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Search in category names
      if (product.category?.mainCategory?.name?.toLowerCase().includes(searchLower)) {
        return true;
      }
      if (product.category?.subCategory?.name?.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Search in price (convert to string)
      if (product.price?.amount?.toString().includes(searchLower)) {
        return true;
      }
      
      // Search in tags
      if (product.tags?.some(tag => tag.toLowerCase().includes(searchLower))) {
        return true;
      }
      
      // Search in features
      if (product.features?.some(feature => feature.toLowerCase().includes(searchLower))) {
        return true;
      }
      
      return false;
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm]);

  // Generate search suggestions
  const getSearchSuggestions = () => {
    if (!products || !searchTerm.trim()) return [];

    const suggestions = new Set<string>();
    const searchLower = searchTerm.toLowerCase();

    products.forEach(product => {
      // Add product names that match
      if (product.name?.toLowerCase().includes(searchLower)) {
        suggestions.add(product.name);
      }
      
      // Add category names that match
      if (product.category?.mainCategory?.name?.toLowerCase().includes(searchLower)) {
        suggestions.add(product.category.mainCategory.name);
      }
      if (product.category?.subCategory?.name?.toLowerCase().includes(searchLower)) {
        suggestions.add(product.category.subCategory.name);
      }
      
      // Add tags that match
      product.tags?.forEach(tag => {
        if (tag.toLowerCase().includes(searchLower)) {
          suggestions.add(tag);
        }
      });
    });

    return Array.from(suggestions).slice(0, 5);
  };

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await apiService.getVendorCategories();
      setCategories(response.data || []);
    } catch (err) {
      console.error('Failed to fetch vendor categories:', err);
      toast.error('Failed to fetch categories');
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Function to get category names by ID
  const getCategoryNames = (mainCategoryId: string, subCategoryId: string) => {
    const mainCategory = categories.find(cat => cat._id === mainCategoryId);
    const subCategory = mainCategory?.subCategories?.find((sub: any) => sub._id === subCategoryId);
    
    return {
      mainCategoryName: mainCategory?.title || 'Not found',
      subCategoryName: subCategory?.title || 'Not found'
    };
  };

  // Function to get category icon by ID
  const getCategoryIcon = (mainCategoryId: string) => {
    const mainCategory = categories.find(cat => cat._id === mainCategoryId);
    return mainCategory?.icon || '';
  };

  // Fetch pincode details from API
  const fetchPincodeDetails = async (pincode: string) => {
    // Check if we already have the data or are loading
    if (pincodeDetails[pincode]?.data || pincodeDetails[pincode]?.loading) {
      return;
    }

    try {
      // Set loading state
      setPincodeDetails(prev => ({
        ...prev,
        [pincode]: { data: null, loading: true, error: null }
      }));

      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      
      if (data && data[0] && data[0].Status === 'Success') {
        setPincodeDetails(prev => ({
          ...prev,
          [pincode]: { data: data[0], loading: false, error: null }
        }));
      } else {
        setPincodeDetails(prev => ({
          ...prev,
          [pincode]: { data: null, loading: false, error: 'Invalid pincode or no data found' }
        }));
      }
    } catch (error) {
      console.error('Failed to fetch pincode data:', error);
      setPincodeDetails(prev => ({
        ...prev,
        [pincode]: { data: null, loading: false, error: 'Failed to fetch pincode data' }
      }));
    }
  };

  // Show pincode details modal
  const showPincodeDetails = (pincodes: string[]) => {
    setSelectedProductPincodes(pincodes);
    setShowPincodeModal(true);
    
    // Fetch details for all pincodes
    pincodes.forEach(pincode => {
      fetchPincodeDetails(pincode);
    });
  };

  const fetchVendorDetails = async () => {
    try {
      setVendorLoading(true);
      
      // Fetch vendor details from shop listing API
      const shopResponse = await apiService.getShopListing();
      const shopData = shopResponse.data.shop;
      
      // Extract vendor details from actual API response
      const vendorDetails: VendorDetails = {
        shopName: shopData?.shopName || '',
        mainCategory: shopData?.category?.mainCategory?._id || '',
        subCategory: shopData?.category?.subCategory?._id || '',
        phone: user?.phone || '', // Use actual user phone from auth context
        email: user?.email || '' // Use actual user email from auth context
      };
      
      setVendorDetails(vendorDetails);
      
      // Pre-fill contact information in form data with actual user data
      setFormData(prev => ({
        ...prev,
        contactPhone: vendorDetails.phone || '',
        contactWhatsapp: vendorDetails.phone || '',
        contactEmail: vendorDetails.email || ''
      }));
    } catch (err) {
      console.error('Failed to fetch vendor details:', err);
      toast.error('Failed to fetch vendor details');
    } finally {
      setVendorLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is authenticated
      if (!user) {
        setError('Please login to view products');
        setProducts([]);
        setPagination(null);
        return;
      }
      
      console.log('User authenticated:', user);
      const response = await apiService.getProducts(currentPage, 10);
      console.log('API Response:', response);
      console.log('Response type:', typeof response);
      console.log('Response keys:', Object.keys(response));
      console.log('Products data:', response.data);
      console.log('Pagination data:', response.data?.pagination);
      // Handle the actual API response structure - using type assertion for flexibility
      const responseData = response as any;
      const productsData = Array.isArray(responseData.data) ? responseData.data : responseData.data?.data || [];
      const paginationData = responseData.data?.pagination || responseData.pagination || null;
      setProducts(productsData);
      setPagination(paginationData);
    } catch (err: any) {
      console.error('Failed to fetch products:', err);
      console.error('Error details:', err.response?.data || err.message);
      
      // Check if it's an authentication error
      if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
        toast.error('Authentication failed. Please login again.');
      } else if (err.response?.status === 403) {
        setError('Access denied. You may not have permission to view products.');
        toast.error('Access denied. You may not have permission to view products.');
      } else {
        setError('Failed to fetch products. Please try again.');
        toast.error('Failed to fetch products');
      }
      
      setProducts([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    resetForm();
    setShowModal(true);
  };

  const handleEditProduct = async (product: ProductListItem) => {
    try {
      // Try to fetch full product details first, but fallback to existing data if it fails
      let productForEditing: Product;
      
      try {
        const response = await apiService.getProduct(product._id);
        productForEditing = response.data;
        console.log('Fetched full product details for editing');
      } catch (apiError) {
        console.log('Failed to fetch full product details, using existing data:', apiError);
        // Fallback to using existing product data
        productForEditing = {
          _id: product._id,
          name: product.name,
          description: product.description,
          category: product.category,
          price: product.price,
          specifications: product.specifications,
          features: product.features,
          tags: product.tags,
          stock: product.stock,
          images: product.images,
          metaTitle: product.metaTitle,
          metaDescription: product.metaDescription,
          availableInPincodes: product.availableInPincodes,
          contactInfo: product.contactInfo,
          vendor: product.vendor,
          views: product.views,
          isActive: product.isActive,
          createdAt: product.createdAt
        };
      }
      
      setEditingProduct(productForEditing);
      populateForm(productForEditing);
      setShowModal(true);
    } catch (err) {
      console.error('Failed to prepare product for editing:', err);
      toast.error('Failed to prepare product for editing');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await apiService.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p._id !== productId));
      toast.success('Product deleted successfully');
    } catch (err) {
      console.error('Failed to delete product:', err);
      toast.error('Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      priceAmount: '',
      priceCurrency: 'INR',
      isNegotiable: false,
      stockQuantity: '',
      isInStock: true,
      metaTitle: '',
      metaDescription: '',
      availableInPincodes: [],
      contactPhone: vendorDetails?.phone || '',
      contactWhatsapp: vendorDetails?.phone || '',
      contactEmail: vendorDetails?.email || ''
    });
    setSpecifications([{ name: '', value: '' }]);
    setFeatures(['']);
    setTags(['']);
    setImages([]);
  };

  const populateForm = (product: Product) => {
    setFormData({
      name: product.name || '',
      description: product.description || '',
      priceAmount: product.price?.amount?.toString() || '',
      priceCurrency: product.price?.currency || 'INR',
      isNegotiable: product.price?.isNegotiable || false,
      stockQuantity: product.stock?.quantity?.toString() || '',
      isInStock: product.stock?.isInStock !== false,
      metaTitle: product.metaTitle || '',
      metaDescription: product.metaDescription || '',
      availableInPincodes: product.availableInPincodes || [],
      contactPhone: product.contactInfo?.phone || '',
      contactWhatsapp: product.contactInfo?.whatsapp || '',
      contactEmail: product.contactInfo?.email || ''
    });
    setSpecifications(product.specifications?.length > 0 ? product.specifications : [{ name: '', value: '' }]);
    setFeatures(product.features?.length > 0 ? product.features : ['']);
    setTags(product.tags?.length > 0 ? product.tags : ['']);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setModalLoading(true);

      const formDataToSend = new FormData();
      
      // Basic product info
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      
      // Category (from vendor registration - cannot be changed)
      if (vendorDetails) {
        formDataToSend.append('category[mainCategory]', vendorDetails.mainCategory);
        formDataToSend.append('category[subCategory]', vendorDetails.subCategory);
      }
      
      // Price
      formDataToSend.append('price[amount]', formData.priceAmount);
      formDataToSend.append('price[currency]', formData.priceCurrency);
      formDataToSend.append('price[isNegotiable]', formData.isNegotiable.toString());
      
      // Stock
      formDataToSend.append('stock[quantity]', formData.stockQuantity);
      formDataToSend.append('stock[isInStock]', formData.isInStock.toString());
      
      // Specifications
      specifications.forEach((spec, index) => {
        if (spec.name && spec.value) {
          formDataToSend.append(`specifications[${index}][name]`, spec.name);
          formDataToSend.append(`specifications[${index}][value]`, spec.value);
        }
      });
      
      // Features
      features.forEach((feature, index) => {
        if (feature.trim()) {
          formDataToSend.append(`features[${index}]`, feature.trim());
        }
      });
      
      // Tags
      tags.forEach((tag, index) => {
        if (tag.trim()) {
          formDataToSend.append(`tags[${index}]`, tag.trim());
        }
      });
      
      // Meta info
      formDataToSend.append('metaTitle', formData.metaTitle);
      formDataToSend.append('metaDescription', formData.metaDescription);
      
      // Available pincodes
      formData.availableInPincodes.forEach((pincode, index) => {
        formDataToSend.append(`availableInPincodes[${index}]`, pincode);
      });
      
      // Contact info
      formDataToSend.append('contactInfo[phone]', formData.contactPhone);
      formDataToSend.append('contactInfo[whatsapp]', formData.contactWhatsapp);
      formDataToSend.append('contactInfo[email]', formData.contactEmail);
      
      // Images
      images.forEach((image, index) => {
        formDataToSend.append('images', image);
      });

      if (editingProduct) {
        // Update product
        await apiService.updateProduct(editingProduct._id, formDataToSend);
        toast.success('Product updated successfully');
      } else {
        // Create product
        await apiService.createProduct(formDataToSend);
        toast.success('Product created successfully');
      }

      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error('Failed to save product:', err);
      toast.error('Failed to save product');
    } finally {
      setModalLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('Product description is required');
      return false;
    }
    if (!formData.priceAmount || parseFloat(formData.priceAmount) <= 0) {
      toast.error('Valid price is required');
      return false;
    }
    if (!formData.stockQuantity || parseInt(formData.stockQuantity) < 0) {
      toast.error('Valid stock quantity is required');
      return false;
    }
    if (!formData.contactPhone.trim()) {
      toast.error('Contact phone is required');
      return false;
    }
    if (!formData.contactEmail.trim()) {
      toast.error('Contact email is required');
      return false;
    }
    return true;
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { name: '', value: '' }]);
  };

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const updateSpecification = (index: number, field: 'name' | 'value', value: string) => {
    const updated = [...specifications];
    updated[index][field] = value;
    setSpecifications(updated);
  };

  const addFeature = () => {
    setFeatures([...features, '']);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const updateFeature = (index: number, value: string) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  const addTag = () => {
    setTags([...tags, '']);
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const updateTag = (index: number, value: string) => {
    const updated = [...tags];
    updated[index] = value;
    setTags(updated);
  };



  // Debug logging
  console.log('Current state:', { loading, vendorLoading, categoriesLoading, products: products?.length, error });

  if (loading || vendorLoading || categoriesLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton variant="title" width="w-48" className="mb-2" />
            <Skeleton variant="text" width="w-80" />
          </div>
          <Skeleton variant="button" width="w-32" height="h-10" />
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Premium Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 rounded-2xl p-8 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Products</h1>
                  <p className="text-green-100">Manage your product catalog and inventory</p>
                </div>
              </div>
            </div>
            <Button
              onClick={handleCreateProduct}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-white border-opacity-30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 opacity-20">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="absolute bottom-4 left-4 opacity-20">
          <Zap className="w-6 h-6" />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <div className="flex items-center space-x-3 p-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </Card>
      )}



      {/* Search and Filters */}
      <Card className="overflow-hidden border-0 shadow-xl">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Search className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Search & Filters</h3>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
              <Input
                  placeholder="Search products by name, category, price, tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowSearchSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                icon={<Search className="w-4 h-4 text-gray-400" />}
              />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                
                {/* Search Suggestions */}
                {showSearchSuggestions && searchTerm && getSearchSuggestions().length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    {getSearchSuggestions().map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchTerm(suggestion);
                          setShowSearchSuggestions(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center space-x-2"
                      >
                        <Search className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{suggestion}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {searchTerm && (
                <p className="text-xs text-gray-500 mt-1">
                  Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
                title="Table View"
              >
                <div className="w-4 h-4 flex flex-col space-y-0.5">
                  <div className="w-full h-0.5 bg-current"></div>
                  <div className="w-full h-0.5 bg-current"></div>
                  <div className="w-full h-0.5 bg-current"></div>
                </div>
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Products Grid/List */}
      {!filteredProducts || filteredProducts.length === 0 ? (
        <Card className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm ? 'No Products Found' : 'No Products Found'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? `No products match "${searchTerm}". Try adjusting your search terms.`
              : 'Start by adding your first product to your catalog'
            }
          </p>
          {searchTerm ? (
            <Button onClick={() => setSearchTerm('')} variant="outline">
              <X className="w-4 h-4 mr-2" />
              Clear Search
            </Button>
          ) : (
          <Button onClick={handleCreateProduct}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Product
          </Button>
          )}
        </Card>
      ) : viewMode === 'table' ? (
        // Table View
        <Card className="overflow-hidden border-0 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Available Areas
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {product.images && product.images.length > 0 ? (
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={product.images[0].url}
                              alt={product.images[0].alt || product.name}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">
                            {product.name || 'Unnamed Product'}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {product.description || 'No description'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getCategoryNames(product.category?.mainCategory?._id || '', product.category?.subCategory?._id || '').subCategoryName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getCategoryNames(product.category?.mainCategory?._id || '', product.category?.subCategory?._id || '').mainCategoryName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{product.price?.amount?.toLocaleString() || '0'}
                      </div>
                      {product.price?.isNegotiable && (
                        <div className="text-xs text-gray-500">Negotiable</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${product.stock?.isInStock ? 'text-green-600' : 'text-red-600'}`}>
                        {product.stock?.isInStock ? `${product.stock?.quantity || 0} in stock` : 'Out of stock'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.views || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {product.isFeatured && (
                          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                            Featured
                          </span>
                        )}
                        {product.isActive !== false ? (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                            Inactive
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.availableInPincodes && product.availableInPincodes.length > 0 ? (
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-blue-600 font-medium">
                            {product.availableInPincodes.length} area{product.availableInPincodes.length !== 1 ? 's' : ''}
                          </span>
                          <button
                            onClick={() => showPincodeDetails(product.availableInPincodes)}
                            className="text-blue-500 hover:text-blue-700 text-xs underline"
                          >
                            View
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No areas</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
             ) : viewMode === 'list' ? (
         // List View
                 <div className="space-y-4">
          {filteredProducts && filteredProducts.map((product) => (
             <Card key={product._id} className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300">
               <div className="flex">
                 {/* Product Image */}
                 <div className="relative w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
                   {product.images && product.images.length > 0 ? (
                     <img
                       src={product.images[0].url}
                       alt={product.images[0].alt || product.name}
                       className="w-full h-full object-cover"
                     />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center">
                       <Package className="w-8 h-8 text-gray-400" />
                     </div>
                   )}
                   <div className="absolute top-2 right-2">
                     <div className="flex items-center space-x-1">
                       {product.isFeatured && (
                         <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Featured</span>
                       )}
                       {product.isActive !== false ? (
                         <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                       ) : (
                         <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Inactive</span>
                       )}
                     </div>
                   </div>
                 </div>

                 {/* Product Info */}
                 <div className="flex-1 p-6">
                   <div className="flex items-start justify-between mb-3">
                     <div className="flex-1">
                       <h3 className="font-semibold text-gray-900 text-lg mb-1">{product.name || 'Unnamed Product'}</h3>
                       <p className="text-gray-600 text-sm line-clamp-2">{product.description || 'No description'}</p>
                     </div>
                     <div className="relative ml-4">
                       <Button
                         variant="ghost"
                         size="sm"
                         className="p-1"
                       >
                         <MoreVertical className="w-4 h-4" />
                       </Button>
                     </div>
                   </div>

                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                           {/* Category */}
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Tag className="w-4 h-4" />
                        <span>{getCategoryNames(product.category?.mainCategory?._id || '', product.category?.subCategory?._id || '').subCategoryName}</span>
                      </div>

                     {/* Price */}
                     <div className="flex items-center space-x-2">
                       <DollarSign className="w-4 h-4 text-green-600" />
                       <span className="font-bold text-gray-900">
                         ₹{product.price?.amount?.toLocaleString() || '0'}
                       </span>
                       {product.price?.isNegotiable && (
                         <span className="text-xs text-gray-500">(Negotiable)</span>
                       )}
                     </div>

                     {/* Stock */}
                     <div className="flex items-center space-x-2">
                       <Package className="w-4 h-4 text-gray-400" />
                       <span className={product.stock?.isInStock ? 'text-green-600' : 'text-red-600'}>
                         {product.stock?.isInStock ? `${product.stock?.quantity || 0} in stock` : 'Out of stock'}
                       </span>
                     </div>

                     {/* Views */}
                     <div className="flex items-center space-x-2 text-gray-600">
                       <Eye className="w-4 h-4" />
                       <span>{product.views || 0} views</span>
                     </div>

                     {/* Available Pincodes */}
                     {product.availableInPincodes && product.availableInPincodes.length > 0 && (
                       <div className="flex items-center space-x-2 text-gray-600">
                         <MapPin className="w-4 h-4 text-blue-500" />
                         <span className="text-blue-600 font-medium">
                           {product.availableInPincodes.length} area{product.availableInPincodes.length !== 1 ? 's' : ''}
                         </span>
                         <button
                           onClick={() => showPincodeDetails(product.availableInPincodes)}
                           className="text-blue-500 hover:text-blue-700 text-xs underline"
                         >
                           View details
                         </button>
                       </div>
                     )}
                   </div>

                   {/* Actions */}
                   <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-100">
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={() => handleEditProduct(product)}
                     >
                       <Edit className="w-4 h-4 mr-1" />
                       Edit
                     </Button>
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={() => handleDeleteProduct(product._id)}
                     >
                       <Trash2 className="w-4 h-4 mr-1" />
                       Delete
                     </Button>
                   </div>
                 </div>
               </div>
             </Card>
           ))}
         </div>
       ) : (
         // Grid View
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts && filteredProducts.map((product) => (
            <Card key={product._id} className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              {/* Product Image */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].url}
                    alt={product.images[0].alt || product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <div className="flex items-center space-x-1">
                    {product.isFeatured && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Featured</span>
                    )}
                    {product.isActive !== false ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Inactive</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name || 'Unnamed Product'}</h3>
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Category */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Tag className="w-4 h-4" />
                    <span>{getCategoryNames(product.category?.mainCategory?._id || '', product.category?.subCategory?._id || '').subCategoryName}</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-xl font-bold text-gray-900">
                      ₹{product.price?.amount?.toLocaleString() || '0'}
                    </span>
                    {product.price?.isNegotiable && (
                      <span className="text-xs text-gray-500">(Negotiable)</span>
                    )}
                  </div>

                  {/* Stock */}
                  <div className="flex items-center space-x-2 text-sm">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className={product.stock?.isInStock ? 'text-green-600' : 'text-red-600'}>
                      {product.stock?.isInStock ? `${product.stock?.quantity || 0} in stock` : 'Out of stock'}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{product.views || 0} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>4.5</span>
                    </div>
                  </div>

                  {/* Available Pincodes */}
                  {product.availableInPincodes && product.availableInPincodes.length > 0 && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span className="text-blue-600 font-medium">
                        {product.availableInPincodes.length} area{product.availableInPincodes.length !== 1 ? 's' : ''}
                      </span>
                      <button
                        onClick={() => showPincodeDetails(product.availableInPincodes)}
                        className="text-blue-500 hover:text-blue-700 text-xs underline"
                      >
                        View details
                      </button>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEditProduct(product)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages && pagination.totalPages > 1 && (
        <Card className="overflow-hidden border-0 shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                {pagination.totalItems} products
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.currentPage === 1}
                  onClick={() => setCurrentPage(pagination.currentPage - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.currentPage === pagination.totalPages}
                  onClick={() => setCurrentPage(pagination.currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Create/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Create New Product'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowModal(false)}
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Product Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name"
                />
                <Input
                  label="Price (₹) *"
                  type="number"
                  value={formData.priceAmount}
                  onChange={(e) => setFormData({ ...formData, priceAmount: e.target.value })}
                  placeholder="Enter price"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product description"
                />
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isNegotiable"
                    checked={formData.isNegotiable}
                    onChange={(e) => setFormData({ ...formData, isNegotiable: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="isNegotiable" className="text-sm text-gray-700">
                    Price Negotiable
                  </label>
                </div>
                <Input
                  label="Stock Quantity *"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                  placeholder="Enter quantity"
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isInStock"
                    checked={formData.isInStock}
                    onChange={(e) => setFormData({ ...formData, isInStock: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="isInStock" className="text-sm text-gray-700">
                    In Stock
                  </label>
                </div>
              </div>



              {/* Specifications */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">Specifications</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addSpecification}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-3">
                  {specifications.map((spec, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        placeholder="Specification name"
                        value={spec.name}
                        onChange={(e) => updateSpecification(index, 'name', e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Value"
                        value={spec.value}
                        onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSpecification(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">Features</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addFeature}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        placeholder="Enter feature"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">Tags</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addTag}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-3">
                  {tags.map((tag, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        placeholder="Enter tag"
                        value={tag}
                        onChange={(e) => updateTag(index, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTag(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Contact Phone *"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="Enter phone number"
                />
                <Input
                  label="WhatsApp"
                  value={formData.contactWhatsapp}
                  onChange={(e) => setFormData({ ...formData, contactWhatsapp: e.target.value })}
                  placeholder="Enter WhatsApp number"
                />
                <Input
                  label="Contact Email *"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="Enter email"
                />
              </div>

              {/* Available Pincodes */}
              <PincodeInput
                label="Available Pincodes"
                value={formData.availableInPincodes}
                onChange={(pincodes) => setFormData({ ...formData, availableInPincodes: pincodes })}
                placeholder="Enter pincode"
              />

              {/* Meta Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Meta Title"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  placeholder="Enter meta title"
                />
                <Input
                  label="Meta Description"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  placeholder="Enter meta description"
                />
              </div>

              {/* Product Images */}
              <ImageUpload
                images={images}
                onChange={setImages}
                label="Product Images"
                maxImages={5}
                    accept="image/*"
              />
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
              <div className="flex items-center justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  loading={modalLoading}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {modalLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {editingProduct ? 'Update Product' : 'Create Product'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pincode Details Modal */}
      {showPincodeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Available Service Areas</h2>
                    <p className="text-sm text-gray-600">
                      {selectedProductPincodes.length} pincode{selectedProductPincodes.length !== 1 ? 's' : ''} • Service locations
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPincodeModal(false)}
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedProductPincodes.map((pincode) => {
                  const pincodeData = pincodeDetails[pincode];
                  
                  return (
                    <Card key={pincode} className="overflow-hidden border-0 shadow-lg">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            <h3 className="font-semibold text-gray-900">Pincode: {pincode}</h3>
                          </div>
                          {pincodeData?.loading && (
                            <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                          )}
                        </div>
                      </div>
                      
                      <div className="p-4">
                        {pincodeData?.loading ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="flex items-center space-x-2">
                              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                              <span className="text-gray-600">Loading area details...</span>
                            </div>
                          </div>
                        ) : pincodeData?.error ? (
                          <div className="flex items-center space-x-2 py-4 text-red-600">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm">{pincodeData.error}</span>
                          </div>
                        ) : pincodeData?.data ? (
                          <div className="space-y-4">
                            {/* Summary Info */}
                            <div className="bg-green-50 p-3 rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-800">
                                  {pincodeData.data.PostOffice.length} location{pincodeData.data.PostOffice.length !== 1 ? 's' : ''} found
                                </span>
                              </div>
                              <p className="text-xs text-green-700">
                                {pincodeData.data.Message}
                              </p>
                            </div>

                            {/* Location Details */}
                            <div className="space-y-3">
                              <h4 className="font-medium text-gray-900 text-sm">Service Locations:</h4>
                              <div className="max-h-60 overflow-y-auto space-y-2">
                                {pincodeData.data.PostOffice.map((postOffice, index) => (
                                  <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                          <span className="font-medium text-gray-900 text-sm">
                                            {postOffice.Name}
                                          </span>
                                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                                            postOffice.DeliveryStatus === 'Delivery' 
                                              ? 'bg-green-100 text-green-800' 
                                              : 'bg-yellow-100 text-yellow-800'
                                          }`}>
                                            {postOffice.DeliveryStatus}
                                          </span>
                                        </div>
                                        <div className="text-xs text-gray-600 space-y-0.5">
                                          <div className="flex items-center space-x-1">
                                            <MapPin className="w-3 h-3" />
                                            <span>{postOffice.District}, {postOffice.State}</span>
                                          </div>
                                          {postOffice.Block && postOffice.Block !== 'NA' && (
                                            <div className="flex items-center space-x-1">
                                              <span className="w-3 h-3">•</span>
                                              <span>Block: {postOffice.Block}</span>
                                            </div>
                                          )}
                                          <div className="flex items-center space-x-1">
                                            <span className="w-3 h-3">•</span>
                                            <span>{postOffice.BranchType}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Region Info */}
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <h5 className="font-medium text-blue-900 text-sm mb-2">Region Information:</h5>
                              <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
                                <div><strong>Circle:</strong> {pincodeData.data.PostOffice[0]?.Circle}</div>
                                <div><strong>Division:</strong> {pincodeData.data.PostOffice[0]?.Division}</div>
                                <div><strong>Region:</strong> {pincodeData.data.PostOffice[0]?.Region}</div>
                                <div><strong>State:</strong> {pincodeData.data.PostOffice[0]?.State}</div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center py-8">
                            <div className="text-center">
                              <Info className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-600 text-sm">No data available</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
              <div className="flex items-center justify-end">
                <Button
                  onClick={() => setShowPincodeModal(false)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;