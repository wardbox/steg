import {
  LoginForm,
  SignupForm,
  VerifyEmailForm,
  ForgotPasswordForm,
  ResetPasswordForm,
} from 'wasp/client/auth'
import { Link } from 'react-router-dom'
import './auth.css'

import type { CustomizationOptions } from 'wasp/client/auth'
import { Footprints } from '@phosphor-icons/react'

export const authAppearance: CustomizationOptions['appearance'] = {
  colors: {
    brand: 'hsl(4 85% 65%)', // Primary coral
    brandAccent: 'hsl(199 95% 74%)', // Ocean blue
    submitButtonText: 'hsl(0 0% 100%)', // White text
  },
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='mx-auto flex max-w-xl flex-col items-center px-12 py-24 pt-12 font-sans animate-in fade-in sm:px-0 2xl:py-48'>
      <div className='circle mb-8 flex h-16 w-16 items-center justify-center bg-primary text-primary-foreground'>
        <Footprints size={32} weight='bold' />
      </div>
      {children}
    </div>
  )
}

export function Login() {
  return (
    <Layout>
      <div className='login'>
        <LoginForm appearance={authAppearance} />
      </div>
      <br />
      <span className='login-text text-sm font-medium'>
        Don&apos;t have an account yet?{' '}
        <Link to='/signup' className='underline'>
          go to signup
        </Link>
        .
      </span>
      <br />
      <span className='login-text text-sm font-medium'>
        Forgot your password?{' '}
        <Link to='/request-password-reset' className='underline'>
          reset it
        </Link>
        .
      </span>
    </Layout>
  )
}

export function Signup() {
  return (
    <Layout>
      <div className='login login-text'>
        <SignupForm appearance={authAppearance} />
      </div>
      <br />
      <span className='login-text text-sm font-medium'>
        I already have an account (
        <Link to='/login' className='underline'>
          go to login
        </Link>
        ).
      </span>
    </Layout>
  )
}

export function EmailVerification() {
  return (
    <Layout>
      <div className='login'>
        <VerifyEmailForm appearance={authAppearance} />
      </div>
      <br />
      <span className='login-text text-sm font-medium'>
        If everything is okay,{' '}
        <Link to='/login' className='underline'>
          go to login
        </Link>
      </span>
    </Layout>
  )
}

export function RequestPasswordReset() {
  return (
    <Layout>
      <div className='login login-text'>
        <ForgotPasswordForm appearance={authAppearance} />
      </div>
    </Layout>
  )
}

export function PasswordReset() {
  return (
    <Layout>
      <div className='login login-text'>
        <ResetPasswordForm appearance={authAppearance} />
      </div>
      <br />
      <span className='login-text text-sm font-medium'>
        If everything is okay,{' '}
        <Link to='/login' className='underline'>
          go to login
        </Link>
      </span>
    </Layout>
  )
}
