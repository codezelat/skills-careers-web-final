import NavBar from "@/components/navBar";
import AdminLoginForm from "./adminlogin";
import AdminSignUpForm from "./adminsignup";

function AdminPage() {
  return (
    <div className="p-4">
      <div className="grid justify-center">
        <NavBar />
      </div>

      <div className="grid justify-items-center">
        <h1 className="text-2xl font-bold mb-4">Admin portal</h1>
      </div>

      <div className="container mx-auto py-14 w-9/12">
      <div className="grid xl:grid-cols-2 sm:grid-cols-1">
        <div>
          <AdminLoginForm/>
        </div>
        <div>
          <AdminSignUpForm/>
        </div>
      </div>

      </div>

    </div>
  );
}

export default AdminPage;
