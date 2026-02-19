import './globals.css'

export const metadata = {
    title: 'OpenOA Web App',
    description: 'Deploy OpenOA to Vercel',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
