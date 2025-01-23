import UserSidebar from "@/components/UserSidebar"

const UserLayout = ({ children }) => {
    return (
        <div className="grid grid-cols-12">
            <div className="col-span-4 h-screen">
                <UserSidebar />
            </div>
            <div className="col-span-8 bg-gray-100 h-screen">
                {children}
            </div>
        </div>
    )
}

export default UserLayout
