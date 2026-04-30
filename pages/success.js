// where the thank you page is
import { useRouter } from "next/router";

export default function SuccessPage() {
  const router = useRouter();
  const { checkout_id } = router.query;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
          padding: "40px",
          border: "1px solid #e5e5e5",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ fontSize: "32px", marginBottom: "16px" }}>
          Thank you 🎉
        </h1>

        <p style={{ fontSize: "18px", marginBottom: "12px" }}>
          Your payment was successful.
        </p>

        <p style={{ color: "#666", marginBottom: "24px" }}>
          We appreciate your support and your subscription is now being processed.
        </p>

        {checkout_id && (
          <p style={{ fontSize: "14px", color: "#999" }}>
            Checkout ID: {checkout_id}
          </p>
        )}

        <button
          onClick={() => router.push("/")}
          style={{
            marginTop: "24px",
            padding: "12px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}