import { Formik, Form, Field } from 'formik';
import axiosInstance from '../configs/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function LogInPage() {
  const [submitError, setSubmitError] = useState(null);
  const { login, user } = useAuth();

  if (user) {
    return <Navigate to="/" />;
  }

  const onSubmit = async (values) => {
    try {
      const response = await axiosInstance.post('/auth/signin', {
        username: values.username,
        password: values.password,
      });

      if (response.data && response.data.user && response.data.token) {
        login(response.data.user, response.data.token);
      } else {
        throw new Error('Login response missing user data or token.');
      }
    } catch (error) {
      const axiosError = error;
      const message = axiosError.response?.data?.message || axiosError.message || 'Login failed. Please check your credentials.';
      setSubmitError(message);
    }
  };

  const fieldCSS = "bg-white border rounded-md px-4 py-3";
  const buttonCSS = "bg-blue-500 rounded-xl px-4 py-3 mt-1 text-white";

  return (
    <div className='bg-blue-100 flex h-screen justify-center items-center px-8'>
      <div className='w-full md:w-[30rem] bg-white px-10 py-7 rounded-xl flex flex-col gap-10'>
        <div className='flex flex-col gap-4'>
          <img src='/assets/hcmut-logo.svg' className='h-28' />
          <div className='flex flex-col gap-1 items-center'>
            <h1 className='font-bold text-3xl'>Sign in</h1>
            <p>to continue to SCAMS</p>
          </div>
        </div>
        <Formik
          initialValues={{ username: "", password: "" }}
          validate={values => {
            const errors = {};
            if (!values.username) { errors.username = "Required." }
            // else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) { errors.email = "Invalid email address." }
            return errors;
          }}
          onSubmit={(values) => onSubmit(values)}
        >
          {({ isSubmitting }) => (
            <Form className='flex flex-col gap-4'>
              {submitError && <div style={{ color: 'red', marginBottom: '1rem' }}>{submitError}</div>}
              <div className='flex flex-col gap-1'>
                <label htmlFor="username">Username</label>
                <Field className={fieldCSS} name="username" placeholder="Enter your username" />
              </div>
              <div className='flex flex-col gap-1'>
                <label htmlFor="password">Password</label>
                <Field className={fieldCSS} name="password" type="password" placeholder="Enter your password" />
              </div>
              <button className={buttonCSS} type="submit">
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </Form>
          )}
        </Formik>
          <p className="text-lg text-gray-500 mb-6">
            Don't have an account? <a href="/register" className="text-[#E09891]">Click here</a>
          </p>
      </div>
    </div>
  )
}