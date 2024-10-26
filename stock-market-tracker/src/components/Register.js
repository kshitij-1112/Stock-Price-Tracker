import React, { useRef, useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase';
import './Register.css';

const Register = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);

      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailRef.current.value,
        passwordRef.current.value
      );

      // Create a document for the user in Firestore
      await setDoc(doc(firestore, 'users', userCredential.user.uid), {
        email: userCredential.user.email,
        favorites: []
      });

      // Clear form fields after successful registration
      emailRef.current.value = '';
      passwordRef.current.value = '';
      passwordConfirmRef.current.value = '';

      // Redirect to login page using window.location
      window.location.href = '/login';
    } catch (err) {
      console.error('Error creating account:', err.code, err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input type="email" name="email" ref={emailRef} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" name="password" ref={passwordRef} required />
        </div>
        <div>
          <label>Confirm Password</label>
          <input type="password" name="confirm_password" ref={passwordConfirmRef} required />
        </div>
        <button type="submit" name="submit" disabled={loading}>Register</button>
      </form>
    </div>
  );
};

export default Register;
