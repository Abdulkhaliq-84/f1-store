import { useState, useEffect, useRef } from 'react'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import { userApi, fileApi, validateEmail, validatePhone, validatePassword } from '../utils'
import type { CreateUserDto, FormState } from '../types'
import './SignUp.css'

export default function SignUp() {
  // Form state
  const [formData, setFormData] = useState<CreateUserDto>({
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    profilePhotoPath: '',
  })

  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    error: null,
    success: false,
  })

  // File input ref for photo upload
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Selected file state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>('')

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, photo: 'Please select a valid image file (JPG, PNG, WEBP)' }))
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photo: 'Image size must be less than 5MB' }))
        return
      }
      
      setSelectedFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      
      // Clear any previous errors
      if (errors.photo) {
        setErrors(prev => ({ ...prev, photo: '' }))
      }
    }
  }

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long'
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Phone validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!validatePhone(formData.phoneNumber)) {
      newErrors.phone = 'Please enter a valid Saudi phone number (+966 5X XXX XXXX)'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else {
      const passwordValidation = validatePassword(formData.password)
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0]
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setFormState({ isSubmitting: true, error: null, success: false })

    try {
      let profilePhotoPath = ''
      
      // Upload profile photo first if selected
      if (selectedFile) {
        try {
          const uploadResponse = await fileApi.uploadProfilePhoto(selectedFile)
          profilePhotoPath = uploadResponse.filePath
        } catch (uploadError) {
          throw new Error(`Photo upload failed: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`)
        }
      }
      
      // Prepare user data with the uploaded photo path
      const userData: CreateUserDto = {
        ...formData,
        profilePhotoPath: profilePhotoPath
      }
      
      // Call the API to register the user
      await userApi.register(userData)
      
      setFormState({ isSubmitting: false, error: null, success: true })
      
      // Optional: Redirect to sign-in page or automatically sign in
      setTimeout(() => {
        window.location.href = '/signin'
      }, 2000)
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      setFormState({ isSubmitting: false, error: errorMessage, success: false })
    }
  }

  // Handle photo upload button click
  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  // useEffect to show success message
  useEffect(() => {
    if (formState.success) {
      const timer = setTimeout(() => {
        setFormState(prev => ({ ...prev, success: false }))
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [formState.success])

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <h1 className="signup-title">Join SpeedZone</h1>
        </div>

        {formState.success && (
          <div className="success-message">
            Account created successfully! Redirecting to sign in...
          </div>
        )}

        {formState.error && (
          <div className="error-message">
            {formState.error}
          </div>
        )}

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field full-width">
              <label htmlFor="username" className="field-label">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                className={`form-input ${errors.username ? 'error' : ''}`}
                value={formData.username}
                onChange={handleInputChange}
                required
              />
              {errors.username && <span className="field-error">{errors.username}</span>}
            </div>

            <div className="form-field half-width">
              <label htmlFor="phoneNumber" className="field-label">
                Phone Number (Saudi)
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="+966 5X XXX XXXX"
                className={`form-input ${errors.phone ? 'error' : ''}`}
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>

            <div className="form-field half-width">
              <label htmlFor="email" className="field-label">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="your.email@example.com"
                className={`form-input ${errors.email ? 'error' : ''}`}
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-field half-width">
              <label htmlFor="password" className="field-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Enter your password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <div className="form-field half-width">
              <label htmlFor="confirmPassword" className="field-label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Confirm your password"
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
              {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
            </div>

            <div className="form-field full-width">
              <label htmlFor="photo" className="field-label">
                Profile Photo (Optional)
              </label>
              <div className="photo-upload">
                {profilePhotoPreview ? (
                  <img 
                    src={profilePhotoPreview} 
                    alt="Profile preview" 
                    className="photo-preview" 
                  />
                ) : (
                  <UserCircleIcon aria-hidden="true" className="photo-placeholder" />
                )}
                <button
                  type="button"
                  className="photo-change-btn"
                  onClick={handlePhotoClick}
                >
                  {profilePhotoPreview ? 'Change Photo' : 'Choose Photo'}
                </button>
                <input
                  ref={fileInputRef}
                  id="photo"
                  name="photo"
                  type="file"
                  accept="image/*"
                  className="file-input-hidden"
                  onChange={handleFileChange}
                />
              </div>
              {errors.photo && <span className="field-error">{errors.photo}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => window.history.back()}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`submit-btn ${formState.isSubmitting ? 'loading' : ''}`}
              disabled={formState.isSubmitting}
            >
              {formState.isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
