import { Link } from 'react-router-dom';
import "../styles/Cancel.css"; // Import the CSS file

function Cancel() {
    return (
        <div className="canceled-container">
            <h1 className="canceled-title">Order Canceled</h1>
            <p className="canceled-message">Unfortunately, there was an issue processing your payment. Your order has been canceled.</p>
            <Link to="/" className="home-link">Go back to Home</Link>
        </div>
    )
}

export default Cancel;
