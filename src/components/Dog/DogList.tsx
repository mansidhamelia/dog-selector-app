import React, { useContext } from "react"
import DogInfo from "./DogInfoTable";
import AuthContext from "../../store/Auth-context";


const DogList = () => {
    const authCtx = useContext(AuthContext)

    const logoutHandler = (event) => {
        event.preventDefault()
        authCtx.onLogout()
    }

    return (
        <div className="relative justify-center  md:px-12 lg:px-0 w-full">
            {/* search bar */}
            <div className="sticky top-0 z-40 flex h-16 shrink-0 justify-between items-center gap-x-6 border-b border-white/5 bg-gray-900 px-4 shadow-sm sm:px-6 lg:px-8">
                <div className="flex flex-1 text-white">
                    <span>LOGO</span>
                </div>
                <button
                    type="button"
                    className="inline-flex items-center rounded-md  px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-gray-50 hover:text-gray-900"
                    onClick={logoutHandler}
                >
                    Sign Out
                </button>
            </div>

            {/* filters */}
            <section>
                <DogInfo />
            </section>
        </div >
    )
}

export default DogList

