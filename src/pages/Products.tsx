import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, MoreHorizontal, RefreshCw, Building, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Product } from '../types';
import { apiService, ShopListingResponse } from '../services/api';
import ShopInfoModal from '../components/modals/ShopInfoModal';

const Products: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isShopInfoModalOpen, setIsShopInfoModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [shopData, setShopData] = useState<ShopListingResponse['shop'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showShopData, setShowShopData] = useState(false);

  // Remove dummy products data - will be fetched from API
  const [products, setProducts] = useState<Product[]>([]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || product.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: Product['status']) => {
    const statusMap = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      out_of_stock: 'bg-red-100 text-red-800'
    };
    
    const statusText = {
      active: 'Active',
      inactive: 'Inactive',
      out_of_stock: 'Out of Stock'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusMap[status]}`}>
        {statusText[status]}
      </span>
    );
  };

  const handleAddProduct = () => {
    setIsShopInfoModalOpen(true);
  };

  const fetchShopData = async () => {
    try {
      setLoading(true);
      setError(null);
      setRefreshing(true);
      
      console.log('Fetching shop listing data...');
      const response = await apiService.getShopListing();
      
      console.log('Shop listing data received:', response.data);
      setShopData(response.data.shop);
      setShowShopData(true);
    } catch (err) {
      console.error('Failed to fetch shop listing:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch shop data');
      setShowShopData(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    await fetchShopData();
  };

  const handleBackToProducts = () => {
    setShowShopData(false);
    setShopData(null);
    setError(null);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600">Manage your product inventory and listings</p>
          </div>
          {/* Add Product button removed */}
        </div>

        {/* Filters */}
        <Card>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4 text-gray-400" />}
              />
            </div>
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Refresh Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-gray-900">
              {showShopData ? 'Shop Information' : 'Product List'}
            </h2>
            <span className="text-sm text-gray-500">
              {showShopData 
                ? (shopData ? 'Shop details loaded' : 'No shop data') 
                : `(${filteredProducts.length} products)`
              }
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {showShopData && (
              <Button
                onClick={handleBackToProducts}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Building className="h-4 w-4" />
                <span>Back to Products</span>
              </Button>
            )}
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={refreshing}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </Button>
          </div>
        </div>

        {/* Content Area - Products Grid or Shop Data */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading data...</p>
            </div>
          </div>
        ) : error ? (
          <Card>
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <div className="space-x-3">
                <Button onClick={fetchShopData} variant="primary">
                  Try Again
                </Button>
                <Button onClick={handleBackToProducts} variant="outline">
                  Back to Products
                </Button>
              </div>
            </div>
          </Card>
        ) : showShopData && shopData ? (
          /* Shop Information Display in the same area */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Shop Details Card */}
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Shop Details</h2>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    shopData.isListed 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {shopData.isListed ? 'Listed' : 'Not Listed'}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shop Name
                    </label>
                    <p className="text-gray-900 font-medium">{shopData.shopName}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {shopData.shopDescription}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Title
                    </label>
                    <p className="text-gray-900 text-sm">{shopData.shopMetaTitle}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Description
                    </label>
                    <p className="text-gray-600 text-sm">{shopData.shopMetaDescription}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* SEO & Images Card */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">SEO & Images</h2>

                {/* Keywords */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keywords
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {shopData.shopMetaKeywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {shopData.shopMetaTags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Shop Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shop Images ({shopData.shopImages.length})
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {shopData.shopImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Shop image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="hidden absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          /* Simple No Products Found Message */
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No products found</h3>
          </div>
        )}
      </div>

      <ShopInfoModal
        isOpen={isShopInfoModalOpen}
        onClose={() => setIsShopInfoModalOpen(false)}
        onSuccess={() => {
          setIsShopInfoModalOpen(false);
          if (showShopData) {
            fetchShopData(); // Refresh shop data if we're viewing it
          }
        }}
        initialData={shopData}
      />
    </>
  );
};

export default Products;