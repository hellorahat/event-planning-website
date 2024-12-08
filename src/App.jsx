import Contents from "./components/Contents"
import NavBar from "./components/NavBar.jsx"
import Footer from "./components/Footer"
// import {Elements} from '@stripe/react-stripe-js';
// import {loadStripe} from '@stripe/stripe-js';

// const stripePromise = loadStripe('pk_test_51OeoKWHrpeoNOecSZvpfRjcfWgyMOQpuSF4AJUcYfNIyte8u6FZmni9dh7hjPJxiwDJKizQGn8aWsFdUsuaDbc1N00i08K2sq0');
function App() {

  return (
    <>
      <NavBar />
      {/* <Elements stripe={stripePromise}> */}
        <Contents />
      {/* </Elements> */}
      <Footer />
    </>
  )
}

export default App

