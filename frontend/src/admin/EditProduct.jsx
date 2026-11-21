import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/auth-context';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';

const EditProduct = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '', stock: '' });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      setFormData({ name: data.name, description: data.description, price: data.price, category: data.category, stock: data.stock });
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('stock', formData.stock);
    if (image) data.append('image', image);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${user.token}` },
        body: data
      });
      const responseData = await res.json();
      if (!res.ok) throw new Error(responseData.message || 'Unable to update product.');
      toast.success('Product updated successfully!');
      navigate('/admin/products');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Unable to update product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-6 sm:p-8">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-primary"><Icon icon="mdi:pencil-outline" aria-hidden="true" />Edit Product</h2>
          <form onSubmit={handleSubmit}>
            <input className="input input-bordered mb-3 w-full" type="text" placeholder="Product Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <textarea className="textarea textarea-bordered mb-3 w-full" placeholder="Description" required rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            <input className="input input-bordered mb-3 w-full" type="number" min="0" step="0.01" placeholder="Price (USD)" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
            <input className="input input-bordered mb-3 w-full" type="text" placeholder="Category" required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
            <input className="input input-bordered mb-3 w-full" type="number" placeholder="Stock" required value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} />
            <div className="form-control mb-4">
              <label className="label font-medium"><Icon icon="mdi:image-edit-outline" className="mr-2 text-primary" aria-hidden="true" />Replace Image (Optional)</label>
              <input className="file-input file-input-bordered w-full" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              <Icon icon={loading ? 'mdi:loading' : 'mdi:content-save-outline'} aria-hidden="true" />
              {loading ? 'Updating...' : 'Update Product'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default EditProduct;
