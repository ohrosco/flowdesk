import dynamic from "next/dynamic";

const BookClient = dynamic(() => import("./BookClient"), {
  ssr: false,
  loading: () => (
    <div style={{ background: "#0A0A07", minHeight: "100vh" }} />
  ),
});

export default function BookPage() {
  return <BookClient />;
}
