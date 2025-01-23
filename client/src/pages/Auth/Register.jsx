import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useRegister } from '../../hooks/useRegister'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pic, setPic] = useState(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('') // New state for confirm password
  const [error, setError] = useState('') // Error message state for password mismatch

  const { register } = useRegister()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setError('') // Clear any previous errors
    await register(name, email, password, pic)
    navigate(from, { replace: true });
  }

  return (
    <div>
      <div className="register-container flex items-center justify-center flex-col h-screen bg-customBG text-textColor">
        <div className="form border border-gray-600 rounded p-5 sm:w-96 w-80">
          <h1 className="text-center sm:mb-9 mb-5 sm:mt-2 text-3xl">Sign Up</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-5">
            <input
              className="border-2 border-textColor rounded-lg outline-none px-4 py-2 w-full"
              type="text"
              name="name"
              id="name"
              required
              placeholder="Name here..."
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="border-2 border-textColor rounded-lg outline-none px-4 py-2 w-full"
              type="email"
              name="email"
              id="email"
              required
              placeholder="Email here..."
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="border-2 border-textColor rounded-lg outline-none px-4 py-2 w-full"
              type="password"
              name="password"
              id="password"
              required
              placeholder="Password here..."
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className="border-2 border-textColor rounded-lg outline-none px-4 py-2 w-full"
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              required
              placeholder="Confirm password here..."
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <input
              className="border-2 border-textColor rounded-lg outline-none px-4 py-2 w-full"
              type="file"
              accept="image/*"
              name="pic"
              id="profilePic"
              onChange={(e) => setPic(e.target.files[0])}
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              className="bg-zinc-900 text-white px-4 py-2 w-full rounded-lg mb-3 sm:mb-5"
              type="submit"
            >
              Submit
            </button>
          </form>
          <p>
            Already registered?{' '}
            <Link
              className="font-bold hover:border-b-2 border-zinc-700"
              to="/login"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
