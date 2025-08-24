import React, { useState } from 'react';
import { API_BASE_URL } from '../constants';
import './AddProduct.css';

function AddProduct() {
  const [formData, setFormData] = useState({
    productName: '',
    price: '',
    team: '',
    driver: '',
    sizes: [] as string[],
    description: '',
    image: null as File | null
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);



  // F1 Teams from the project (based on actual images)
  const f1Teams = [
    'Mercedes',
    'Red Bull',
    'Ferrari',
    'McLaren',
    'Alpine',
    'Aston Martin',
    'Williams',
    'Haas',
    'Racing Bulls',
    'Kick'
  ];

  // F1 Drivers from the project (based on actual images)
  const f1Drivers = [
    'Lewis Hamilton',
    'Max Verstappen',
    'Charles Leclerc',
    'Lando Norris',
    'George Russell',
    'Fernando Alonso',
    'Oscar Piastri'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSizeChange = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent double submission
    
    // Client-side validation
    if (!formData.productName.trim()) {
      alert('Please enter a product name');
      return;
    }
    
         if (!formData.price || parseFloat(formData.price) <= 0) {
       alert('Please enter a valid price greater than 0');
       return;
     }
     

    
    // Additional validation
    if (formData.productName.trim().length > 200) {
      alert('Product name cannot exceed 200 characters');
      return;
    }
    
    if (formData.team && formData.team.trim().length > 100) {
      alert('Team name cannot exceed 100 characters');
      return;
    }
    
    if (formData.driver && formData.driver.trim().length > 100) {
      alert('Driver name cannot exceed 100 characters');
      return;
    }
    
    if (formData.sizes.length === 0) {
      alert('Please select at least one size');
      return;
    }
    
    if (formData.description && formData.description.trim().length > 1000) {
      alert('Description cannot exceed 1000 characters');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create FormData for multipart/form-data submission
      const formDataToSend = new FormData();
      
             // Add all form fields
       formDataToSend.append('ProductName', formData.productName.trim());
       
       // Ensure price is a valid number
       const price = parseFloat(formData.price);
       if (isNaN(price) || price <= 0) {
         throw new Error('Please enter a valid price greater than 0');
       }
       formDataToSend.append('Price', price.toString());
       

       
       // Only append optional fields if they have values
       if (formData.team && formData.team.trim()) {
         formDataToSend.append('Team', formData.team.trim());
       }
       if (formData.driver && formData.driver.trim()) {
         formDataToSend.append('Driver', formData.driver.trim());
       }
      // Add all selected sizes as comma-separated string
      if (formData.sizes.length > 0) {
        formDataToSend.append('Size', formData.sizes.join(', '));
      }
      if (formData.description && formData.description.trim()) {
        formDataToSend.append('Description', formData.description.trim());
      }
      
      // Add image if selected
      if (formData.image) {
        formDataToSend.append('Image', formData.image);
      }
      
      // Send to backend API
      console.log('Sending request to:', `${API_BASE_URL}/Products`);
      
      // Log form data contents
      console.log('Form data entries:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`  ${key}:`, value);
      }
      
      // Also log the raw form data object
      console.log('Raw form data object:', formData);
      
      // Log the actual request details
      console.log('Request method: POST');
      console.log('Request URL:', `${API_BASE_URL}/Products`);
      console.log('Request body type: FormData');
      
      // Log the actual FormData object
      console.log('FormData object:', formDataToSend);
      
      // Count FormData entries
      let entryCount = 0;
      for (let [key, value] of formDataToSend.entries()) {
        entryCount++;
      }
      console.log('FormData entries count:', entryCount);
      
      const response = await fetch(`${API_BASE_URL}/Products`, {
        method: 'POST',
        body: formDataToSend,
        // Don't set Content-Type header - let browser set it with boundary for multipart/form-data
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Check if response has content
      const contentLength = response.headers.get('content-length');
      console.log('Content-Length header:', contentLength);
      
      if (!response.ok) {
        let errorMessage = 'Failed to create product';
        try {
          // Log the response text for debugging
          const responseText = await response.text();
          console.log('Error response text:', responseText);
          
          if (responseText) {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.message || errorData.details || errorMessage;
          } else {
            errorMessage = response.statusText || errorMessage;
          }
        } catch (jsonError) {
          // If response is not valid JSON, use status text
          console.log('JSON parsing error:', jsonError);
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      let result;
      try {
        // Log the response text for debugging
        const responseText = await response.text();
        console.log('Success response text:', responseText);
        
        if (responseText) {
          result = JSON.parse(responseText);
        } else {
          result = { message: 'Product created successfully' };
        }
      } catch (jsonError) {
        // If success response is not valid JSON, handle gracefully
        console.warn('Response was not valid JSON:', jsonError);
        result = { message: 'Product created successfully' };
      }
      console.log('Product created successfully:', result);
      
      // Show success message
      alert('Product added successfully!');
      
             // Reset form
       setFormData({
         productName: '',
         price: '',
         team: '',
         driver: '',
         sizes: [],
         description: '',
         image: null
       });
      setPreviewImage(null);
      
      // Redirect back to admin products page
      window.history.back();
      
    } catch (error) {
      console.error('Error creating product:', error);
      
      let errorMessage = 'Unknown error occurred';
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Network error: Unable to connect to the server. Please check your internet connection and try again.';
        } else if (error.message.includes('Unexpected end of JSON input')) {
          errorMessage = 'Server error: Received invalid response from server. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      alert(`Error creating product: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    // Go back to admin products page
    window.history.back();
  };

  return (
    <div className="add-product-page">
      <div className="add-product-container">
        <div className="page-header">
          <button onClick={handleBack} className="back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Products
          </button>
          <h1>Add New Product</h1>
          <p>Create a new F1 product for your store</p>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-grid">
            {/* Product Name */}
            <div className="form-group">
              <label htmlFor="productName">Product Name *</label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                placeholder="Enter product name"
                required
                className="form-input"
              />
            </div>

                         {/* Price */}
             <div className="form-group">
               <label htmlFor="price" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                 Price (
                                 <img 
                  src="/Saudi_Riyal_Symbol.png" 
                  alt="SAR" 
                  style={{ width: '16px', height: '16px', objectFit: 'contain' }}
                />
                 ) *
               </label>
               <div className="price-input-container">
                                 <img 
                  src="/Saudi_Riyal_Symbol.png" 
                  alt="SAR" 
                  className="currency-symbol"
                  style={{ 
                    width: '20px', 
                    height: '20px', 
                    objectFit: 'contain',
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                />
                 <input
                   type="number"
                   id="price"
                   name="price"
                   value={formData.price}
                   onChange={handleInputChange}
                   placeholder="0.00"
                   min="0"
                   step="0.01"
                   required
                   className="form-input price-input"
                 />
               </div>
             </div>

             

                         {/* F1 Team */}
             <div className="form-group">
               <label htmlFor="team">F1 Team (Optional)</label>
               <select
                 id="team"
                 name="team"
                 value={formData.team}
                 onChange={handleInputChange}
                 className="form-select"
               >
                 <option value="">No Specific Team</option>
                 {f1Teams.map(team => (
                   <option key={team} value={team}>{team}</option>
                 ))}
               </select>
             </div>

                         {/* F1 Driver */}
             <div className="form-group">
               <label htmlFor="driver">F1 Driver (Optional)</label>
               <select
                 id="driver"
                 name="driver"
                 value={formData.driver}
                 onChange={handleInputChange}
                 className="form-select"
               >
                 <option value="">No Specific Driver</option>
                 {f1Drivers.map(driver => (
                   <option key={driver} value={driver}>{driver}</option>
                 ))}
               </select>
             </div>

                                                       {/* Size Selection */}
               <div className="form-group">
                 <label>Available Sizes *</label>
                 <div className="size-options">
                   <label className="size-option">
                     <input
                       type="checkbox"
                       value="S"
                       checked={formData.sizes.includes('S')}
                       onChange={() => handleSizeChange('S')}
                     />
                     <span className="size-label">S</span>
                   </label>
                   <label className="size-option">
                     <input
                       type="checkbox"
                       value="M"
                       checked={formData.sizes.includes('M')}
                       onChange={() => handleSizeChange('M')}
                     />
                     <span className="size-label">M</span>
                   </label>
                   <label className="size-option">
                     <input
                       type="checkbox"
                       value="L"
                       checked={formData.sizes.includes('L')}
                       onChange={() => handleSizeChange('L')}
                     />
                     <span className="size-label">L</span>
                   </label>
                   <label className="size-option">
                     <input
                       type="checkbox"
                       value="XL"
                       checked={formData.sizes.includes('XL')}
                       onChange={() => handleSizeChange('XL')}
                     />
                     <span className="size-label">XL</span>
                   </label>
                   <label className="size-option">
                     <input
                       type="checkbox"
                       value="XXL"
                       checked={formData.sizes.includes('XXL')}
                       onChange={() => handleSizeChange('XXL')}
                     />
                     <span className="size-label">XXL</span>
                   </label>
                 </div>
                 <p className="form-help">Select all sizes this product will be available in</p>
               </div>

              {/* Product Description */}
              <div className="form-group description-group">
                <label htmlFor="description">Product Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description..."
                  rows={4}
                  className="form-textarea"
                />
              </div>

            {/* Image Upload */}
            <div className="form-group image-upload-group">
              <label htmlFor="image">Product Image (Optional)</label>
              <div className="image-upload-container">
                                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="image-input"
                  />
                <div className="upload-area">
                  {previewImage ? (
                    <div className="image-preview">
                      <img src={previewImage} alt="Preview" />
                      <button 
                        type="button" 
                        onClick={() => {
                          setPreviewImage(null);
                          setFormData(prev => ({ ...prev, image: null }));
                        }}
                        className="remove-image-btn"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"/>
                        <polyline points="17,2 22,6 17,10"/>
                        <line x1="3" y1="14" x2="8" y2="9"/>
                        <polyline points="9,9 14,4 19,9"/>
                      </svg>
                      <p>Click to upload image</p>
                      <span>PNG, JPG, WEBP up to 5MB</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" onClick={handleBack} className="btn-secondary">
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="loading-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                  Creating Product...
                </>
              ) : (
                'Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
