export const metadata = {
  title: "English Speaking AI",
  description: "Practice English speaking with AI feedback",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
