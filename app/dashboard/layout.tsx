import StoreProvider from '@/app/store/provider';
import DashboardShell from '@/app/ui/dashboard/dashboard-shell';
import SideNav from '@/app/ui/dashboard/sidenav';
import DeleteConfirmModal from '@/app/ui/invoices/delete-confirm-modal';
import ToastContainer from '@/app/ui/toast-container';
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <DashboardShell sidebar={<SideNav />}>
        {children}
      </DashboardShell>
      <DeleteConfirmModal />
      <ToastContainer />
    </StoreProvider>
  );
}