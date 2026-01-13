const PRODUCTS_API_BASE = 'https://glassadminpanelapi.onrender.com/api/products';

class ProductService {
  
  // Get headers with auth token
  static getHeaders() {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  // FETCH ALL PRODUCTS
  static async getAllProducts() {
    try {
      console.log('🔄 Fetching all products...');
      
      const res = await fetch(PRODUCTS_API_BASE, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const data = await res.json();
      console.log('📊 Products API response:', data);

      if (!res.ok) {
        throw new Error(data.message || `Server error: ${res.status}`);
      }

      return {
        success: true,
        products: data.products || [],
        total: data.total || 0
      };
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      throw new Error(error.message || 'Failed to fetch products');
    }
  }

  // FETCH SINGLE PRODUCT BY ID
  static async getProductById(productId) {
    try {
      console.log('🔄 Fetching product details for ID:', productId);
      
      // Get all products and find the specific one
      const { products } = await this.getAllProducts();
      const foundProduct = products.find(p => p._id === productId);
      
      if (!foundProduct) {
        throw new Error('Product not found');
      }

      // DEBUG: Log the raw product from backend
      console.log('🔍 RAW BACKEND PRODUCT:', foundProduct);
      console.log('📸 mainImage field:', foundProduct.mainImage);
      console.log('🖼️ galleryImages field:', foundProduct.galleryImages);
      console.log('📷 additionalImages field:', foundProduct.additionalImages);

      // Map product data to consistent format
      const mappedProduct = this.mapProductData(foundProduct);
      
      console.log('✅ Product found and mapped:', mappedProduct);
      return {
        success: true,
        product: mappedProduct
      };
    } catch (error) {
      console.error('❌ Error fetching product:', error);
      throw new Error(error.message || 'Failed to fetch product details');
    }
  }

  // GET RELATED PRODUCTS
  static async getRelatedProducts(productId, categoryName, limit = 8) {
    try {
      console.log('🔄 Fetching related products...', { productId, categoryName, limit });
      
      const { products } = await this.getAllProducts();
      
      // Filter related products (same category, excluding current product)
      const relatedProducts = products
        .filter(p => 
          p._id !== productId && 
          p.category?.name === categoryName
        )
        .slice(0, limit)
        .map(p => this.mapProductData(p, true)); // true for minimal data
      
      console.log('🔗 Related products found:', relatedProducts.length);
      
      return {
        success: true,
        relatedProducts
      };
    } catch (error) {
      console.error('❌ Error fetching related products:', error);
      return {
        success: false,
        relatedProducts: []
      };
    }
  }

  // GET PRODUCTS BY CATEGORY
  static async getProductsByCategory(categoryName, page = 1, limit = 12) {
    try {
      console.log('🔄 Fetching products by category:', categoryName);
      
      const { products } = await this.getAllProducts();
      
      // Filter by category
      const categoryProducts = products.filter(p => 
        p.category?.name?.toLowerCase() === categoryName.toLowerCase()
      );
      
      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProducts = categoryProducts
        .slice(startIndex, endIndex)
        .map(p => this.mapProductData(p, true));
      
      return {
        success: true,
        products: paginatedProducts,
        total: categoryProducts.length,
        page,
        totalPages: Math.ceil(categoryProducts.length / limit)
      };
    } catch (error) {
      console.error('❌ Error fetching category products:', error);
      throw new Error(error.message || 'Failed to fetch category products');
    }
  }

  // SEARCH PRODUCTS
  static async searchProducts(query, filters = {}) {
    try {
      console.log('🔄 Searching products:', { query, filters });
      
      const { products } = await this.getAllProducts();
      
      let filteredProducts = products;
      
      // Text search
      if (query) {
        const searchTerm = query.toLowerCase();
        filteredProducts = filteredProducts.filter(p =>
          p.name?.toLowerCase().includes(searchTerm) ||
          p.description?.toLowerCase().includes(searchTerm) ||
          p.category?.name?.toLowerCase().includes(searchTerm)
        );
      }
      
      // Category filter
      if (filters.category) {
        filteredProducts = filteredProducts.filter(p =>
          p.category?.name?.toLowerCase() === filters.category.toLowerCase()
        );
      }
      
      // Price range filter
      if (filters.minPrice || filters.maxPrice) {
        filteredProducts = filteredProducts.filter(p => {
          const price = p.finalPrice || p.price;
          const min = filters.minPrice || 0;
          const max = filters.maxPrice || Infinity;
          return price >= min && price <= max;
        });
      }
      
      // Sort products
      if (filters.sortBy) {
        filteredProducts = this.sortProducts(filteredProducts, filters.sortBy);
      }
      
      const mappedProducts = filteredProducts.map(p => this.mapProductData(p, true));
      
      return {
        success: true,
        products: mappedProducts,
        total: mappedProducts.length
      };
    } catch (error) {
      console.error('❌ Error searching products:', error);
      throw new Error(error.message || 'Failed to search products');
    }
  }

  // GET FEATURED/BESTSELLER PRODUCTS
  static async getFeaturedProducts(limit = 8) {
    try {
      console.log('🔄 Fetching featured products...');
      
      const { products } = await this.getAllProducts();
      
      // Get products with highest ratings or most recent
      const featuredProducts = products
        .filter(p => p.stock > 0) // Only in-stock products
        .sort((a, b) => {
          // Sort by discount percentage first, then by creation date
          const discountA = a.discountPercent || 0;
          const discountB = b.discountPercent || 0;
          if (discountA !== discountB) return discountB - discountA;
          return new Date(b.createdAt) - new Date(a.createdAt);
        })
        .slice(0, limit)
        .map(p => this.mapProductData(p, true));
      
      return {
        success: true,
        products: featuredProducts
      };
    } catch (error) {
      console.error('❌ Error fetching featured products:', error);
      return {
        success: false,
        products: []
      };
    }
  }

  // MAP PRODUCT DATA TO CONSISTENT FORMAT
  static mapProductData(product, minimal = false) {
    // Dynamic stock calculation based on backend data
    const stockValue = product.stock !== undefined ? product.stock : 
                      product.quantity !== undefined ? product.quantity :
                      product.available !== undefined ? product.available : 50;
    
    const isInStock = stockValue > 0;
    
    const baseData = {
      id: product._id,
      name: product.name,
      price: product.finalPrice || product.price,
      originalPrice: product.discountPercent ? product.price : null,
      discount: product.discountPercent || 0,
      category: product.category?.name || 'Mirror',
      image: product.mainImage?.url || product.mainImage || 'https://via.placeholder.com/300x300',
      images: [
        product.mainImage?.url || product.mainImage,
        ...(product.galleryImages || []).map(img => {
          if (typeof img === 'string') return img;
          return img?.url || img;
        }),
        ...(product.additionalImages || []).map(img => {
          if (typeof img === 'string') return img;
          return img?.url || img;
        })
      ].filter(Boolean),
      inStock: isInStock,
      stock: stockValue,
      rating: 4.8,
      reviews: Math.floor(Math.random() * 200) + 50,
      sizes: product.sizes || [],
      colors: product.colors || [],
      addOns: product.addOns || [],
      about: product.about || ''
    };

    // Return minimal data for lists
    if (minimal) {
      return {
        ...baseData,
        title: baseData.name, // For compatibility
        img: baseData.image, // For compatibility
        price: `₹${baseData.price}`,
        originalPrice: baseData.originalPrice ? `₹${baseData.originalPrice}` : null
      };
    }

    // Return full data for detail view
    return {
      ...baseData,
      description: product.description || 'Premium quality mirror with modern design and excellent craftsmanship.',
      specifications: {
        brand: 'ESPEJO',
        material: product.material || 'Premium Glass',
        warranty: '5 Years',
        dimensions: product.dimensions || 'Standard Size',
        weight: product.weight || 'Lightweight',
        installation: 'Wall Mount',
        frameType: product.frameType || 'Modern',
        glassType: 'High-Quality Reflective Glass'
      },
      features: [
        'High-quality reflective glass',
        'Durable frame construction', 
        'Easy wall mounting system',
        'Modern contemporary design',
        'Scratch resistant surface',
        'Moisture resistant coating',
        'Professional installation included',
        'Premium packaging for safe delivery'
      ],
      benefits: [
        'Enhances room aesthetics',
        'Makes spaces appear larger',
        'Perfect lighting reflection',
        'Long-lasting durability',
        'Easy maintenance',
        'Versatile placement options'
      ],
      careInstructions: [
        'Clean with soft, lint-free cloth',
        'Use mild glass cleaner',
        'Avoid abrasive materials',
        'Wipe in circular motions',
        'Dry immediately after cleaning'
      ]
    };
  }

  // SORT PRODUCTS
  static sortProducts(products, sortBy) {
    switch (sortBy) {
      case 'price_low_high':
        return products.sort((a, b) => (a.finalPrice || a.price) - (b.finalPrice || b.price));
      case 'price_high_low':
        return products.sort((a, b) => (b.finalPrice || b.price) - (a.finalPrice || a.price));
      case 'name_a_z':
        return products.sort((a, b) => a.name.localeCompare(b.name));
      case 'name_z_a':
        return products.sort((a, b) => b.name.localeCompare(a.name));
      case 'newest':
        return products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'discount':
        return products.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
      default:
        return products;
    }
  }

  // GET PRODUCT RECOMMENDATIONS
  static async getRecommendations(productId, userId = null) {
    try {
      console.log('🔄 Getting product recommendations...');
      
      const { products } = await this.getAllProducts();
      const currentProduct = products.find(p => p._id === productId);
      
      if (!currentProduct) {
        throw new Error('Product not found for recommendations');
      }

      // Get recommendations based on category and price range
      const priceRange = {
        min: (currentProduct.finalPrice || currentProduct.price) * 0.7,
        max: (currentProduct.finalPrice || currentProduct.price) * 1.3
      };

      const recommendations = products
        .filter(p => {
          const price = p.finalPrice || p.price;
          return p._id !== productId && 
                 p.category?.name === currentProduct.category?.name &&
                 price >= priceRange.min && 
                 price <= priceRange.max &&
                 p.stock > 0;
        })
        .slice(0, 6)
        .map(p => this.mapProductData(p, true));

      return {
        success: true,
        recommendations
      };
    } catch (error) {
      console.error('❌ Error getting recommendations:', error);
      return {
        success: false,
        recommendations: []
      };
    }
  }

  // GET PRODUCT VARIANTS (if applicable)
  static async getProductVariants(productId) {
    try {
      console.log('🔄 Getting product variants...');
      
      const { products } = await this.getAllProducts();
      const currentProduct = products.find(p => p._id === productId);
      
      if (!currentProduct) {
        throw new Error('Product not found');
      }

      // Find variants based on similar name pattern
      const baseName = currentProduct.name.split(' ').slice(0, -1).join(' ');
      const variants = products
        .filter(p => 
          p._id !== productId && 
          p.name.includes(baseName) &&
          p.category?.name === currentProduct.category?.name
        )
        .map(p => this.mapProductData(p, true));

      return {
        success: true,
        variants
      };
    } catch (error) {
      console.error('❌ Error getting variants:', error);
      return {
        success: false,
        variants: []
      };
    }
  }

  // UTILITY: Format price for display
  static formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  // UTILITY: Calculate discount percentage
  static calculateDiscount(originalPrice, finalPrice) {
    if (!originalPrice || originalPrice <= finalPrice) return 0;
    return Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
  }

  // UTILITY: Generate product URL slug
  static generateSlug(productName) {
    return productName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}

export default ProductService;