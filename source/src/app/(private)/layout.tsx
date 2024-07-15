import MainLayout from '@/components/sidebar/main-layout'
export default function LayoutWithSidebar({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <MainLayout>{children}</MainLayout>
}
