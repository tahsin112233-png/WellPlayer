export const metadata = {
  title: "WellPlayer",
  description: "Streaming Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ background: "#000", color: "#fff" }}>
        {children}
      </body>
    </html>
  );
}
