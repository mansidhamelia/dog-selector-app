
const Login = () => {
    return (
        <div
            className="relative flex min-h-full justify-center md:px-12 lg:px-0"
        >
            <div className="relative z-10 flex flex-1 flex-col bg-white px-4 py-10 shadow-2xl sm:justify-center md:flex-none md:px-28">
                <div className="mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0">
                    <h1>Login</h1>
                    {/* text */}

                    <div className="mt-10">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Sign in to your account
                        </h2>
                    </div>

                    {/* form */}
                    <form action="#" className="mt-10 grid grid-cols-1 gap-y-8">
                        <div className="mb-3 block text-sm font-medium text-gray-700 text-left">
                            <label htmlFor="email" className="mb-3 block text-sm font-medium text-gray-700">Your email</label>
                            <input type="email" id="email" className="block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500 sm:text-sm" placeholder="name@flowbite.com" required />
                        </div>
                        <div className="mb-3 block text-sm font-medium text-gray-700 text-left">
                            <label htmlFor="password" className="mb-3 block text-sm font-medium text-gray-700">Your password</label>
                            <input type="password" id="password" className="block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500 sm:text-sm" required />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className=" rounded-full w-full bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"
                            >
                                <span>
                                    Sign in <span aria-hidden="true">&rarr;</span>
                                </span>
                            </button>
                        </div>
                    </form>

                </div>
            </div>
            <div className="hidden sm:contents lg:relative lg:block lg:flex-1">
                <img src="" alt="" />
            </div>

        </div>

    )
}

export default Login