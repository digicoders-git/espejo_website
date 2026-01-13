import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaCalendarAlt, FaUser, FaClock, FaEye, FaHeart, FaTag } from 'react-icons/fa';
import PageLoader from './PageLoader';

const BLOG_API = "https://glassadminpanelapi.onrender.com/api/blogs";

const BlogDetailPage = () => {
  const { id } = useParams(); // Changed from slug to id
  const navigate = useNavigate();
  const { isDark } = useTheme();
  
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        console.log('🔍 Fetching blog with ID:', id);
        const response = await fetch(`${BLOG_API}/${id}`);
        const data = await response.json();
        
        console.log('📊 Blog Detail API Response:', { status: response.status, data });
        
        if (response.ok && data.blog) {
          const blogData = {
            id: data.blog._id,
            slug: data.blog.slug,
            title: data.blog.title,
            content: data.blog.content,
            shortDescription: data.blog.shortDescription,
            coverImage: data.blog.coverImage,
            thumbnailImage: data.blog.thumbnailImage,
            category: data.blog.category,
            tags: data.blog.tags || [],
            authorName: data.blog.authorName,
            views: data.blog.views,
            likes: data.blog.likes,
            readTime: data.blog.readTime,
            publishedAt: new Date(data.blog.publishedAt || data.blog.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            metaTitle: data.blog.metaTitle,
            metaDescription: data.blog.metaDescription
          };
          
          setBlog(blogData);
        } else {
          toast.error('Blog not found');
          navigate('/blog');
        }
      } catch (error) {
        console.error('Blog fetch error:', error);
        toast.error('Failed to load blog');
        navigate('/blog');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id, navigate]);

  const handleLike = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to like blogs');
      return;
    }

    try {
      const response = await fetch(`${BLOG_API}/${blog.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setBlog(prev => ({ ...prev, likes: data.likes }));
        setLiked(true);
        toast.success(data.message || 'Blog liked!');
      } else {
        toast.error(data.message || 'Failed to like blog');
      }
    } catch (error) {
      console.error('Like error:', error);
      toast.error('Network error');
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!blog) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'} flex items-center justify-center`}>
        <div className="text-center">
          <p className="text-xl mb-4">Blog not found</p>
          <button 
            onClick={() => navigate('/blog')}
            className="px-6 py-3 rounded-lg font-semibold text-white"
            style={{backgroundColor: '#862b2a'}}
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'} transition-colors duration-200`}>
      {/* Header */}
      <div className={`${isDark ? 'bg-black' : 'bg-white'} py-6 md:py-8 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <button 
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 mb-4 md:mb-6 hover:text-[#862b2a] transition-colors text-sm md:text-base"
          >
            <FaArrowLeft size={14} />
            <span>Back to Blogs</span>
          </button>
          
          <div className="mb-3 md:mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{backgroundColor: '#862b2a'}}>
              {blog.category}
            </span>
          </div>
          
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 leading-tight" style={{color: '#862b2a'}}>
            {blog.title}
          </h1>
          
          <div className={`flex flex-wrap items-center gap-3 md:gap-6 text-xs md:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-3 md:mb-4`}>
            <div className="flex items-center gap-1 md:gap-2">
              <FaUser size={12} />
              <span className="truncate">{blog.authorName}</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <FaCalendarAlt size={12} />
              <span className="truncate">{blog.publishedAt}</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <FaClock size={12} />
              <span>{blog.readTime}</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <FaEye size={12} />
              <span>{blog.views} views</span>
            </div>
          </div>
          
          <p className={`text-sm md:text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
            {blog.shortDescription}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Cover Image */}
        {blog.coverImage && (
          <div className="mb-6 md:mb-8">
            <img 
              src={blog.coverImage} 
              alt={blog.title}
              className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover rounded-xl md:rounded-2xl shadow-lg"
            />
          </div>
        )}

        {/* Blog Content */}
        <div className={`mb-6 md:mb-8`}>
          <div 
            dangerouslySetInnerHTML={{ __html: blog.content }}
            className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-sm md:text-base
              prose prose-sm md:prose-lg max-w-none ${isDark ? 'prose-invert' : ''}
              prose-headings:text-[#862b2a] prose-links:text-[#862b2a] prose-strong:text-[#862b2a]
              prose-p:mb-4 prose-headings:mb-4 prose-headings:mt-6
              prose-img:rounded-lg prose-img:shadow-md
              prose-blockquote:border-l-[#862b2a] prose-blockquote:bg-opacity-10
              ${isDark ? 'prose-blockquote:bg-gray-800' : 'prose-blockquote:bg-gray-100'}
            `}
          />
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mb-6 md:mb-8">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4" style={{color: '#862b2a'}}>Tags</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span 
                  key={index}
                  className={`px-3 py-1 rounded-full text-xs md:text-sm transition-colors hover:bg-[#862b2a] hover:text-white ${
                    isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  <FaTag size={10} className="inline mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Like Button */}
        <div className={`flex items-center justify-center py-6 md:py-8 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold transition-all transform hover:scale-105 ${
              liked 
                ? 'bg-red-500 text-white shadow-lg' 
                : isDark 
                  ? 'bg-gray-800 text-gray-300 hover:bg-red-500 hover:text-white shadow-md' 
                  : 'bg-gray-200 text-gray-700 hover:bg-red-500 hover:text-white shadow-md'
            }`}
          >
            <FaHeart size={14} className={liked ? 'text-white' : ''} />
            <span className="text-sm md:text-base">{blog.likes} Likes</span>
          </button>
        </div>

        {/* Back to Top Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDark 
                ? 'bg-gray-800 text-gray-300 hover:bg-[#862b2a] hover:text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-[#862b2a] hover:text-white'
            }`}
          >
            Back to Top
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;