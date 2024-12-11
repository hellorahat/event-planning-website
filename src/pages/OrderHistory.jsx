import { useUser } from '../utility/UserContext';
import { useState, useEffect } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { getStorage, getDownloadURL, ref } from 'firebase/storage';

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const { user } = useUser(); // Access the user from context
    const storage = getStorage(); // Initialize Firebase Storage

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
    }, [user]); // Re-run the effect if user changes

    return (
        <div>
            <h1>Order History</h1>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <ul>
                    {orders.map((order) => (
                        <li key={order.orderId}>
                            <h3>Order ID: {order.orderId}</h3>
                            <div>
                                {order.products.map((product) => (
                                    <div
                                        key={product.productId}
                                        style={{ display: 'inline-block', margin: '10px' }}
                                    >
                                        {product.imageUrl ? (
                                            <img
                                                src={product.imageUrl}
                                                alt={`Product ${product.productId}`}
                                                style={{ width: '100px', height: '100px' }}
                                            />
                                        ) : (
                                            <p>Image not available for {product.productId}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default OrderHistory;
