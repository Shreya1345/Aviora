import { useState, useContext } from 'react';
import { AuthContext } from '../context/auth-context';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: '', stock: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return toast.error('Please select an image.');
    
    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('stock', formData.stock);
    data.append('image', image);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { Authorization: `Bearer ${user.token}` },
        body: data
      });
      const responseData = await res.json();
      
      if (res.ok) {
        toast.success('Product created successfully.');
        navigate('/admin/products');
      } else {
        toast.error(responseData.message || 'Error creating product.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Unable to create product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-4 sm:p-8">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-primary"><Icon icon="mdi:plus-box-outline" aria-hidden="true" />Add New Product</h2>
          <form onSubmit={handleSubmit}>
            <input className="input input-bordered mb-3 w-full" type="text" placeholder="Product Name" required onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <textarea className="textarea textarea-bordered mb-3 w-full" placeholder="Description" required rows={4} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            <input className="input input-bordered mb-3 w-full" type="number" min="0" step="0.01" placeholder="Price (USD)" required onChange={(e) => setFormData({...formData, price: e.target.value})} />
            <input className="input input-bordered mb-3 w-full" type="text" placeholder="Category" required onChange={(e) => setFormData({...formData, category: e.target.value})} />
            <input className="input input-bordered mb-3 w-full" type="number" placeholder="Stock Quantity" required onChange={(e) => setFormData({...formData, stock: e.target.value})} />
            <div className="form-control mb-4">
              <label className="label font-medium"><Icon icon="mdi:image-plus-outline" className="mr-2 text-primary" aria-hidden="true" />Upload Product Image (Cloudinary)</label>
              <input className="file-input file-input-bordered w-full" type="file" accept="image/*" required onChange={(e) => setImage(e.target.files[0])} />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              <Icon icon={loading ? 'mdi:loading' : 'mdi:cloud-upload-outline'} aria-hidden="true" />
              {loading ? 'Uploading & Creating...' : 'Publish Product'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default AddProduct;
