import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./utility/CartContext.jsx";
import { FavoritesProvider } from "./utility/FavoritesContext.jsx";
import { AlertProvider } from "./utility/AlertContext.jsx";
import { UserProvider } from "./utility/UserContext.jsx";
import AlertComponent from "./components/AlertComponent.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/">
    <>
      <AlertProvider>
        <UserProvider>
          <CartProvider>
            <FavoritesProvider>
              <link
                href="https://fonts.googleapis.com/css2?family=Italianno&display=swap"
                rel="stylesheet"
              />
              <link
                href="https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap"
                rel="stylesheet"
              ></link>
              <link
                href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Patrick+Hand&display=swap"
                rel="stylesheet"
              ></link>
              <link
                href="https://fonts.googleapis.com/css2?family=Ledger&family=Luckiest+Guy&family=Patrick+Hand&display=swap"
                rel="stylesheet"
              ></link>
              <App />
              <AlertComponent />
            </FavoritesProvider>
          </CartProvider>
        </UserProvider>
      </AlertProvider>
    </>
  </BrowserRouter>
);
