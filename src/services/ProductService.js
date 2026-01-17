
// For PRODUCTION (hosted): Uses render.com URL
const API_BASE_URL = 'https://glassadminpanelapi-zvz4.onrender.com/api';
// For LOCAL development:
// const API_BASE_URL = 'http://localhost:5000/api';

const PRODUCTS_API_BASE = `${API_BASE_URL}/products`;
// ----------------------------------------------------------------------

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

  // Calculate Final Price with Offer (Same logic as Admin)
  static calculateFinalPriceWithOffer(price, discountPercent, offer) {
    const basePrice = Number(price) || 0;
    const prodDisc = Number(discountPercent) || 0;

    let afterProdDisc = basePrice;
    let prodDiscAmount = 0;

    // 1. Apply Product Discount
    if (prodDisc > 0) {
      prodDiscAmount = (basePrice * prodDisc) / 100;
      afterProdDisc = basePrice - prodDiscAmount;
    }

    let offerDiscAmount = 0;
    let appliedOffer = null;

    // 2. Apply Offer Discount (if valid)
    if (offer && offer.isActive) {
      // Check min order amount
      if (!offer.minOrderAmount || afterProdDisc >= offer.minOrderAmount) {
        appliedOffer = offer;
        if (offer.discountType === "percentage") {
          const val = Number(offer.discountValue) || 0;
          offerDiscAmount = (afterProdDisc * val) / 100;
          // Cap at max discount
          if (
            offer.maxDiscountAmount &&
            offerDiscAmount > offer.maxDiscountAmount
          ) {
            offerDiscAmount = offer.maxDiscountAmount;
          }
        } else {
          // Flat
          offerDiscAmount = Number(offer.discountValue) || 0;
        }
      }
    }

    // Ensure price doesn't go negative
    const final = Math.max(0, afterProdDisc - offerDiscAmount);

    return {
      basePrice,
      prodDiscAmount,
      offerDiscAmount,
      finalPrice: Math.round(final),
      appliedOffer,
      offerCode: appliedOffer ? appliedOffer.code : null,
      offerTitle: appliedOffer ? appliedOffer.title : null,
    };
  }

  // FETCH ALL CATEGORIES
  static async getCategories() {
    try {
      console.log('🔄 Fetching categories...');
      const res = await fetch(`${API_BASE_URL}/categories`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch categories');
      return { success: true, categories: data.categories || [] };
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      return { success: false, categories: [] };
    }
  }

  // FETCH CATEGORY BY SLUG
  static async getCategoryBySlug(slug) {
    try {
      console.log('🔄 Fetching category by slug:', slug);
      const res = await fetch(`${API_BASE_URL}/categories/${slug}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.message || 'Category not found' };
      return { success: true, category: data.category };
    } catch (error) {
      console.error('❌ Error fetching category by slug:', error);
      return { success: false, message: error.message };
    }
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

  // GET PRODUCTS BY CATEGORY ID
  static async getProductsByCategoryId(categoryId) {
    try {
      console.log('🔄 Fetching products by category ID:', categoryId);
      const { products } = await this.getAllProducts();
      const filtered = products.filter(p => p.category?._id === categoryId);
      return { 
        success: true, 
        products: filtered.map(p => this.mapProductData(p, true)) 
      };
    } catch (error) {
       console.error('❌ Error fetching products by category ID:', error);
       return { success: false, products: [] };
    }
  }

  // GET PRODUCTS BY CATEGORY (Dynamic Filtering)
  static async getProductsByCategory(categoryName, page = 1, limit = 12) {
    try {
      console.log('🔄 Fetching products by category name:', categoryName);
      const { products } = await this.getAllProducts();
      
      const categoryProducts = products.filter(p => {
        const pCatName = p.category?.name?.toLowerCase() || '';
        const target = categoryName.toLowerCase();
        return pCatName.includes(target);
      });
      
      const startIndex = (page - 1) * limit;
      const paginatedProducts = categoryProducts
        .slice(startIndex, startIndex + limit)
        .map(p => this.mapProductData(p, true));
      
      return {
        success: true,
        products: paginatedProducts,
        total: categoryProducts.length
      };
    } catch (error) {
      console.error('❌ Error fetching category products:', error);
      return { success: false, products: [] };
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
          // Calculate dynamic price locally for filtering to be accurate
          const pricing = this.calculateFinalPriceWithOffer(
            p.price, 
            p.discountPercent, 
            p.offer
          );
          const price = pricing.finalPrice;
          
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
  static async getFeaturedProducts(limit = 8, minRating = 0) {
    try {
      console.log('🔄 Fetching featured products...');
      
      const { products } = await this.getAllProducts();
      
      // Get products with highest ratings or most recent
      const featuredProducts = products
        .filter(p => {
          const stock = p.stock !== undefined ? p.stock : 50;
          const rating = p.averageRating || 0;
          return stock > 0 && rating >= minRating;
        })
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
    

    // Calculate precise final price with offers
    const pricing = this.calculateFinalPriceWithOffer(
      product.price, 
      product.discountPercent, 
      product.offer
    );

    const baseData = {
      id: product._id,
      name: product.name,
      price: pricing.finalPrice, // This is the actual final price to pay
      originalPrice: (pricing.prodDiscAmount > 0 || pricing.offerDiscAmount > 0) ? product.price : null,
      discount: product.discountPercent || 0,
      
      // Pass full offer details
      offer: pricing.appliedOffer ? {
        title: pricing.appliedOffer.title,
        code: pricing.appliedOffer.code,
        discountType: pricing.appliedOffer.discountType,
        discountValue: pricing.appliedOffer.discountValue,
        savings: pricing.offerDiscAmount
      } : null,

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
      rating: product.averageRating || 0,
      reviews: product.totalReviews || 0,
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
        brand: product.specifications?.brand || product.brand || '',
        warranty: product.specifications?.warranty || product.warranty || '',
        weight: product.specifications?.weight || product.weight || '',
        frameType: product.specifications?.frameType || product.frameType || '',
        material: product.specifications?.material || product.material || '',
        dimensions: product.specifications?.dimensions || product.dimensions || '',
        installation: product.specifications?.installation || product.installation || '',
        glassType: product.specifications?.glassType || product.glassType || ''
      },
      features: (product.features && product.features.length > 0) ? product.features : [],
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
        return products.sort((a, b) => {
          const priceA = this.calculateFinalPriceWithOffer(a.price, a.discountPercent, a.offer).finalPrice;
          const priceB = this.calculateFinalPriceWithOffer(b.price, b.discountPercent, b.offer).finalPrice;
          return priceA - priceB;
        });
      case 'price_high_low':
        return products.sort((a, b) => {
          const priceA = this.calculateFinalPriceWithOffer(a.price, a.discountPercent, a.offer).finalPrice;
          const priceB = this.calculateFinalPriceWithOffer(b.price, b.discountPercent, b.offer).finalPrice;
          return priceB - priceA;
        });
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

  // ADD REVIEW
  static async addReview(productId, reviewData) {
    try {
      console.log('🔄 Adding review...', { productId, reviewData });
      
      const res = await fetch(`${API_BASE_URL}/reviews/add`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          productId,
          ...reviewData
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to add review');
      }

      return {
        success: true,
        review: data.review,
        message: data.message
      };
    } catch (error) {
      console.error('❌ Error adding review:', error);
      throw error;
    }
  }

  // GET PRODUCT REVIEWS
  static async getProductReviews(productId) {
    try {
      console.log('🔄 Fetching product reviews:', productId);
      
      const res = await fetch(`${API_BASE_URL}/reviews/${productId}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch reviews');
      }

      const reviews = data.reviews || [];
      const totalReviews = reviews.length;
      
      // Calculate average rating
      const totalRating = reviews.reduce((sum, review) => sum + Number(review.rating), 0);
      const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;

      return {
        success: true,
        reviews: reviews,
        totalReviews: totalReviews,
        averageRating: Number(averageRating)
      };
    } catch (error) {
      console.error('❌ Error fetching reviews:', error);
      throw error;
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