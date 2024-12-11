import { Link } from 'react-router-dom';
import "../styles/Success.css";

function Success() {
    return (
        <div className="success-container">
            <h1 className="success-title">Payment Successful!</h1>
            <p className="success-message">Thank you for your purchase. Your payment has been successfully processed.</p>
            <Link to="/" className="home-link">Go back to Home</Link>
        </div>
    );
}

export default Success;
