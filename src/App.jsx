import Contents from "./components/Contents";
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer";
import Banner from "./components/Banner.jsx";
import Redirectory from "./components/Redirectory.jsx";
import { UserProvider } from "./utility/UserContext.jsx"
import "./styles/App.css"
 import {Elements} from '@stripe/react-stripe-js';
 import {loadStripe} from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51OeoKWHrpeoNOecSZvpfRjcfWgyMOQpuSF4AJUcYfNIyte8u6FZmni9dh7hjPJxiwDJKizQGn8aWsFdUsuaDbc1N00i08K2sq0');
function App() {
  return (
    <>
      <Banner />
      <NavBar />
      <Redirectory />
       <Elements stripe={stripePromise}> 
      <UserProvider>
        <Contents />
      </UserProvider>
      </Elements> 
      <div className="placeholder-space"></div>
      <Footer />
    </>
  );
}

export default App;
