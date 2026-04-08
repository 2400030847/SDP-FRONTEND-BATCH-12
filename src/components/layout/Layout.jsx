import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <div className="content">{children}</div>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
