import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userApi } from '../utils';
import type { SignInDto } from '../types';
import './SignIn.css';

export default function SignIn() {
	const [formData, setFormData] = useState<SignInDto>({
		email: '',
		password: ''
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	
	const { signIn, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated) {
			navigate('/');
		}
	}, [isAuthenticated, navigate]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
		// Clear error when user starts typing
		if (error) {
			setError(null);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			const response = await userApi.signIn(formData);
			
			if (response.success && response.user && response.token) {
				// Store user data and token in context
				signIn(response.user, response.token);
				// Redirect to home page
				navigate('/');
			} else {
				setError(response.message || 'Sign in failed');
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An unexpected error occurred');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="signin-page">
			<div className="signin-container">
				<div className="signin-header">
					<h1 className="signin-title">Sign in</h1>
				</div>

				<form className="signin-form" onSubmit={handleSubmit}>
					{error && (
						<div className="error-message">
							{error}
						</div>
					)}
					
					<div className="form-grid">
						<div className="form-field full-width">
							<label htmlFor="email" className="field-label">Email</label>
							<input
								id="email"
								name="email"
								type="email"
								placeholder="Enter your email"
								className="form-input"
								value={formData.email}
								onChange={handleInputChange}
								required
								disabled={isLoading}
							/>
						</div>

						<div className="form-field full-width">
							<label htmlFor="password" className="field-label">Password</label>
							<input
								id="password"
								name="password"
								type="password"
								placeholder="Enter your password"
								className="form-input"
								value={formData.password}
								onChange={handleInputChange}
								required
								disabled={isLoading}
							/>
						</div>
					</div>

					<div className="form-actions">
						<Link to="/signup" className="alt-link">Don't have an account? Sign up</Link>
						<button 
							type="submit" 
							className="submit-btn"
							disabled={isLoading || !formData.email || !formData.password}
						>
							{isLoading ? 'Signing In...' : 'Sign In'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
