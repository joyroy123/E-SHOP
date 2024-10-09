import AdminNav from "../components/admin/AdminNav";

export const metadata = {
    title: "E-Shop Admin",
    description: "E-Shop Admin Dashboard",
};

const AdminLayout = ({children}) => {
    return ( 
        <div>
            <AdminNav />
            {children}
        </div>
     );
}
 
export default AdminLayout;