import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./orderSuccess.module.css";

const OrderSuccess = () => {
    const navigate = useNavigate();

    const order = JSON.parse(localStorage.getItem("latest-order"));
    const paymentLabel =
        order?.paymentMethod === "online" ? "Online Payment (UPI)" : "Cash on Delivery";

    return (
        <div className={styles.page}>
            <div className={styles.card}>

                {/* ✅ Success Icon */}
                <div className={styles.iconWrapper}>
                    <div className={styles.checkmark}></div>
                </div>

                {/* ✅ Text */}
                <h2 className={styles.title}>Order Placed Successfully 🎉</h2>
                <p className={styles.subtitle}>
                    Thank you for your purchase! Your order is being processed and will be delivered soon.
                </p>

                {/* ✅ Optional Info */}
                <div className={styles.infoBox}>
                    <p>Estimated Delivery: <b>15-20 Minutes</b></p>
                    <p>Payment Method: <b>{paymentLabel}</b></p>
                </div>

                {/* ✅ Buttons */}
                <div className={styles.actions}>
                    <button
                        className={styles.primaryBtn}
                        onClick={() => navigate("/")}
                    >
                        Continue Shopping
                    </button>

                    <button
                        className={styles.secondaryBtn}
                        onClick={() => navigate("/receipt")}
                    >
                        View Receipt
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;