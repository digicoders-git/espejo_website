import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaUser, FaClock, FaEye, FaHeart, FaArrowRight } from 'react-icons/fa';
import PageLoader from './PageLoader';

const BLOGS_API = "https://glassadminpanelapi.onrender.com/api/blogs?page=1&limit=10";
const FEATURED_BLOG_API = "https://glassadminpanelapi.onrender.com/api/blogs/featured";
const BLOG_LIKE_API = "https://glassadminpanelapi.onrender.com/api/blogs";

const BlogPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  const [blogPosts, setBlogPosts] = useState([]);
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set());

  // Fetch blogs and featured blog from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Fetch regular blogs
        const [blogsResponse, featuredResponse] = await Promise.all([
          fetch(BLOGS_API),
          fetch(FEATURED_BLOG_API)
        ]);
        
        const blogsData = await blogsResponse.json();
        const featuredData = await featuredResponse.json();
        
        console.log('📊 Blog API Response:', blogsData);
        console.log('🎆 Featured Blog API Response:', featuredData);
        
        if (blogsResponse.ok && blogsData.blogs) {
          const formattedBlogs = blogsData.blogs
            .map(blog => ({
              id: blog._id,
              slug: blog.slug,
              title: blog.title,
              date: new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }),
              author: blog.authorName,
              category: blog.category,
              readTime: blog.readTime,
              views: blog.views,
              likes: blog.likes,
              image: blog.coverImage || blog.thumbnailImage || 'https://via.placeholder.com/600x400?text=Blog+Image',
              excerpt: blog.shortDescription,
              tags: blog.tags || [],
              isFeatured: blog.isFeatured,
              createdAt: new Date(blog.createdAt)
            }))
            .sort((a, b) => b.createdAt - a.createdAt);
          
          setBlogPosts(formattedBlogs);
        }
        
        // Set featured blog
        if (featuredResponse.ok && featuredData.blog) {
          const featured = {
            id: featuredData.blog._id,
            slug: featuredData.blog.slug,
            title: featuredData.blog.title,
            date: new Date(featuredData.blog.publishedAt || featuredData.blog.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            author: featuredData.blog.authorName,
            category: featuredData.blog.category,
            readTime: featuredData.blog.readTime,
            views: featuredData.blog.views,
            likes: featuredData.blog.likes,
            image: featuredData.blog.coverImage || featuredData.blog.thumbnailImage || 'https://via.placeholder.com/600x400?text=Blog+Image',
            excerpt: featuredData.blog.shortDescription,
            tags: featuredData.blog.tags || [],
            isFeatured: true
          };
          setFeaturedBlog(featured);
        }
        
      } catch (error) {
        console.error('Blog fetch error:', error);
        toast.error('Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Handle blog like
  const handleLike = async (blogId, e) => {
    e.stopPropagation();
    
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to like blogs');
      return;
    }

    try {
      const response = await fetch(`${BLOG_LIKE_API}/${blogId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        // Update local state
        setBlogPosts(prev => prev.map(blog => 
          blog.id === blogId 
            ? { ...blog, likes: data.likes }
            : blog
        ));
        
        // Track liked posts
        setLikedPosts(prev => new Set([...prev, blogId]));
        toast.success(data.message || 'Blog liked!');
      } else {
        toast.error(data.message || 'Failed to like blog');
      }
    } catch (error) {
      console.error('Like error:', error);
      toast.error('Network error');
    }
  };

  const openPost = (post) => {
    console.log('🔗 Opening post:', post);
    console.log('🔗 Navigating to:', `/blog/${post.id}`);
    // Use ID instead of slug since backend doesn't support slug-based fetch
    navigate(`/blog/${post.id}`);
  };

  if (loading) {
    return <PageLoader />;
  }

  if (blogPosts.length === 0) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'} flex items-center justify-center`}>
        <div className="text-center">
          <p className="text-xl mb-4">No blogs available</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-lg font-semibold text-white"
            style={{backgroundColor: '#862b2a'}}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Use featured blog from API or fallback to latest blog
  const featuredPost = featuredBlog || blogPosts[0];
  const otherPosts = blogPosts.filter(post => post.id !== featuredPost?.id);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'} transition-colors duration-200`}>
      {/* Header */}
      <div className={`${isDark ? 'bg-black' : 'bg-white'} py-12 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4" style={{color: '#862b2a'}}>Blog</h1>
          <p className={`text-center text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Discover expert tips, design inspiration, and the latest trends in mirrors and home décor
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Featured Post */}
        <div className="mb-16">
          {featuredPost && (
            <div 
              onClick={() => openPost(featuredPost)}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group`}
            >
            <div className="md:flex">
              <div className="md:w-1/2">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  className="w-full h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="md:w-1/2 p-6">
                <div className="mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{backgroundColor: '#862b2a'}}>
                    {featuredPost.category}
                  </span>
                </div>
                <h2 className={`text-xl md:text-2xl font-bold mb-3 group-hover:text-[#862b2a] transition-colors ${isDark ? 'text-white' : 'text-black'}`}>
                  {featuredPost.title}
                </h2>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4 leading-relaxed text-sm`}>
                  {featuredPost.excerpt}
                </p>
                <div className={`flex items-center gap-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                  <div className="flex items-center gap-2">
                    <FaUser size={14} />
                    <span>{featuredPost.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt size={14} />
                    <span>{featuredPost.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock size={14} />
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>
                <button className="flex items-center gap-2 font-semibold transition-colors group" style={{color: '#862b2a'}}>
                  Read More
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" size={14} />
                </button>
              </div>
            </div>
            </div>
          )}
        </div>

        {/* Other Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherPosts.map((post) => (
            <article 
              key={post.id} 
              onClick={() => openPost(post)}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer`}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{backgroundColor: '#862b2a'}}>
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className={`text-xl font-bold mb-3 group-hover:text-[#862b2a] transition-colors ${isDark ? 'text-white' : 'text-black'}`}>
                  {post.title}
                </h3>
                
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4 leading-relaxed text-sm`}>
                  {post.excerpt}
                </p>

                <div className={`flex items-center justify-between text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <FaUser size={10} />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaClock size={10} />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <FaEye size={10} />
                      <span>{post.views}</span>
                    </div>
                    <button 
                      onClick={(e) => handleLike(post.id, e)}
                      className={`flex items-center gap-1 transition-colors ${
                        likedPosts.has(post.id) ? 'text-red-500' : isDark ? 'text-gray-400 hover:text-red-500' : 'text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <FaHeart size={10} className={likedPosts.has(post.id) ? 'text-red-500' : ''} />
                      <span>{post.likes}</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {post.date}
                  </span>
                  <button className="flex items-center gap-1 text-sm font-semibold transition-colors group" style={{color: '#862b2a'}}>
                    Read More
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" size={12} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;