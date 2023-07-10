import React, { useState, useContext } from 'react';
import AuthContext from '../store/Auth-context';

const Login = () => {
    const authCtx = useContext(AuthContext)

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const nameChangeHandler = (event) => {
        setName(event.target.value);
    }
    const emailChangeHandler = (event) => {
        setEmail(event.target.value);
    }

    const loginHandler = (event) => {
        event.preventDefault()
        authCtx.onLogin(name, email)
    }


    return (
        <div
            className="relative flex min-h-full justify-center  md:px-12 lg:px-0"
        >
            <div className="relative z-10 flex flex-1 flex-col bg-white px-4 py-10 shadow-2xl sm:justify-center md:flex-none md:px-28">
                <div className="mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0">
                    <h1 className='text-4xl leading-tight l'>Login</h1>
                    {/* text */}
                    <div className="mt-10">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Sign in to your account
                        </h2>
                    </div>

                    {/* form */}
                    <form action="#" className="mt-10 grid grid-cols-1 gap-y-8" onSubmit={loginHandler}>
                        <div className="mb-3 block text-sm font-medium text-gray-700 text-left">
                            <label htmlFor="name" className="mb-3 block text-sm font-medium text-gray-700">Your name</label>
                            <input type="text" id="name"
                                className="block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:bg-white focus:outline-none focus:ring-gray-500 sm:text-sm"
                                placeholder='name'
                                value={name}
                                onChange={nameChangeHandler}
                                required
                            />
                        </div>
                        <div className="mb-3 block text-sm font-medium text-gray-700 text-left">
                            <label htmlFor="email" className="mb-3 block text-sm font-medium text-gray-700">Your email</label>
                            <input type="email" id="email"
                                className="block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:bg-white focus:outline-none focus:ring-gray-500 sm:text-sm"
                                placeholder="name@flow.com"
                                value={email}
                                onChange={emailChangeHandler}
                                required />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className=" rounded-full p-1.5 w-full bg-gray-900 text-white hover:text-slate-100 hover:bg-gray-800 active:bg-gray-800 active:text-gray-100 focus-visible:outline-gray-600"
                            >
                                <span>
                                    Sign in <span aria-hidden="true">&rarr;</span>
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login