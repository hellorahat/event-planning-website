import { useUser } from '../utility/UserContext';
import { useState, useEffect } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { getStorage, getDownloadURL, ref } from 'firebase/storage';
import '../styles/OrderHistory.css';

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const { user } = useUser();
    const storage = getStorage();
    const [expandedOrders, setExpandedOrders] = useState({}); // Track expanded orders

    useEffect(() => {
        if (user?.uid) {
            const fetchOrders = async () => {
                try {
                    const userId = user.uid;
                    const userOrdersRef = doc(firestore, 'orders', userId);
                    const userOrdersSnapshot = await getDoc(userOrdersRef);

                    if (userOrdersSnapshot.exists()) {
                        const userOrders = userOrdersSnapshot.data();
                        console.log("Fetched user orders:", userOrders); // Debug

                        const fetchedOrders = await Promise.all(
                            Object.entries(userOrders).map(async ([orderId, products]) => {
                                const productsWithImages = await Promise.all(
                                    products.map(async (productId) => {
                                        try {
                                            const imageRef = ref(storage, `images/${productId}`);
                                            const imageUrl = await getDownloadURL(imageRef);
                                            return { productId, imageUrl };
                                        } catch (error) {
                                            console.error(`Error fetching image for ${productId}:`, error);
                                            return { productId, imageUrl: null };
                                        }
                                    })
                                );
                                return { orderId, products: productsWithImages };
                            })
                        );

                        setOrders(fetchedOrders);
                    } else {
                        console.log('No orders found for this user.');
                    }
                } catch (error) {
                    console.error('Error fetching orders:', error);
                }
            };

            fetchOrders();
        }
    }, [user]);

    const toggleOrder = (orderId) => {
        setExpandedOrders((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    };

    return (
        <div className="order-history-container">
            <h1 className='center-text'>Order History</h1>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <ul className="order-list">
                    {orders.map((order) => (
                        <li key={order.orderId} className="order-item">
                            <div
                                className="order-header"
                                onClick={() => toggleOrder(order.orderId)}
                            >
                                <h3 className='custom-text'>Order ID: {order.orderId}</h3>
                                <button className="toggle-button">
                                    {expandedOrders[order.orderId] ? '-' : '+'}
                                </button>
                            </div>
                            <div className={`order-panel ${expandedOrders[order.orderId] ? 'open' : ''}`}>
                                <div className="product-container">
                                    {order.products.map((product) => (
                                        <div key={product.productId} className="product-item">
                                            {product.imageUrl ? (
                                                <img
                                                    src={product.imageUrl}
                                                    alt={`Product ${product.productId}`}
                                                    className="product-image"
                                                />
                                            ) : (
                                                <p>Image not available for {product.productId}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default OrderHistory;
